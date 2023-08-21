import { currentUser } from "@clerk/nextjs";
import { fetchUser, getActivity } from "@lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const activities = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          <>
            {activities.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <div className="relative h-9 w-9">
                    <Image
                      src={activity.author.image}
                      alt={`${activity.author.username}_image`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                  {/* <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">
                      {activity.author.name}
                    </h4>
                    <h5 className="text-small-medium text-gray-1">
                      @{activity.author.username}
                    </h5>
                  </div> */}
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activities yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
