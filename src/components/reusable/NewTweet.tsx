import { useCallback, useEffect, useState } from "react";
import "easymde/dist/easymde.min.css";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
//import TweetEditorNoSSR from "./Tweet/TweetEditorNoSSR";

const TweetEditorNoSSR = dynamic(import("./Tweet/TweetEditorNoSSR"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const EmptyTweet = () => {
  return <p>loading...</p>;
};

type Props = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  mode: "create" | "reply";
  replyTo?: string;

  refetch: any;
};
export default function NewTweet(props: Props) {
  const { mode, replyTo, refetch } = props;
  const { data: session } = useSession();
  const [value, setValue] = useState("");
  const [component, setComponent] = useState("EmptyTweet");
  useEffect(() => {
    setComponent("TweetEditorNoSSR");
  }, []);
  const createTweet = trpc.tweets.newTweet.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const replyToTweet = trpc.tweets.replyToTweet.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  const onCreate = async () => {
    if (mode === "create") {
      await createTweet.mutate({ text: value });
    } else {
      await replyToTweet.mutate({
        text: value,
        id: replyTo ? replyTo : "",
      });
    }
    setValue("");
  };

  const authorImg = session?.user?.image ? session.user.image : "";

  return (
    <article aria-labelledby={"new-tweet-title"}>
      <div>
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={authorImg} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            {component === "EmptyTweet" ? (
              <EmptyTweet />
            ) : (
              <TweetEditorNoSSR onChange={onChange} value={value} />
            )}
            <div className="mt-6">
              <button
                onClick={() => onCreate()}
                className="block w-full rounded-md border border-gray-300 bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-500"
              >
                {mode === "reply" ? "Reply" : "Tweet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
