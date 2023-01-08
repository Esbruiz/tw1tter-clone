import Header from "./Header";
import SideBar from "./SideBar";
import { EnvelopeIcon, HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import type { DefaultSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthLayout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { data: user } = useSession();
  const { pathname } = useRouter();

  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/dashboard", icon: HomeIcon, current: true },
    { name: "Profile", href: "/profile", icon: UserIcon, current: false },
    { name: "Dms", href: "/messages", icon: EnvelopeIcon, current: false },
  ]);

  useEffect(() => {
    setNavigation((prev) =>
      prev.map((nav) => {
        if (nav.href === pathname) {
          return { ...nav, current: true };
        }
        return { ...nav, current: false };
      })
    );
  }, [pathname]);

  const signOutUser = () => {
    signOut({
      callbackUrl: "/login",
    });
  };

  const userNavigation = [
    { name: "Your Profile", href: "/profile", action: null },
    { name: "Settings", href: "/settings", action: null },
    { name: "Sign out", href: "#", action: signOutUser },
  ];

  return (
    <div className="min-h-full">
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Header
        user={user?.user as DefaultSession["user"]}
        userNavigation={userNavigation}
        navigation={navigation}
      />
      <div className="py-10">
        <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
          <SideBar navigation={navigation as any} />
          {children}
          {pathname.includes("messages") ? null : (
            <aside className="hidden xl:col-span-4 xl:block">
              <div className="sticky top-4 space-y-4">
                <section aria-labelledby="trending-heading"></section>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
