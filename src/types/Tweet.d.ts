import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Tweet } from "Tweet";

declare module "Tweet" {
  type Tweet = {
    id: string;
    text: MDXRemoteSerializeResult;
    author: {
      name: string;
      email: string;
      id: string;
      image: string;
    };
    createdAt: string;
    replies: {
      id: string;
      authorId: string;
      tweetId: string;
    }[];
    likes: {
      authorId: string;
      tweetId: string;
    }[];
    _count: {
      likes: number;
      replies: number;
    };
  };
}

export default Tweet;
