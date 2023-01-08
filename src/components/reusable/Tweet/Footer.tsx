import {
  ChatBubbleLeftEllipsisIcon,
  HandThumbUpIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";

type Props = {
  tweet: {
    id: string;
    _count: {
      likes: number;
      replies: number;
    };
  };
  likeTweetHandler: (id: string) => any;
};
const TweetFooter = ({ likeTweetHandler, tweet }: Props) => {
  const { data: session } = useSession();
  return (
    <div className="mt-6 flex justify-between space-x-8">
      <div className="flex space-x-6">
        <span className="inline-flex items-center text-sm">
          <button
            onClick={() => (session ? likeTweetHandler(tweet.id) : null)}
            type="button"
            className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
          >
            <HandThumbUpIcon className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium text-gray-900">
              {tweet?._count?.likes | 0}
            </span>
            <span className="sr-only">likes</span>
          </button>
        </span>
        <span className="inline-flex items-center text-sm">
          <button
            type="button"
            className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
          >
            <ChatBubbleLeftEllipsisIcon
              className="h-5 w-5"
              aria-hidden="true"
            />
            <span className="font-medium text-gray-900">
              {tweet?._count?.replies | 0}
            </span>
            <span className="sr-only">replies</span>
          </button>
        </span>
      </div>
    </div>
  );
};

export default TweetFooter;
