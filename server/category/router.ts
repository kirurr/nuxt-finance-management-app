import z from "zod";
import { authed } from "../orpc";
import {
  type CategoryWithIconAndColor,
  createTransactionCategorySchema,
  updateTransactionCategorySchema
} from "./schema";

import { transactionCategoryService } from "./service";

export const transactionCategoryRouter = {
  createCategory: authed
    .input(createTransactionCategorySchema.omit({ userId: true }))
    .handler(async ({ input, context }): Promise<CategoryWithIconAndColor> => {
      return await transactionCategoryService.createTransactionCategory({ ...input, userId: context.user.id });
    }),
  updateCategory: authed
    .input(updateTransactionCategorySchema)
    .handler(async ({ input }): Promise<CategoryWithIconAndColor> => {
      return await transactionCategoryService.updateTransactionCategory(
        input.id,
        input,
      );
    }),
  getCategory: authed
    .input(z.number())
    .handler(async ({ input }): Promise<CategoryWithIconAndColor> => {
      return await transactionCategoryService.getTransactionCategory(input);
    }),
  getCategories: authed
    .handler(async ({ context }): Promise<CategoryWithIconAndColor[]> => {
      return await transactionCategoryService.getTransactionCategories(context.user.id);
    }),
  deleteCategory: authed
    .input(z.number())
    .handler(async ({ input }): Promise<void> => {
      return await transactionCategoryService.deleteTransactionCategory(input);
    }),
};
