import type { ReactElement } from "react";
import AuthLayout from "../../components/AuthLayout";
import { getSession, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

type UserData = {
  userData: {
    name: string;
    image: string;
    heroImage: string;
    bio: string;
    slug: string;
  };
};

export default function Settings() {
  const { data: session } = useSession();
  const updateProfile = trpc.user.update.useMutation();

  const saveData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get data out of the form event
    const formData = new FormData(e.currentTarget);
    const data = {
      userData: Object.fromEntries(formData.entries()),
    } as UserData;
    updateProfile.mutate(data);
  };

  return (
    <>
      <main className="lg:col-span-9 xl:col-span-6">
        <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
          <div className="pb-16">
            <div className="px-4 sm:px-6 md:px-0">
              <div className="mt-0 divide-y divide-gray-200">
                <div className={"mt-6"}>
                  <form
                    onSubmit={saveData}
                    className="divide-y-blue-gray-200 mt-6 space-y-8 divide-y"
                  >
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                      <div className="sm:col-span-6">
                        <h2 className="text-blue-gray-900 text-xl font-medium">
                          Profile
                        </h2>
                        <p className="text-blue-gray-500 mt-1 text-sm">
                          This information will be displayed publicly so be
                          careful what you share.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="name"
                          className="text-blue-gray-900 block text-sm font-medium"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="given-name"
                          className="border-blue-gray-300 text-blue-gray-900 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          defaultValue={session?.user?.name as string}
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="slug"
                          className="text-blue-gray-900 block text-sm font-medium"
                        >
                          Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="border-blue-gray-300 bg-blue-gray-50 text-blue-gray-500 inline-flex items-center rounded-l-md border border-r-0 px-3 sm:text-sm">
                            currentUrl.com/
                          </span>
                          <input
                            type="text"
                            name="slug"
                            id="slug"
                            autoComplete="username"
                            className="border-blue-gray-300 text-blue-gray-900 block w-full min-w-0 flex-1 rounded-none rounded-r-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            defaultValue={session?.user?.slug}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="image"
                          className="text-blue-gray-900 block text-sm font-medium"
                        >
                          Profile Pic
                        </label>
                        <div className={"mt-1 flex flex-row"}>
                          <img
                            className="inline-block h-12 w-12 rounded-full"
                            src={session?.user?.image as string}
                            alt=""
                          />
                          <input
                            type="url"
                            name="image"
                            id="image"
                            autoComplete="given-name"
                            className="border-blue-gray-300 text-blue-gray-900 ml-6 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            defaultValue={session?.user?.image as string}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="heroImage"
                          className="text-blue-gray-900 block text-sm font-medium"
                        >
                          Cover Pic
                        </label>
                        <div className={"mt-1 flex flex-row"}>
                          <img
                            className="inline-block h-12 w-12 rounded-full"
                            src={session?.user?.heroImage}
                            alt="Cover image"
                          />
                          <input
                            type="url"
                            name="heroImage"
                            id="heroImage"
                            autoComplete="given-name"
                            className="border-blue-gray-300 text-blue-gray-900 ml-6 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            defaultValue={session?.user?.heroImage}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="bio"
                          className="text-blue-gray-900 block text-sm font-medium"
                        >
                          Bio
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            className="border-blue-gray-300 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            defaultValue={session?.user?.bio}
                          />
                        </div>
                        <p className="text-blue-gray-500 mt-3 text-sm">
                          Brief description for your profile.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-8">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
