import { Menu, Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { JSXElementConstructor } from "react";
import { Fragment } from "react";
import Link from "next/link";
import type { DefaultSession } from "next-auth";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  user: DefaultSession["user"];
  userNavigation: { name: string; href: string; action: null | (() => void) }[];
  navigation: {
    name: string;
    href: string;
    icon: JSXElementConstructor<never>;
    current: boolean;
  }[];
};

const Header = (props: Props) => {
  const { userNavigation, navigation, user } = props;
  return (
    <Popover
      as="header"
      className={({ open }) =>
        classNames(
          open ? "fixed inset-0 z-40 overflow-y-auto" : "",
          "bg-white shadow-sm lg:static lg:overflow-y-visible"
        )
      }
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
              <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <MagnifyingGlassIcon
                      className="h-7 w-7 text-gray-400"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
              <div className="min-h-[56px] min-w-0 flex-1 px-6 py-4 md:mx-auto md:max-w-3xl md:px-8 lg:mx-0 lg:max-w-none lg:px-0 xl:col-span-6 xl:px-0"></div>
              <div className="flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden">
                {/* Mobile menu button */}
                <Popover.Button className="-mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Popover.Button>
              </div>
              {user ? (
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-5 flex-shrink-0">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user?.image as string}
                          alt="Profile Pic"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) =>
                              item && item.action ? (
                                <Link
                                  href={"#"}
                                  key={item.name}
                                  onClick={() => item.action && item.action()}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block py-2 px-4 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              ) : (
                                <Link
                                  href={item.href}
                                  key={item.name}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block py-2 px-4 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )
                            }
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  <Link
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    href="/login"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>

          <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="mx-auto max-w-3xl space-y-1 px-2 pt-2 pb-3 sm:px-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "hover:bg-gray-50",
                    "block rounded-md py-2 px-3 text-base font-medium"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
            {user ? (
              <div className="border-t border-gray-200 pt-4">
                <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user?.image as string}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                  {userNavigation.map((item) =>
                    item.action ? (
                      <Link
                        href={"#"}
                        key={item.name}
                        onClick={() => item.action && item.action()}
                        className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4">
                <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default Header;
