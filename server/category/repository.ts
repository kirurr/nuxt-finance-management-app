import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { color, icon, transactionCategory } from "../db/schema";
import type {
  CategoryWithIconAndColor,
  CreateTransactionCategory,
  UpdateTransactionCategory,
} from "./schema";

export const transactionCategoryRepository = {
  async createTransactionCategory(
    data: CreateTransactionCategory,
  ): Promise<CategoryWithIconAndColor> {
    const returning = (
      await db
        .insert(transactionCategory)
        .values(data)
        .returning({ id: transactionCategory.id })
    )[0];

    return await this.getTransactionCategory(returning.id);
  },
  async updateTransactionCategory(
    id: number,
    data: UpdateTransactionCategory,
  ): Promise<CategoryWithIconAndColor> {
    const returning = (
      await db
        .update(transactionCategory)
        .set(data)
        .where(eq(transactionCategory.id, id))
        .returning({ id: transactionCategory.id })
    )[0];

    return await this.getTransactionCategory(returning.id);
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
