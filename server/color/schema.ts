import {
  createSelectSchema,
} from "drizzle-zod";
import { color } from "../db/schema";
import type z from "zod";

export const colorSchema = createSelectSchema(color);

export type Color = z.infer<typeof colorSchema>;

