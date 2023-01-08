import type { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { NextComponentType } from "next";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import type { ReactNode } from "react";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};
export default trpc.withTRPC(MyApp);
