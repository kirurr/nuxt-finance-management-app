import { authed } from "../orpc";

export const router = {
	test: authed.handler(({ context }) => {
		return context.user
	})
}
