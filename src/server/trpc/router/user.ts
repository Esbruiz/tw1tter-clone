import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import ModernError from "modern-errors";

export const BaseError = ModernError.subclass("BaseError");
export const DatabaseError = BaseError.subclass("DatabaseError");

export const userRouter = router({
  update: protectedProcedure
    .input(
      z.object({
        userData: z.object({
          name: z.string().optional(),
          slug: z.string().optional(),
          image: z.string().optional(),
          heroImage: z.string().optional(),
          bio: z.string().optional(),
        }),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx?.session?.user?.id,
        },
        data: {
          ...input.userData,
        },
      });
    }),
  getUserProfileBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          followers: true,
          following: true,
        },
      });
    }),
  followToggle: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const isFollowing = await ctx.prisma.user
        .findUnique({
          where: {
            id: ctx?.session?.user?.id,
          },
        })
        .followers({
          where: {
            followerId: input.userId,
          },
        });
      if (isFollowing && isFollowing.length > 0) {
        return ctx.prisma.follows.deleteMany({
          where: {
            AND: [
              {
                followerId: ctx?.session?.user?.id,
              },
              {
                followingId: input.userId,
              },
            ],
          },
        });
      }
      return ctx.prisma.follows.create({
        data: {
          followerId: ctx?.session?.user?.id,
          followingId: input.userId,
        },
      });
    }),
  findUserBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findMany({
        where: {
          slug: {
            contains: input.slug,
          },
        },
      });
    }),
});
