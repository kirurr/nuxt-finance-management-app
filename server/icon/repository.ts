import { eq }  from "drizzle-orm";
import { db } from "../db/db";
import { icon } from "../db/schema";
import type { CreateIcon, Icon, UpdateIcon } from "./schema";

export const iconRepository = {
  async createIcon(data: CreateIcon): Promise<Icon> {
    return (await db.insert(icon).values(data).returning())[0];
  },
  async updateIcon(id: number, data: UpdateIcon): Promise<Icon> {
    return (
      await db.update(icon).set(data).where(eq(icon.id, id)).returning()
    )[0];
  },
  async getIcon(id: number): Promise<Icon> {
    return (await db.select().from(icon).where(eq(icon.id, id)))[0];
  },
  async getIcons(): Promise<Icon[]> {
    return await db.select().from(icon);
  },
  async deleteIcon(id: number): Promise<void> {
    await db.delete(icon).where(eq(icon.id, id));
  },
};
