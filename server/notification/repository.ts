import { desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { icon, notification } from "../db/schema";
import type {
  CreateNotification,
  Notification,
  NotificationWithIcon,
} from "./schema";

export const notificationRepository = {
  async createNotification(data: CreateNotification): Promise<Notification> {
    return (await db.insert(notification).values(data).returning())[0];
  },
  async getNotification(id: number): Promise<NotificationWithIcon> {
    const row = (
      await db
        .select({
          notification: notification,
          icon: icon,
        })
        .from(notification)
        .where(eq(notification.id, id))
        .leftJoin(icon, eq(notification.iconId, icon.id))
    )[0];

    const transformedItem = {
      ...row.notification,
      icon: row.icon,
    };

    return transformedItem;
  },

  async getNotifications(userId: string): Promise<NotificationWithIcon[]> {
    const rows = await db
      .select({
        notification: notification,
        icon: icon,
      })
      .from(notification)
      .where(eq(notification.userId, userId))
      .leftJoin(icon, eq(notification.iconId, icon.id))
			.orderBy(desc(notification.createdAt))
		;

    const transformedItems = rows.map((row) => ({
      ...row.notification,
      icon: row.icon,
    }));

    return transformedItems;
  },
  async deleteNotification(id: number): Promise<void> {
    await db.delete(notification).where(eq(notification.id, id));
  },

  async toggleIsSeen(id: number): Promise<void> {
    await db
      .update(notification)
      .set({ isSeen: true })
      .where(eq(notification.id, id));
  },
};
