import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import ModernError from "modern-errors";
import type Prisma from "@prisma/client";

export const BaseError = ModernError.subclass("BaseError");
export const DatabaseError = BaseError.subclass("DatabaseError");

export const dmsRouter = router({
  sendDM: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.messages.create({
        data: {
          text: input.text,
          receiver: {
            connect: {
              id: input.userId,
            },
          },
          sender: {
            connect: {
              id: ctx?.session?.user?.id,
            },
          },
        },
      });
    }),
  getDmsForUser: publicProcedure.query(async ({ ctx }) => {
    const conversations = new Set();
    const userMessages = await ctx.prisma.user.findUnique({
      where: {
        id: ctx?.session?.user?.id,
      },
      include: {
        receivedMessages: {
          include: {
            sender: true,
            receiver: true,
          },
        },
        sentMessages: {
          include: {
            sender: true,
            receiver: true,
          },
        },
      },
    });
    if (!userMessages) {
      throw new DatabaseError("User not found");
    }
    const { receivedMessages, sentMessages } = userMessages;
    const allMessages = [...receivedMessages, ...sentMessages];
    allMessages.forEach((message) => {
      conversations.add(message.senderId);
      conversations.add(message.receiverId);
    });
    const parsedConversations = [];
    for await (const conversation of conversations) {
      const messages: (Prisma.Messages & {
        sender: Prisma.User;
        receiver: Prisma.User;
      })[] = allMessages.filter(
        (message) =>
          message.senderId === conversation ||
          message.receiverId === conversation
      );
      parsedConversations.push({
        messages,
        user: (() => {
          if (messages && messages[0]) {
            if (messages[0].senderId === ctx?.session?.user?.id) {
              return messages[0].receiver;
            } else {
              return messages[0].sender;
            }
          }
        })(),
      });
    }
    return parsedConversations;
  }),
});
