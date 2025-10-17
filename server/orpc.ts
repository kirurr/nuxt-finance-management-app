import { ORPCError, os } from "@orpc/server";
import { auth } from "./auth";
import { User } from "./user/schema";

export interface ORPCContext {
  headers: Headers;
  user?: User;
}

export const pub = os.$context<ORPCContext>();

export const authed = pub.use(async ({ context, next }) => {
  const session = await auth.api.getSession({
    headers: context.headers,
  });

  if (!session || !session.session || !session.user) {
    throw new ORPCError("UNAUTHORIZED", { message: 'sfsodfsadofsadjfsa' });
  }

  return next({
    context: {
      user: session.user,
    },
  });
});
