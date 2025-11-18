import z from "zod";
import { authed } from "../orpc";
import {
  createTransactionSchema,
  updateTransactionSchema,
  type Transaction,
  type TransactionWithCategory,
  type CategoryTransactionCount,
} from "./schema";
import { transactionService } from "./service";

export const transactionRouter = {
  createTransaction: authed
    .input(createTransactionSchema.omit({ userId: true }))
    .handler(async ({ input, context }): Promise<TransactionWithCategory> => {
      return await transactionService.createTransaction({ ...input, userId: context.user.id });
    }),
  updateTransaction: authed
    .input(updateTransactionSchema)
    .handler(async ({ input, context }): Promise<TransactionWithCategory> => {
      return await transactionService.updateTransaction(input.id, { ...input, userId: context.user.id });
    }),
  getTransaction: authed
    .input(z.number())
    .handler(async ({ input }): Promise<TransactionWithCategory> => {
      return await transactionService.getTransaction(input);
    }),
  getTransactionsByUserId: authed
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .handler(async ({ context, input }): Promise<TransactionWithCategory[]> => {
      return await transactionService.getTransactionsByUserId(
        context.user.id,
        input.startDate,
        input.endDate,
      );
    }),

  deleteTransaction: authed
    .input(z.number())
    .handler(async ({ input }): Promise<void> => {
      return await transactionService.deleteTransaction(input);
    }),

  getTransactionsByUserIdAndMonth: authed
    .input(
      z.object({
        month: z.date(),
      }),
    )
    .handler(async ({ context, input }): Promise<Transaction[]> => {
      return await transactionService.getTransactionsByUserIdAndMonth(
        context.user.id,
        input.month,
      );
    }),

  groupTransactionsByCategory: authed
    .input(
      z
        .object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional(), // Optional input object so users can call without dates if they want
    )
    .handler(
      async ({ context, input }): Promise<CategoryTransactionCount[]> => {
        return await transactionService.groupTransactionsByCategory(
          context.user.id,
          input?.startDate,
          input?.endDate,
        );
      },
    ),
};
