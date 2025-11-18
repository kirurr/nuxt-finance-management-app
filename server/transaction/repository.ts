import {
  eq,
  and,
  desc,
  type SQL,
  gte,
  lte,
  isNull,
  isNotNull,
  sql,
} from "drizzle-orm";
import { db } from "../db/db";
import { transaction, transactionCategory, icon, color } from "../db/schema";
import type {
  CreateTransaction,
  Transaction,
  UpdateTransaction,
  TransactionWithCategory,
  CategoryTransactionCount,
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

  async getTransactionsByUserIdAndMonth(
    id: string,
    month: Date,
  ): Promise<Transaction[]> {
    const monthStart = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1),
    );
    const monthEnd = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1),
    );

    const monthFilter: SQL[] = [
      gte(transaction.date, monthStart),
      lte(transaction.date, monthEnd),
    ];

    const rows = await db
      .select()
      .from(transaction)
      .where(and(eq(transaction.userId, id), ...monthFilter));

    return rows;
  },

  async getTransactionsByUserId(
    id: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionWithCategory[]> {
    const dateFilter: SQL[] = [];

    if (startDate && endDate) {
      // If start date equals end date, return transactions for that specific day
      if (startDate.toDateString() === endDate.toDateString()) {
        // Create a start of day and end of day for the same date
        const startOfDay = new Date(startDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        dateFilter.push(gte(transaction.date, startOfDay));
        dateFilter.push(lte(transaction.date, endOfDay));
      } else {
        dateFilter.push(gte(transaction.date, startDate));
        dateFilter.push(lte(transaction.date, endDate));
      }
    } else {
      if (startDate) {
        dateFilter.push(gte(transaction.date, startDate));
      }
      if (endDate) {
        dateFilter.push(lte(transaction.date, endDate));
      }
    }

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

  async groupTransactionsByCategory(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<CategoryTransactionCount[]> {
    const dateFilter: SQL[] = [];

    if (startDate && endDate) {
      // If start date equals end date, return transactions for that specific day
      if (startDate.toDateString() === endDate.toDateString()) {
        // Create a start of day and end of day for the same date
        const startOfDay = new Date(startDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        dateFilter.push(gte(transaction.date, startOfDay));
        dateFilter.push(lte(transaction.date, endOfDay));
      } else {
        dateFilter.push(gte(transaction.date, startDate));
        dateFilter.push(lte(transaction.date, endDate));
      }
    } else {
      if (startDate) {
        dateFilter.push(gte(transaction.date, startDate));
      }
      if (endDate) {
        dateFilter.push(lte(transaction.date, endDate));
      }
    }

    // First, get transactions with categories
    const resultWithCategory = await db
      .select({
        categoryId: transaction.categoryId,
        categoryData: transactionCategory,
        iconData: icon,
        colorData: color,
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(transaction)
      .leftJoin(
        transactionCategory,
        eq(transaction.categoryId, transactionCategory.id),
      )
      .leftJoin(icon, eq(transactionCategory.iconId, icon.id))
      .leftJoin(color, eq(transactionCategory.colorId, color.id))
      .where(
        and(
          eq(transaction.userId, userId),
          ...dateFilter,
          isNotNull(transaction.categoryId), // Only transactions with categories
        ),
      )
      .groupBy(transaction.categoryId);

    // Then, get count of transactions without categories
    const resultWithoutCategory = await db
      .select({
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          isNull(transaction.categoryId), // Only transactions without categories
          ...dateFilter,
        ),
      );

    // Combine results
    const groupedResult = resultWithCategory.map((row) => ({
      category: row.categoryData
        ? {
            ...row.categoryData,
            icon: row.iconData,
            color: row.colorData,
          }
        : null,
      count: Number(row.count),
    }));

    // Add the count for transactions without a category if any exist
    if (
      resultWithoutCategory.length > 0 &&
      resultWithoutCategory[0]?.count > 0
    ) {
      groupedResult.push({
        category: null,
        count: Number(resultWithoutCategory[0]!.count),
      });
    }

    return groupedResult;
  },
};
