import { eq, and, gt, desc, type SQL, gte, lte } from "drizzle-orm";
import { db } from "../db/db";
import { transaction, transactionCategory, icon, color } from "../db/schema";
import type {
  CreateTransaction,
  Transaction,
  UpdateTransaction,
  TransactionWithCategory,
} from "./schema";

export const transactionRepository = {
  async createTransaction(data: CreateTransaction): Promise<Transaction> {
    const result = (await db.insert(transaction).values(data).returning())[0];
    return result;
  },
  async updateTransaction(
    id: number,
    data: UpdateTransaction,
  ): Promise<Transaction> {
    const result = (
      await db
        .update(transaction)
        .set(data)
        .where(eq(transaction.id, id))
        .returning()
    )[0];
    if (!result) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    return result;
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
    pageSize: number = 10,
    cursor?: number,
  ): Promise<{ items: TransactionWithCategory[]; nextCursor: number | null }> {
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
      .where(
        and(
          eq(transaction.userId, id),
          cursor ? gt(transaction.id, cursor) : undefined,
        ),
      )
      .limit(pageSize + 1)
      .orderBy(desc(transaction.createdAt));

    const hasNextPage = rows.length > pageSize;
    const items = hasNextPage ? rows.slice(0, pageSize) : rows;

    // Transform the result to include category and icon data
    const transformedItems = items.map((row) => ({
      ...row.transaction,
      category: row.category
        ? {
            ...row.category,
            icon: row.icon,
            color: row.color,
          }
        : null,
    }));

    const nextCursor = hasNextPage
      ? transformedItems[transformedItems.length - 1]!.id
      : null;

    return {
      items: transformedItems,
      nextCursor,
    };
  },
  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transaction).where(eq(transaction.id, id));
  },
};
