import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { transactionCategory } from "../db/schema";
import type {
  CreateTransactionCategory,
  TransactionCategory,
  UpdateTransactionCategory,
} from "./schema";

export const transactionCategoryRepository = {
  async createTransactionCategory(data: CreateTransactionCategory): Promise<TransactionCategory> {
    return (await db.insert(transactionCategory).values(data).returning())[0];
  },
  async updateTransactionCategory(
    id: number,
    data: UpdateTransactionCategory,
  ): Promise<TransactionCategory> {
    return (
      await db
        .update(transactionCategory)
        .set(data)
        .where(eq(transactionCategory.id, id))
        .returning()
    )[0];
  },
  async getTransactionCategory(id: number): Promise<TransactionCategory> {
    return (
      await db.select().from(transactionCategory).where(eq(transactionCategory.id, id))
    )[0];
  },
  async getTransactionCategories(): Promise<TransactionCategory[]> {
    return await db.select().from(transactionCategory);
  },
  async deleteTransactionCategory(id: number): Promise<void> {
    await db.delete(transactionCategory).where(eq(transactionCategory.id, id));
  },
};
