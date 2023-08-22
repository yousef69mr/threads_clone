import Image from "next/image";
import Link from "next/link";

import { Button } from "@components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  members: {
    id: string;
    image: string;
    username: string;
    name: string;
  }[];
  createdBy: { id: string; image: string; username: string; name: string };
}

function CommunityCard({
  id,
  name,
  username,
  imgUrl,
  bio,
  members,
  createdBy,
}: Props) {
  const membersIds = members.reduce(
    (acc: string[], member) => acc.concat(member.id),
    []
  );

  const membersLimit = !membersIds.includes(createdBy.id) ? 3 : 2;

  return (
    <article className="community-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/communities/${id}`} className="relative h-14 w-14">
            <Image
              src={imgUrl}
              alt="community_logo"
              fill
              className="rounded-full object-cover"
            />
          </Link>

          <div>
            <Link href={`/communities/${id}`}>
              <h4 className="text-base-semibold text-light-1">{name}</h4>
            </Link>
            <p className="text-small-medium text-gray-1">@{username}</p>
          </div>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`/profile/${createdBy.id}`}
                  className="flex items-center justify-center flex-col gap-1"
                >
                  <div className="relative w-7 h-7">
                    <Image
                      src={createdBy.image}
                      alt={`user_${createdBy.username}`}
                      fill
                      className={`rounded-full object-cover`}
                    />
                  </div>
                  <h3 className="text-small-medium text-gray-1">founder</h3>
                </Link>
              </TooltipTrigger>
              <Link href={`/profile/${createdBy.id}`}>
                <TooltipContent className="flex items-center justify-center flex-col gap-1 bg-dark-2">
                  <div className="relative w-14 h-14">
                    <Image
                      src={createdBy.image}
                      alt={`user_${createdBy.username}`}
                      fill
                      className={`rounded-full object-cover`}
                    />
                  </div>
                  <h3 className="text-light-1">
                    {createdBy.name.split(" ").at(0)}
                  </h3>
                  <h5 className="text-small-regular text-gray-1">
                    @{createdBy.username}
                  </h5>
                </TooltipContent>
              </Link>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <p className="mt-4 text-subtle-medium text-gray-1">{bio}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/communities/${id}`}>
          <Button size="sm" className="community-card_btn">
            View
          </Button>
        </Link>

        <div className="flex items-center">
          {!membersIds.includes(createdBy.id) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={`/profile/${createdBy.id}`}>
                    <div className="relative w-7 h-7">
                      <Image
                        src={createdBy.image}
                        alt={`user_${createdBy.username}`}
                        fill
                        className={`rounded-full object-cover`}
                      />
                    </div>
                  </Link>
                </TooltipTrigger>
                <Link href={`/profile/${createdBy.id}`}>
                  <TooltipContent className="flex items-center justify-center flex-col gap-1 bg-dark-2">
                    <div className="relative w-14 h-14">
                      <Image
                        src={createdBy.image}
                        alt={`user_${createdBy.username}`}
                        fill
                        className={`rounded-full object-cover`}
                      />
                    </div>
                    <h3 className="text-light-1">
                      {createdBy.name.split(" ").at(0)}
                    </h3>
                    <h5 className="text-small-regular text-gray-1">
                      @{createdBy.username}
                    </h5>
                  </TooltipContent>
                </Link>
              </Tooltip>
            </TooltipProvider>
          )}
          {members.length > 0 &&
            members.map((member, index) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={`/profile/${member.id}`}>
                      <div className="relative w-7 h-7">
                        <Image
                          key={index}
                          src={member.image}
                          alt={`user_${index}`}
                          fill
                          className={`${
                            index !== 0 && "-ml-2"
                          } rounded-full object-cover`}
                        />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <Link href={`/profile/${member.id}`}>
                    <TooltipContent className="flex items-center justify-center flex-col gap-1 bg-dark-2">
                      <div className="relative w-14 h-14">
                        <Image
                          key={index}
                          src={member.image}
                          alt={`user_${index}`}
                          fill
                          className={`${
                            index !== 0 && "-ml-2"
                          } rounded-full object-cover`}
                        />
                      </div>
                      <h3 className="text-light-1">
                        {member.name.split(" ").at(0)}
                      </h3>
                      <h5 className=" text-small-regular text-gray-1">
                        @{member.username}
                      </h5>
                    </TooltipContent>
                  </Link>
                </Tooltip>
              </TooltipProvider>
            ))}
          {members.length > membersLimit && (
            <p className="ml-1 text-subtle-medium text-gray-1">
              {members.length}+ Users
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default CommunityCard;
