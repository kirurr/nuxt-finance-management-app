import { authed } from "../orpc";
import { createNotificationSchema } from "./schema";
import { notificationService } from "./service";
import * as z from "zod";

export const notificationRouter = {
  createNotification: authed
    .input(createNotificationSchema)
    .handler(async ({ input }) => {
      return await notificationService.createNotification(input);
    }),
  getNotification: authed.input(z.number()).handler(async ({ input }) => {
    return await notificationService.getNotification(input);
  }),
  getNotifications: authed.handler(async ({ context }) => {
    return await notificationService.getNotifications(context.user.id);
  }),
  deleteNotification: authed.input(z.number()).handler(async ({ input }) => {
    return await notificationService.deleteNotification(input);
  }),
  toggleIsSeen: authed.input(z.number()).handler(async ({ input }) => {
    return await notificationService.toggleIsSeen(input);
  }),
};
