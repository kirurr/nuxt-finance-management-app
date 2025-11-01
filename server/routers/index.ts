import { transactionCategoryRouter } from "../category/router";
import { colorRouter } from "../color/router";
import { iconRouter } from "../icon/router";
import { authed } from "../orpc";
import { transactionRouter } from "../transaction/router";

export const router = {
	test: authed.handler(({ context }) => {
		return context.user
	}),
	transaction: transactionRouter,
	category: transactionCategoryRouter,
	color: colorRouter,
	icon: iconRouter,
}
