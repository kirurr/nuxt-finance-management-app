import "dotenv/config";
import { icon } from "./server/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { db } from "./server/db/db";

(async function main() {
  const icons: InferSelectModel<typeof icon>[] = [
    {
      id: 1,
      name: "money",
      path: "icons/money.svg",
    },
  ];

	console.log('seeding icons');
	console.table(icons)
  await db.insert(icon).values(icons).onConflictDoNothing();
	console.log('icons seeded');
})();
