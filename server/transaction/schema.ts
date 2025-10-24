import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { transaction } from "../db/schema";
import z from "zod";

export const transactionSchema = createSelectSchema(transaction)

export type Transaction = z.infer<typeof transactionSchema>

export const createTransactionSchema = createInsertSchema(transaction)

export type CreateTransaction = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = createUpdateSchema(transaction, { id: z.number() })

export type UpdateTransaction = z.infer<typeof updateTransactionSchema>
