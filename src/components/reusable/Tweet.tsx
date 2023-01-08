import { useState } from "react";
import { trpc } from "../../utils/trpc";
import TweetComponent from "../reusable/Tweet/index";
import type Tweet from "../../types/Tweet";
import NewTweet from "./NewTweet";
import { useSession } from "next-auth/react";

type Props = {
  tweet: Tweet;
};

const TweetDisplay = (props: Props) => {
  const tweet = props.tweet;
  const likeTweet = trpc.tweets.likeTweet.useMutation();
  const [replying, setReplying] = useState(false);
  const { data: user } = useSession();

  const likeTweetHandler = async () => {
    await likeTweet.mutate({ id: tweet.id });
  };

  return (
    <>
      <TweetComponent
        footer={true}
        tweet={tweet}
        likeHandler={likeTweetHandler}
      />
      <div className="mt-6 justify-between space-x-8">
        {user && (
          <div className="space-x-6">
            {replying ? (
              <NewTweet
                refetch={null}
                mode={"reply"}
                replyTo={tweet.id}
              ></NewTweet>
            ) : (
              <button
                onClick={() => setReplying(true)}
                className="block w-full rounded-md border border-gray-300 bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-500"
              >
                Click to reply
              </button>
            )}
          </div>
        )}
        <div className={"flex flex-col"}>
          {tweet.replies.map((reply: Tweet["replies"][0]) => (
            <div key={reply.id} className={"pt-3 pb-3"}>
              <TweetComponent
                tweet={reply}
                footer={false}
                likeHandler={likeTweetHandler}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TweetDisplay;
