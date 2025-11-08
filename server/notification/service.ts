import type {
  CreateNotification,
  Notification,
  NotificationWithIcon,
} from "./schema";
import { notificationRepository } from "./repository";

export const notificationService = {
  async createNotification(data: CreateNotification): Promise<Notification> {
    return await notificationRepository.createNotification(data);
  },
  async getNotification(id: number): Promise<NotificationWithIcon> {
    return await notificationRepository.getNotification(id);
  },

  async getNotifications(userId: string): Promise<NotificationWithIcon[]> {
    return await notificationRepository.getNotifications(userId);
  },
  async deleteNotification(id: number): Promise<void> {
    return await notificationRepository.deleteNotification(id);
  },
	async toggleIsSeen(id: number): Promise<void> {
		return await notificationRepository.toggleIsSeen(id);
	},
};
