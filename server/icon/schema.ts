import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { icon } from "../db/schema";
import z from "zod";

type AllString<T> = {
  [K in keyof T]: string;
};

export const iconSchema = createSelectSchema(icon);

export type Icon = z.infer<typeof iconSchema>;

export const createIconSchema = createInsertSchema(icon);

export type CreateIcon = z.infer<typeof createIconSchema>;

export type IconFormData = Omit<
  AllString<CreateIcon>,
  "userId" | 'id' | "createdAt"
>;

export const updateIconSchema = createUpdateSchema(icon, {
  id: z.number(),
});

export type UpdateIcon = z.infer<typeof updateIconSchema>;
