type Props = {
  author: {
    name: string;
    email: string;
    id: string;
    image: string;
  };
  createdAt: string;
};

const TweetHeader = ({ author, createdAt }: Props) => {
  return (
    <div>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img className="h-10 w-10 rounded-full" src={author.image} alt="" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            <a href={author.email} className="hover:underline">
              {author.name}
            </a>
          </p>
          <p className="text-sm text-gray-500">
            <a href={author.email} className="hover:underline">
              <time
                dateTime={new Date(createdAt).getUTCDate().toString()}
              >{`${new Date(createdAt).getDay()}/${new Date(
                createdAt
              ).getMonth()}/${new Date(createdAt).getFullYear()}`}</time>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TweetHeader;
