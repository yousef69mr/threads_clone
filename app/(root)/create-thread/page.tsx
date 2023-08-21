import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@lib/actions/user.actions";
import PostThread from "@components/forms/PostThread";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  //   console.log(userInfo)
  return (
    <section>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={JSON.stringify(userInfo._id)} />
    </section>
  );
};

export default page;
