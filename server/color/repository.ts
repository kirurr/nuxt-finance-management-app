import { eq }  from "drizzle-orm";
import { db } from "../db/db";
import { color } from "../db/schema";
import type { Color } from "./schema";

export const colorRepository = {
  async getColor(id: number): Promise<Color> {
    return (await db.select().from(color).where(eq(color.id, id)))[0];
  },
  async getColors(): Promise<Color[]> {
    return await db.select().from(color);
  },
};
