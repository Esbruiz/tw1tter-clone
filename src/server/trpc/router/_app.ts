import { router } from "../trpc";
import { authRouter } from "./auth";
import { tweetsRouter } from "./tweets";
import { userRouter } from "./user";
import { dmsRouter } from "./dms";

export const appRouter = router({
  tweets: tweetsRouter,
  auth: authRouter,
  user: userRouter,
  dms: dmsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
