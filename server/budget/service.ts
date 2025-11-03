import { userBudgetRepository } from "./repository";
import type { CreateUserBudget, UserBudget } from "./schema";

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
};
