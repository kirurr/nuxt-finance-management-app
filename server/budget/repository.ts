import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { transaction, userBudget } from "../db/schema";
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
    return (
      await db
        .update(userBudget)
        .set(data)
        .where(eq(userBudget.id, data.id))
        .returning()
    )[0];
  },

  async calculateUserBudget(userId: string, month: number, year: number) {
    const result = await db
      .select({
        budgetId: userBudget.id,
        totalBudget: userBudget.amount,
        totalExpenses: sql<number>`COALESCE(SUM(${transaction.amount}), 0)`,
        remainingBudget: sql<number>`${userBudget.amount} - COALESCE(SUM(${transaction.amount}), 0)`,
      })
      .from(userBudget)
      .leftJoin(
        transaction,
        and(
          eq(transaction.userId, userBudget.userId),
          eq(transaction.type, "expense"),
          sql`strftime('%m', ${transaction.date}, 'unixepoch') = printf('%02d', ${userBudget.month})`,
          sql`strftime('%Y', ${transaction.date}, 'unixepoch') = ${userBudget.year}`,
        ),
      )
      .where(
        and(
          eq(userBudget.userId, userId),
          eq(userBudget.month, month),
          eq(userBudget.year, year),
        ),
      )
      .groupBy(userBudget.id);

		if (result.length === 0) {
			return null
		}
    return result[0];
  },
};
