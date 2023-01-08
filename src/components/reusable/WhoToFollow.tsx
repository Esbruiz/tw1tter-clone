import { PlusIcon } from "@heroicons/react/20/solid";

type Props = {
  whoToFollow: {
    name: string;
    handle: string;
    href: string;
    imageUrl: string;
  }[];
  };
export default function WhoToFollow(props: Props) {
  const whoToFollow = props.whoToFollow;
  return <ul role="list" className="-my-4 divide-y divide-gray-200">
    {whoToFollow.map((user) => (
      <li key={user.handle} className="flex items-center space-x-3 py-4">
        <div className="flex-shrink-0">
          <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            <a href={user.href}>{user.name}</a>
          </p>
          <p className="text-sm text-gray-500">
            <a href={user.href}>{'@' + user.handle}</a>
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-sm font-medium text-rose-700 hover:bg-rose-100"
          >
            <PlusIcon className="-ml-1 mr-0.5 h-5 w-5 text-rose-400" aria-hidden="true" />
            <span>Follow</span>
          </button>
        </div>
      </li>
    ))}
  </ul>
}