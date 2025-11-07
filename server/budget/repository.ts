import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { userBudget } from "../db/schema";
import type { CreateUserBudget, UpdateUserBudget, UserBudget } from "./schema";

export const userBudgetRepository = {
  async getUserBudgetByMonth(
    userId: string,
    month: number,
  ): Promise<UserBudget> {
    const items = await db
      .select()
      .from(userBudget)
      .where(and(eq(userBudget.userId, userId), eq(userBudget.month, month)));

    return items[0];
  },

  async createUserBudget(data: CreateUserBudget): Promise<UserBudget> {
    return (await db.insert(userBudget).values(data).returning())[0];
  },

	async updateUserBudget(data: UpdateUserBudget): Promise<UserBudget> {
		return (await db.update(userBudget).set(data).where(eq(userBudget.id, data.id)).returning())[0];
	},
};
