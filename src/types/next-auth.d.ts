import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      id: string;
      slug: string;
      heroImage: string;
      bio: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    slug: string;
    heroImage: string;
    bio: string;
  }
}
