import Link from "next/link";
import Image from "next/image";
import { formatDateString } from "@lib/utils";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = (props: Props) => {
  const {
    id,
    currentUserId,
    parentId,
    content,
    community,
    author,
    createdAt,
    comments,
    isComment,
  } = props;
  return (
    <article
      className={`flex w-full flex-col rounded-xl  ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                fill
                alt={author.name}
                className="rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-light-2 text-small-regular">{content}</p>

            <div className={`mt-5 flex flex-col gap-3 ${isComment && "mb-10"}`}>
              <div className="flex gap-3.5">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="heart"
                  height={24}
                  width={24}
                  className="object-contain cursor-pointer"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src={"/assets/reply.svg"}
                    alt="reply"
                    height={24}
                    width={24}
                    className="object-contain cursor-pointer"
                  />
                </Link>
                <Image
                  src={"/assets/repost.svg"}
                  alt="repost"
                  height={24}
                  width={24}
                  className="object-contain cursor-pointer"
                />
                <Image
                  src={"/assets/share.svg"}
                  alt="share"
                  height={24}
                  width={24}
                  className="object-contain cursor-pointer "
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* todo:  Delete Thread */}
        {/* todo :show comment logos */}

        {!isComment && community && (
          <Link
            href={`/communities/${community.id}`}
            className="mt-5 flex items-center"
          >
            <p className="text-subtle-medium text-gray-1">
              {formatDateString(createdAt)} - {community.name} Community
            </p>

            <div className="relative ml-1 w-14 h-14">
              <Image
                src={community.image}
                alt={`${community.name}_image`}
                fill
                className="rounded-full object-cover"
              />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
};

export default ThreadCard;
