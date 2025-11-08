import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";
import { notification } from "../db/schema";
import type z from "zod";
import type { AllString } from "../utils";
import type { Icon } from "../icon/schema";

export const notificationSchema = createSelectSchema(notification);

export type Notification = z.infer<typeof notificationSchema>;

export const createNotificationSchema = createInsertSchema(notification);

export type CreateNotification = z.infer<typeof createNotificationSchema>;

export type NotificationFormData = Omit<
  AllString<CreateNotification>,
  "userId" | "type" | "id" | "createdAt"
>;

export type NotificationWithIcon = Notification & {
	icon: Icon | null
}
