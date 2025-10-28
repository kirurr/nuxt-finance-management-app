import z from "zod";
import { authed } from "../orpc";
import {
  createTransactionCategorySchema,
  updateTransactionCategorySchema,
  type TransactionCategory,
} from "./schema";
import { transactionCategoryService } from "./service";

export const transactionCategoryRouter = {
  createCategory: authed
    .input(createTransactionCategorySchema)
    .handler(async ({ input }): Promise<TransactionCategory> => {
      return await transactionCategoryService.createTransactionCategory(input);
    }),
  updateCategory: authed
    .input(updateTransactionCategorySchema)
    .handler(async ({ input }): Promise<TransactionCategory> => {
      return await transactionCategoryService.updateTransactionCategory(input.id, input);
    }),
  getCategory: authed
    .input(z.number())
    .handler(async ({ input }): Promise<TransactionCategory> => {
      return await transactionCategoryService.getTransactionCategory(input);
    }),
  getCategories: authed.handler(async (): Promise<TransactionCategory[]> => {
    return await transactionCategoryService.getTransactionCategories();
  }),
  deleteCategory: authed
    .input(z.number())
    .handler(async ({ input }): Promise<void> => {
      return await transactionCategoryService.deleteTransactionCategory(input);
    }),
};
