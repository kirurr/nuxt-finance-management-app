import z from "zod";
import { authed } from "../orpc";
import {
  createTransactionCategorySchema,
  updateTransactionCategorySchema,
  type TransactionCategory,
} from "./schema";
import { transactionCategoryService } from "./service";

export const transactionCategoryRouter = {
  createTransacion: authed
    .input(createTransactionCategorySchema)
    .handler(async ({ input }): Promise<TransactionCategory> => {
      return await transactionCategoryService.createTransactionCategory(input);
    }),
  updateTransactionCategory: authed
    .input(updateTransactionCategorySchema)
    .handler(async ({ input }): Promise<TransactionCategory> => {
      return await transactionCategoryService.updateTransactionCategory(input.id, input);
    }),
  getTransactionCategory: authed
    .input(z.number())
    .handler(async ({ input }): Promise<TransactionCategory> => {
      return await transactionCategoryService.getTransactionCategory(input);
    }),
  getTransactionCategories: authed.handler(async (): Promise<TransactionCategory[]> => {
    return await transactionCategoryService.getTransactionCategories();
  }),
  deleteTransactionCategory: authed
    .input(z.number())
    .handler(async ({ input }): Promise<void> => {
      return await transactionCategoryService.deleteTransactionCategory(input);
    }),
};
