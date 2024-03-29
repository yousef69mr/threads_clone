import ThreadCard from "@components/cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@lib/actions/user.actions";
import Comment from "@components/forms/Comment";
import { fetchThreadById } from "@lib/actions/thread.actions";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const page = async (props: Props) => {
  const { params } = props;

  if (!params.id) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id);
  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={JSON.stringify(thread._id)}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={params.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
          accountId={user.id}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={JSON.stringify(childItem._id)}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default page;
