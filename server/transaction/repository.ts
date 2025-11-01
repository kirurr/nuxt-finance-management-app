import { eq, and, gt, desc } from "drizzle-orm";
import { db } from "../db/db";
import { transaction } from "../db/schema";
import type {
  CreateTransaction,
  Transaction,
  UpdateTransaction,
} from "./schema";

export const transactionRepository = {
  async createTransaction(data: CreateTransaction): Promise<Transaction> {
    return (await db.insert(transaction).values(data).returning())[0];
  },
  async updateTransaction(
    id: number,
    data: UpdateTransaction,
  ): Promise<Transaction> {
    return (
      await db
        .update(transaction)
        .set(data)
        .where(eq(transaction.id, id))
        .returning()
    )[0];
  },
  async getTransaction(id: number): Promise<Transaction> {
    return (
      await db.select().from(transaction).where(eq(transaction.id, id))
    )[0];
  },
  async getTransactionsByUserId(
    id: string,
    pageSize: number = 10,
    cursor?: number,
  ): Promise<{ items: Transaction[]; nextCursor: number | null }> {
    const rows = await db
      .select()
      .from(transaction)
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
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return { items, nextCursor };
  },
  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transaction).where(eq(transaction.id, id));
  },
};
