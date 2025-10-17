import { createSelectSchema } from "drizzle-zod";
import { user } from "../db/schema";
import z from "zod";

export const userSchema = createSelectSchema(user, {
	image: z.string().optional().nullable()
})

export type User = z.infer<typeof userSchema>
