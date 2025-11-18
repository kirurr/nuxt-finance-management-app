import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { transaction, userBudget } from "../db/schema";
import type { CreateUserBudget, UpdateUserBudget, UserBudget } from "./schema";

export const userBudgetRepository = {
  async getUserBudgetByMonth(
    userId: string,
    month: number,
  ): Promise<UserBudget | null> {
    const items = await db
      .select()
      .from(userBudget)
      .where(and(eq(userBudget.userId, userId), eq(userBudget.month, month)));

		if (items.length === 0) {
			return null;
		}

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

  async calculateUserBudget(userId: string, start: Date, end: Date) {
    const result = await db
      .select({
        id: userBudget.id,
        amount: userBudget.amount,
        month: userBudget.month,
        year: userBudget.year,
        userId: userBudget.userId,
        isActive: userBudget.isActive,
        totalBudget: userBudget.amount,
        totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'expense' THEN ${transaction.amount} ELSE 0 END), 0)`,
        totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'income' THEN ${transaction.amount} ELSE 0 END), 0)`,
        remainingBudget: sql<number>`${userBudget.amount} - COALESCE(SUM(CASE WHEN ${transaction.type} = 'expense' THEN ${transaction.amount} ELSE 0 END), 0)`,
      })
      .from(userBudget)
      .leftJoin(
        transaction,
        and(
          eq(transaction.userId, userBudget.userId),
          sql`${transaction.date} >= ${Math.floor(start.getTime() / 1000)}`,
          sql`${transaction.date} <= ${Math.floor(end.getTime() / 1000)}`,
        ),
      )
      .where(
        and(
          eq(userBudget.userId, userId),
          eq(userBudget.month, start.getMonth() + 1),
          eq(userBudget.year, start.getFullYear()),
        ),
      )
      .groupBy(userBudget.id);

    if (result.length === 0) {
      return null;
    }
    return result[0];
  },
};
