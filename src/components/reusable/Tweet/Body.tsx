import MDXRemoteComponent from "../../MDXRemoteComponent";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

type Props = {
  tweet: {
    text: MDXRemoteSerializeResult;
  };
};
const TweetBody = ({ tweet }: Props) => {
  return <MDXRemoteComponent source={tweet.text} />;
};

export default TweetBody;