import z from "zod";
import { authed } from "../orpc";
import {
  createTransactionSchema,
  updateTransactionSchema,
  type TransactionWithCategory,
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
        startDate: z.date(),
        endDate: z.date()
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
};
