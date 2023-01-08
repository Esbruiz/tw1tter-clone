import { useRouter } from "next/router";
import type { ReactElement } from "react";
import React from "react";
import { trpc } from "../utils/trpc";
import {
  ArrowsRightLeftIcon,
  CheckIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import AuthLayout from "../components/AuthLayout";
import Tweet from "../components/reusable/Tweet";
import { useSession } from "next-auth/react";

const SlugProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { pid } = router.query;
  const { data: user } = trpc.user.getUserProfileBySlug.useQuery(
    {
      slug: pid as string,
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const { data: tweets, refetch } = trpc.tweets.getUserTweets.useQuery(
    {
      id: user?.id as string,
    },
    {
      enabled: false,
    }
  );

  const isFollowing = () => {
    if (session && session.user) {
      return user?.followers?.some(
        (follower) => follower.followerId === session?.user?.id
      );
    }
    return false;
  };
  const followToggle = trpc.user.followToggle.useMutation();

  return (
    <>
      <main className="lg:col-span-9 xl:col-span-6">
        <article>
          <div>
            <div>
              <img
                className="h-32 w-full object-cover lg:h-48"
                src={user?.heroImage as string}
                alt=""
              />
            </div>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                <div className="flex">
                  <img
                    className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                    src={user?.image as string}
                    alt="Profille Pic"
                  />
                </div>
                <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                    <h1 className="truncate text-2xl font-bold text-gray-900">
                      {user?.name}
                    </h1>
                  </div>
                  <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <EnvelopeIcon
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>DM</span>
                    </button>
                    <button
                      onClick={() => {
                        followToggle.mutateAsync({
                          userId: user?.id as string,
                        });
                      }}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      {isFollowing() ? (
                        <>
                          <CheckIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <ArrowsRightLeftIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  <a href={"#"}>@{user?.slug}</a>
                </p>
                <p className="mt-4 text-sm font-medium text-gray-500">
                  {user?.bio}
                </p>
                <div
                  className={
                    "mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
                  }
                >
                  <p className={"text-sm font-medium text-gray-500"}>
                    <b>{user?.followers.length}</b> Followers
                  </p>
                  <p className={"text-sm font-medium text-gray-500"}>
                    <b>{user?.following.length}</b> Following
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description list */}
          <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
            <ul role="list" className="space-y-4">
              {tweets &&
                tweets.map((tweet) => (
                  <dl key={tweet.id} className={"divide-y divide-gray-200"}>
                    <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:p-6">
                      <Tweet tweet={tweet} />
                    </li>
                  </dl>
                ))}
            </ul>
          </div>
        </article>
      </main>
    </>
  );
};

SlugProfile.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SlugProfile;
