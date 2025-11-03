import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userBudget } from "../db/schema";
import type * as z from "zod";
import type { AllString } from "../utils";

export const userBudgetSchema = createSelectSchema(userBudget)

export type UserBudget = z.infer<typeof userBudgetSchema>

export const createUserBudgetSchema = createInsertSchema(userBudget)

export type CreateUserBudget = z.infer<typeof createUserBudgetSchema>

export type UserBudgetFormData = Omit<
  AllString<CreateUserBudget>,
  "userId" | "id" | "createdAt">
