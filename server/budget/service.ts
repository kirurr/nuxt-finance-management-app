import { userBudgetRepository } from "./repository";
import type { CreateUserBudget, UpdateUserBudget, UserBudget } from "./schema";

export const userBudgetService = {
  async getUserBudgetByMonth(
    userId: string,
    month: number,
  ): Promise<UserBudget> {
    return await userBudgetRepository.getUserBudgetByMonth(userId, month);
  },
  async createUserBudget(data: CreateUserBudget): Promise<UserBudget> {
    return await userBudgetRepository.createUserBudget(data);
  },

	async updateUserBudget(data: UpdateUserBudget): Promise<UserBudget> {
		return await userBudgetRepository.updateUserBudget(data);
	},

	async calculateUserBudget(userId: string, start: Date, end: Date) {
		return await userBudgetRepository.calculateUserBudget(userId, start, end);
	},
};
