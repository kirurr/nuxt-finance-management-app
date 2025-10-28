import { transactionCategoryRouter } from "../category/router";
import { authed } from "../orpc";
import { transactionRouter } from "../transaction/router";

export const router = {
	test: authed.handler(({ context }) => {
		return context.user
	}),
	transaction: transactionRouter,
	category: transactionCategoryRouter,
}
