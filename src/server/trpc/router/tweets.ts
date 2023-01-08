import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";
import { serialize } from "next-mdx-remote/serialize";

const serializeString = async (string: string) => {
  return await serialize(string, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      development: false,
    },
  });
};
export const tweetsRouter = router({
  getAll: publicProcedure
    .input(
      z
        .object({
          orderBy: z.object({
            createdAt: z.string().optional(),
            likes: z.boolean().optional(),
            replies: z.boolean().optional(),
          }),
        })
        .nullish()
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.tweet.findMany({
        include: {
          author: true,
          likes: true,
          replies: {
            include: {
              author: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
        orderBy: {
          ...(input && input?.orderBy?.createdAt
            ? { createdAt: input.orderBy.createdAt }
            : ({} as any)),
          ...(input && input.orderBy?.likes === true
            ? { likes: { _count: "desc" } }
            : {}),
          ...(input && input.orderBy?.replies === true
            ? { replies: { _count: "desc" } }
            : {}),
        },
      });
      const parsedData = [];

      for await (const tweet of data as typeof data &
        { content: string; replies: { content: string }[] }[]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tweet.text = await serializeString(tweet.text);
        if (tweet.replies) {
          for await (const reply of tweet.replies) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reply.text = await serializeString(reply.text);
          }
        }
        parsedData.push(tweet);
      }
      return parsedData;
    }),
  getUserTweets: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.tweet.findMany({
        where: {
          authorId: input.id,
        },
        include: {
          author: true,
          likes: true,
          replies: {
            include: {
              author: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const parsedData = [];

      for await (const tweet of data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tweet.text = await serialize(tweet.text, {
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
            development: false,
          },
        });
        if (tweet.replies) {
          for await (const reply of tweet.replies) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reply.text = await serialize(reply.text, {
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [],
                development: false,
              },
            });
          }
        }
        parsedData.push(tweet);
      }
      return parsedData;
    }),
  likeTweet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const isLikedAlready = await ctx.prisma.like.findFirst({
        where: {
          tweetId: input.id,
          authorId: ctx?.session?.user?.id,
        },
      });
      if (isLikedAlready === null) {
        return ctx.prisma.like.create({
          data: {
            tweet: {
              connect: {
                id: input.id,
              },
            },
            author: {
              connect: {
                id: ctx?.session?.user?.id,
              },
            },
          },
        });
      } else {
        return ctx.prisma.like.deleteMany({
          where: {
            AND: [
              {
                tweetId: input.id,
              },
              {
                authorId: ctx?.session?.user?.id,
              },
            ],
          },
        });
      }
    }),
  newTweet: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tweet.create({
        data: {
          author: {
            connect: {
              id: ctx?.session?.user?.id,
            },
          },
          text: input.text,
        },
      });
    }),
  replyToTweet: protectedProcedure
    .input(z.object({ text: z.string(), id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.reply.create({
        data: {
          author: {
            connect: {
              id: ctx?.session?.user?.id,
            },
          },
          tweet: {
            connect: {
              id: input.id,
            },
          },
          text: input.text,
        },
      });
    }),
});
