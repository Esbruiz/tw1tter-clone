import type { ReactElement } from "react";
import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { trpc } from "../../utils/trpc";
import NewTweet from "../../components/reusable/NewTweet";
import Tweet from "../../components/reusable/Tweet";
import { useSession } from "next-auth/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const [tabs, setTabs] = useState([
    {
      name: "Recent",
      href: "#",
      current: true,
      orderBy: { createdAt: "desc" },
    },
    { name: "Most Liked", href: "#", current: false, orderBy: { likes: true } },
    {
      name: "Most replied to",
      href: "#",
      current: false,
      orderBy: { replies: true },
    },
  ]);
  const setCurrentTab = (index: number) => {
    const newTabs = tabs.map((tab, i) => {
      if (i === index) {
        return { ...tab, current: true };
      }
      return { ...tab, current: false };
    });
    refetch();
    setTabs(newTabs);
  };
  const { data: user } = useSession();
  const orderBy = tabs.find((tab) => tab.current)?.orderBy;
  const { data: tweets = [], refetch } = trpc.tweets.getAll.useQuery(
    orderBy ? { orderBy } : null,
    {
      enabled: true,
    }
  );
  return (
    <>
      <main className="lg:col-span-9 xl:col-span-6">
        <div className="px-4 sm:px-0">
          <div className="sm:hidden">
            <label htmlFor="question-tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="question-tabs"
              className="block w-full rounded-md border-gray-300 text-base font-medium text-gray-900 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              defaultValue={tabs.find((tab) => tab.current)!.name}
            >
              {tabs.map((tab, index) => (
                <option onClick={() => setCurrentTab(index)} key={tab.name}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav
              className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
              aria-label="Tabs"
            >
              {tabs.map((tab, tabIdx) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  aria-current={tab.current ? "page" : undefined}
                  onClick={() => setCurrentTab(tabIdx)}
                  className={classNames(
                    tab.current
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700",
                    tabIdx === 0 ? "rounded-l-lg" : "",
                    tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                    "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                  )}
                >
                  <span>{tab.name}</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      tab.current ? "bg-rose-500" : "bg-transparent",
                      "absolute inset-x-0 bottom-0 h-0.5"
                    )}
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
        {user && (
          <div className="mt-4">
            <h1 className="sr-only">What are you thinking?</h1>
            <div className="px-4 py-6 sm:rounded-lg sm:p-6">
              <NewTweet mode={"create"} refetch={refetch} />
            </div>
          </div>
        )}
        <div className="mt-4">
          <h1 className="sr-only">Recent questions</h1>
          <ul role="list" className="space-y-4">
            {tweets.map((tweet) => (
              <li
                key={tweet.id}
                className="bg-white px-4 py-6 shadow sm:rounded-lg sm:p-6"
              >
                <Tweet tweet={tweet} />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
