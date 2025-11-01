import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { transactionTypeEnum } from "../db/schema";
import { transaction } from "../db/schema";
import type { TransactionCategory } from "../category/schema";
import type { Icon } from "../icon/schema";
import z from "zod";
import type { Color } from "../color/schema";

type AllString<T> = {
  [K in keyof T]: string;
};

export const transactionSchema = createSelectSchema(transaction);

export type Transaction = z.infer<typeof transactionSchema>;

export const createTransactionSchema = createInsertSchema(transaction);

export type CreateTransaction = z.infer<typeof createTransactionSchema>;

export type TransactionFormData = Omit<
  AllString<CreateTransaction>,
  "userId" | "type" | "id" | "createdAt"
> & { type: (typeof transactionTypeEnum)[number] };

export const updateTransactionSchema = createUpdateSchema(transaction, {
  id: z.number(),
});

export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;

export type TransactionWithCategory = Transaction & {
  category: (TransactionCategory & { icon: Icon | null; color: Color | null }) | null; // null if no category is set
};
