"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "@lib/mongoose";
import User from "@lib/models/user.model";
import Thread from "@lib/models/thread.model";

interface ThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread(params: ThreadParams): Promise<void> {
  const { text, path, author, communityId = null } = params;
  try {
    await connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    //update user models
    await User.findByIdAndUpdate(author, {
      $push: { threads: [createdThread._id] },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.error("Error creating thread", error.message);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // fetch the posts that have no parents (top-level threads...)
    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          select: "_id name parentId image",
          model: User,
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    console.error("Error fetching posts ", error.message);
  }
}

export async function fetchThreadById(id: string) {
  try {
    await connectToDB();
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        select: "_id id name image",
        model: User,
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            select: "_id id name parentId image",
            model: User,
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              select: "_id id name parentId image",
              model: User,
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    console.error("Error fetching thread ", error.message);
  }
}

interface CommentParams {
  commentText: string;
  userId: string;
  threadId: string;
  path: string;
}
export async function addCommentToThread(params: CommentParams): Promise<void> {
  const { threadId, path, userId, commentText } = params;
  try {
    await connectToDB();

    console.log(params);
    // find orginal thread by its id
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // create new thread with comment text
    const commentThread = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    //save new thread
    const savedCommentThread = await commentThread.save();

    //update original thread to include the new comment
    originalThread.children.push(savedCommentThread._id);

    //save original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    console.error("Error adding comment to thread", error.message);
  }
}
