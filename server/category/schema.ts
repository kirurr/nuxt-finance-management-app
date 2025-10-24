import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { transactionCategory } from "../db/schema";
import z from "zod";

export const transactionCategorySchema = createSelectSchema(transactionCategory)

export type TransactionCategory = z.infer<typeof transactionCategorySchema>

export const createTransactionCategorySchema = createInsertSchema(transactionCategory)

export type CreateTransactionCategory = z.infer<typeof createTransactionCategorySchema>

export const updateTransactionCategorySchema = createUpdateSchema(transactionCategory, { id: z.number() })

export type UpdateTransactionCategory = z.infer<typeof updateTransactionCategorySchema>
