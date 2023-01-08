import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import UserDMModal from "../../components/reusable/UserDMModal";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Messages = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState([
    { user: {} },
  ] as RouterOutputs["dms"]["getDmsForUser"]);
  const [selectedUser, setSelectedUser] = useState(
    null as RouterOutputs["dms"]["getDmsForUser"][0]["user"] | null
  );
  const [currentMessages, setCurrentMessages] = useState(
    [] as RouterOutputs["dms"]["getDmsForUser"][0]["messages"] | []
  );

  const { refetch } = trpc.dms.getDmsForUser.useQuery(undefined, {
    onSuccess: (data: RouterOutputs["dms"]["getDmsForUser"]) => {
      setUserMessages(data);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { data: session } = useSession();

  useEffect(() => {
    if (selectedUser) {
      const innerUserMessage = userMessages.map((user) => {
        if (user?.user?.id === selectedUser.id) {
          const newUser = { ...user };
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newUser.user.current = true;
          return newUser;
        }
        const newUser = { ...user };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newUser.user.current = false;
        return newUser;
      });
      setUserMessages(innerUserMessage);
    }
  }, [selectedUser]);

  const sendDMMutation = trpc.dms.sendDM.useMutation();

  const onNewDMStart = (
    user: RouterOutputs["dms"]["getDmsForUser"][0]["user"]
  ) => {
    let found = false;
    let index = 0;
    for (let i = 0; i < userMessages.length; i++) {
      if (userMessages && userMessages.length > 0) {
        if (userMessages[i]?.user?.id === user?.id) {
          found = true;
          index = i;
          break;
        }
      }
    }
    if (found && index !== null && userMessages && userMessages.length > 0) {
      setSelectedUser(userMessages[index]?.user);
      setCurrentMessages(
        userMessages[index]
          ?.messages as RouterOutputs["dms"]["getDmsForUser"][0]["messages"]
      );
    } else {
      const selectedUser = { user, messages: [] };
      setSelectedUser(selectedUser.user);
      setCurrentMessages(selectedUser.messages);
    }
  };

  const selectMessages = (id: string) => {
    userMessages.forEach(
      ({
        user,
        messages,
      }: {
        user: RouterOutputs["dms"]["getDmsForUser"][0]["user"];
        messages: RouterOutputs["dms"]["getDmsForUser"][0]["messages"];
      }) => {
        if (user?.id === id) {
          setSelectedUser(user);
          setCurrentMessages(messages);
        }
      }
    );
  };

  const sendMessage = async () => {
    await sendDMMutation.mutateAsync({
      userId: selectedUser?.id as string,
      text: message,
    });
    refetch();
    setMessage("");
  };

  return (
    <>
      <main className="flex flex-row lg:col-span-12 xl:col-span-9">
        <section
          aria-labelledby="message-heading"
          className="flex h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last"
        >
          {/* Top section */}

          {currentMessages.length > 0 || selectedUser?.id ? (
            <div className="min-h-min flex-1 overflow-y-scroll">
              <ul
                role="list"
                className="max-h-[75vh] space-y-2 overflow-y-scroll py-4 sm:space-y-4 sm:px-6 lg:px-8"
              >
                {currentMessages.length === 0 ? (
                  <li
                    key={Math.random()}
                    className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6"
                  >
                    <div className="sm:flex sm:items-baseline sm:justify-between">
                      <p className="mt-1 whitespace-nowrap text-sm text-gray-600 sm:mt-0 sm:ml-3">
                        No messages yet
                      </p>
                    </div>
                  </li>
                ) : (
                  currentMessages.map((item) => {
                    return (
                      <li
                        key={Math.random()}
                        className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6"
                      >
                        <div className="sm:flex sm:items-baseline sm:justify-between">
                          <h3 className="text-base font-medium">
                            <span className="text-gray-900">
                              {item.sender.name}
                            </span>{" "}
                            <span className="text-gray-600">wrote</span>
                          </h3>
                          <p className="mt-1 whitespace-nowrap text-sm text-gray-600 sm:mt-0 sm:ml-3">
                            <time
                              dateTime={new Date(item.createdAt).toDateString()}
                            >
                              {new Date(item.createdAt).toDateString()}
                            </time>
                          </p>
                        </div>
                        <p className="mt-4 space-y-6 text-sm text-gray-800">
                          {item.text}
                        </p>
                      </li>
                    );
                  })
                )}
              </ul>
              <div className={"bg-white px-4 py-6 sm:px-6"}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="inline-block h-10 w-10 rounded-full"
                      src={session?.user?.image as string}
                      alt="Profile Pic"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                        <label htmlFor="comment" className="sr-only">
                          Add your message
                        </label>
                        <textarea
                          rows={3}
                          name="comment"
                          id="comment"
                          className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
                          placeholder="Add your comment..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />

                        {/* Spacer element to match the height of the toolbar */}
                        <div className="py-2" aria-hidden="true">
                          {/* Matches height of button in toolbar (1px border + 36px content height) */}
                          <div className="py-px">
                            <div className="h-9" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
                        <div className="flex-shrink-0">
                          <button
                            onClick={sendMessage}
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-min flex-1 overflow-y-scroll">
              <div className={"bg-white px-4 py-6 sm:px-6"}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <h3 className={"text-sm"}>
                      No messages yet, start a new conversation by sending a new
                      DM.
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Message list*/}
        <aside className="hidden xl:col-span-4 xl:block">
          <div className="relative flex max-h-[87vh] w-96 flex-col border-r border-gray-200 bg-gray-100">
            <div className="flex-shrink-0">
              <div className="flex h-16 flex-col justify-center bg-white px-6">
                <div className="flex items-baseline space-x-3">
                  <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
                  <p className="text-sm font-medium text-gray-500">
                    {userMessages.length} messages
                  </p>
                </div>
              </div>
              <div className="border-t border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500">
                Sorted by date (probably)
              </div>
            </div>
            <nav
              aria-label="Message list"
              className="min-h-fit flex-1 overflow-y-auto"
            >
              <ul role="list" className="divide-y border-b border-gray-200">
                <li className="px-6 py-4">
                  <button
                    onClick={() => setOpen(true)}
                    className={
                      "block w-full rounded-md border border-gray-300 bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-500"
                    }
                  >
                    New DM
                  </button>
                </li>
                {userMessages.length === 0 ? (
                  <li className="px-6 py-4 text-sm text-gray-500">
                    No messages.
                  </li>
                ) : (
                  userMessages.map(({ user }) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const currentUser = user?.current;
                    return (
                      <li
                        key={user?.id || Math.random()}
                        className={classNames(
                          currentUser
                            ? "text-white-900 bg-blue-400"
                            : "text-gray-700 hover:bg-gray-50",
                          "relative bg-white py-5 px-6"
                        )}
                      >
                        <div className="flex justify-between space-x-3">
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => {
                                selectMessages(user?.id as string);
                              }}
                              className="block focus:outline-none"
                            >
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={user?.image as string}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div
                                    className={classNames(
                                      currentUser
                                        ? "text-white"
                                        : "text-gray-900",
                                      "font-medium"
                                    )}
                                  >
                                    {user?.name}
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </nav>
          </div>
        </aside>
      </main>
      <UserDMModal
        setSelectedUser={onNewDMStart}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default Messages;

Messages.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
