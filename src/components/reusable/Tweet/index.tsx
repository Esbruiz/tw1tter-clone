import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";
import type Tweet from "../../../types/Tweet";

type Props = {
  tweet: Tweet;
  likeHandler: () => void;
  footer: boolean;
};

const TweetComponent = ({ tweet, likeHandler, footer }: Props) => {
  return (
    <article aria-labelledby={"tweet-title-" + tweet.id}>
      <Header author={tweet.author} createdAt={tweet.createdAt} />
      <Body tweet={tweet} />
      {footer && <Footer tweet={tweet} likeTweetHandler={likeHandler} />}
    </article>
  );
};

export default TweetComponent;
