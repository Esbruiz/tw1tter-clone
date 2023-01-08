import { WrenchIcon } from "@heroicons/react/20/solid";

import { trpc } from "../../utils/trpc";
import type { ReactElement } from "react";
import React, { useEffect } from "react";
import AuthLayout from "../../components/AuthLayout";
import { useSession } from "next-auth/react";
import Tweet from "../../components/reusable/Tweet";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Profile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: tweets } = trpc.tweets.getUserTweets.useQuery({
    id: session?.user?.id as string,
  });

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  const navigateToSettings = () => {
    router.push("/settings");
  };

  return (
    <>
      <main className="lg:col-span-9 xl:col-span-6">
        <article>
          {/* Profile header */}
          <div>
            <div>
              <img
                className="h-32 w-full object-cover lg:h-48"
                src={session?.user?.heroImage}
                alt=""
              />
            </div>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                <div className="flex">
                  <img
                    className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                    src={session?.user?.image as string}
                    alt="Profille Pic"
                  />
                </div>
                <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                    <h1 className="truncate text-2xl font-bold text-gray-900">
                      {session?.user?.name}
                    </h1>
                  </div>
                  <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => navigateToSettings()}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <WrenchIcon
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 hidden min-w-0 flex-1 sm:block">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {session?.user?.name}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  <Link href={`/${session?.user?.slug}`}>
                    @{session?.user?.slug}
                  </Link>
                </p>
                <p className="mt-4 text-sm font-medium text-gray-500">
                  {session?.user?.bio}
                </p>
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

Profile.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Profile;
