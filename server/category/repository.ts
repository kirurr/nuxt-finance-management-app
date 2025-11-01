import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { color, icon, transactionCategory } from "../db/schema";
import type {
  CategoryWithIconAndColor,
  CreateTransactionCategory,
  TransactionCategory,
  UpdateTransactionCategory,
} from "./schema";

export const transactionCategoryRepository = {
  async createTransactionCategory(
    data: CreateTransactionCategory,
  ): Promise<TransactionCategory> {
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
  async getTransactionCategory(id: number): Promise<CategoryWithIconAndColor> {
    const row = (
      await db
        .select({
          transactionCategory: transactionCategory,
          icon: icon,
          color: color,
        })
        .from(transactionCategory)
        .where(eq(transactionCategory.id, id))
        .leftJoin(icon, eq(transactionCategory.iconId, icon.id))
        .leftJoin(color, eq(transactionCategory.colorId, color.id))
    )[0];

    const transformedItem = {
      ...row.transactionCategory,
      icon: row.icon,
      color: row.color,
    };

    return transformedItem;
  },

  async getTransactionCategories(
    userId: string,
  ): Promise<CategoryWithIconAndColor[]> {
    const rows = await db
      .select({
        transactionCategory: transactionCategory,
        icon: icon,
        color: color,
      })
      .from(transactionCategory)
      .where(eq(transactionCategory.userId, userId))
      .leftJoin(icon, eq(transactionCategory.iconId, icon.id))
      .leftJoin(color, eq(transactionCategory.colorId, color.id));

    const transformedItems = rows.map((row) => ({
      ...row.transactionCategory,
      icon: row.icon,
      color: row.color,
    }));

    return transformedItems;
  },
  async deleteTransactionCategory(id: number): Promise<void> {
    await db.delete(transactionCategory).where(eq(transactionCategory.id, id));
  },
};
