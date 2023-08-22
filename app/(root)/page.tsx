// "use client";
//app/page.tsx
// import { UserButton } from "@clerk/nextjs";

import { fetchPosts } from "@lib/actions/thread.actions";
import { fetchUser } from "@lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Pagination from "@components/shared/Pagination";

import ThreadCard from "@components/cards/ThreadCard";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  // console.log(user);
  const userInfo = await fetchUser(user?.id || "");
  // console.log(userInfo);
  if (user && !userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.posts?.length === 0 ? (
          <p>No threads found</p>
        ) : (
          <>
            {result?.posts?.map((post) => (
              <ThreadCard
                key={post._id}
                id={JSON.stringify(post._id)}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={Boolean(result?.isNext)}
      />
    </>
  );
}
