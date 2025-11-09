import { authed } from "../orpc";
import * as z from "zod";
import { userBudgetService } from "./service";
import { createUserBudgetSchema, updateUserBudgetSchema } from "./schema";

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

  updateUserBudget: authed
    .input(updateUserBudgetSchema)
    .handler(async ({ input, context }) => {
      return await userBudgetService.updateUserBudget({
        ...input,
        userId: context.user.id,
      });
    }),

  calculateUserBudget: authed
    .input(
      z.object({
        start: z.date(),
        end: z.date().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
			let end = input.end;
      if (!end) {
        end = new Date(input.start.getTime());
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
      }
      return await userBudgetService.calculateUserBudget(
        context.user.id,
        input.start,
				end
      );
    }),
};
