import z from "zod";
import { authed } from "../orpc";
import {
  createTransactionSchema,
  updateTransactionSchema,
  type Transaction,
} from "./schema";
import { transactionService } from "./service";

export const transactionRouter = {
  createTransaction: authed
    .input(createTransactionSchema)
    .handler(async ({ input }): Promise<Transaction> => {
      return await transactionService.createTransaction(input);
    }),
  updateTransaction: authed
    .input(updateTransactionSchema)
    .handler(async ({ input }): Promise<Transaction> => {
      return await transactionService.updateTransaction(input.id, input);
    }),
  getTransaction: authed
    .input(z.number())
    .handler(async ({ input }): Promise<Transaction> => {
      return await transactionService.getTransaction(input);
    }),
  getTransactionsByUserId: authed
    .input(
      z.object({
        pageSize: z.number().optional(),
        cursor: z.number().optional(),
      }),
    )
    .handler(
      async ({
        context,
        input,
      }): Promise<{ items: Transaction[]; nextCursor: number | null }> => {
        return await transactionService.getTransactionsByUserId(
          context.user.id,
          input.pageSize,
          input.cursor,
        );
      },
    ),
  deleteTransaction: authed
    .input(z.number())
    .handler(async ({ input }): Promise<void> => {
      return await transactionService.deleteTransaction(input);
    }),
};
