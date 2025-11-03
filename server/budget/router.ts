import { authed } from "../orpc";
import * as z from "zod";
import { userBudgetService } from "./service";
import { createUserBudgetSchema } from "./schema";

export const budgetRouter = {
  getUserBudgetByMonth: authed
    .input(z.number())
    .handler(async ({ input, context }) => {
      return await userBudgetService.getUserBudgetByMonth(
        context.user.id,
        input,
      );
    }),

  createUserBudget: authed
    .input(createUserBudgetSchema)
    .handler(async ({ input, context }) => {
      return await userBudgetService.createUserBudget({
        ...input,
        userId: context.user.id,
      });
    }),
};
