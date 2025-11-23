import {
  eq,
  and,
  desc,
  type SQL,
  gte,
  lte,
} from "drizzle-orm";
import { db } from "../db/db";
import { transaction, transactionCategory, icon, color } from "../db/schema";
import type {
  CreateTransaction,
  UpdateTransaction,
  TransactionWithCategory,
} from "./schema";

export const transactionRepository = {
  async createTransaction(
    data: CreateTransaction,
  ): Promise<TransactionWithCategory> {
    const returningId = (
      await db
        .insert(transaction)
        .values(data)
        .returning({ id: transaction.id })
    )[0];
    const newTransactionWithCategory = await this.getTransaction(
      returningId.id,
    );
    return newTransactionWithCategory;
  },
  async updateTransaction(
    id: number,
    data: UpdateTransaction,
  ): Promise<TransactionWithCategory> {
    const returningId = (
      await db
        .update(transaction)
        .set(data)
        .where(eq(transaction.id, id))
        .returning({ id: transaction.id })
    )[0];
    const updatedTransactionWithCategory = await this.getTransaction(
      returningId.id,
    );
    return updatedTransactionWithCategory;
  },
  async getTransaction(id: number): Promise<TransactionWithCategory> {
    const result = await db
      .select({
        transaction: transaction,
        category: transactionCategory,
        icon: icon,
        color: color,
      })
      .from(transaction)
      .leftJoin(
        transactionCategory,
        eq(transaction.categoryId, transactionCategory.id),
      )
      .leftJoin(icon, eq(transactionCategory.iconId, icon.id))
      .leftJoin(color, eq(transactionCategory.colorId, color.id))
      .where(eq(transaction.id, id));

    if (result.length === 0) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    const row = result[0]!;
    return {
      ...row.transaction,
      category: row.category
        ? {
            ...row.category,
            icon: row.icon,
            color: row.color,
          }
        : null,
    };
  },

  async getTransactionsByUserId(
    id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TransactionWithCategory[]> {
    const dateFilter: SQL[] = [];

		dateFilter.push(gte(transaction.date, startDate));
		dateFilter.push(lte(transaction.date, endDate));

    const rows = await db
      .select({
        transaction: transaction,
        category: transactionCategory,
        icon: icon,
        color: color,
      })
      .from(transaction)
      .leftJoin(
        transactionCategory,
        eq(transaction.categoryId, transactionCategory.id),
      )
      .leftJoin(icon, eq(transactionCategory.iconId, icon.id))
      .leftJoin(color, eq(transactionCategory.colorId, color.id))
      .where(and(eq(transaction.userId, id), ...dateFilter))
      .orderBy(desc(transaction.createdAt));

    return rows.map((row) => ({
      ...row.transaction,
      category: row.category
        ? {
            ...row.category,
            icon: row.icon,
            color: row.color,
          }
        : null,
    }));
  },

  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transaction).where(eq(transaction.id, id));
  },
};
