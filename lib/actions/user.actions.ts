"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "@lib/mongoose";
import User from "@lib/models/user.model";
import Thread from "@lib/models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface UserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser(user: UserParams): Promise<void> {
  try {
    await connectToDB();
    const { userId, bio, name, path, username, image } = user;

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: "Community",
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB();

    //TODO: Populate community
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "author",
        model: User,
        select: "id name image",
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads: ${error.message}`);
  }
}

export async function fetchUsers(params: {
  userId: string;
  searchString?: string;
  pageSize?: number;
  pageNumber?: number;
  sortBy: SortOrder;
}) {
  const {
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  } = params;
  try {
    await connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    await connectToDB();

    //find all threads created by user
    const userThreads = await Thread.find({ author: userId });

    //collect all child threads ids (replies)

    const childThreadsIds = userThreads.reduce(
      (acc, userThread) => acc.concat(userThread.children),
      []
    );

    const replies = await Thread.find({
      _id: { $in: childThreadsIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "username name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
