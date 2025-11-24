import "dotenv/config";
import { color, icon } from "./server/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { db } from "./server/db/db";

(async function main() {
  const icons: InferSelectModel<typeof icon>[] = [
    {
      id: 1,
      name: "Hamburger",
      path: "/icons/hamburger.svg",
    },
    {
      id: 2,
      name: "Dumbbell",
      path: "/icons/dumbbell.svg",
    },
    {
      id: 3,
      name: "Dollar",
      path: "/icons/circle-dollar-sign.svg",
    },
    {
      id: 4,
      name: "Shopping basket",
      path: "/icons/shopping-basket.svg",
    },
    {
      id: 5,
      name: "Car",
      path: "/icons/car.svg",
    },
    {
      id: 6,
      name: "House",
      path: "/icons/house.svg",
    },
    {
      id: 7,
      name: "Heart",
      path: "/icons/heart.svg",
    },
    {
      id: 8,
      name: "Smile",
      path: "/icons/smile.svg",
    },
    {
      id: 9,
      name: "Graduation cap",
      path: "/icons/graduation-cap.svg",
    },
    {
      id: 10,
      name: "Scale",
      path: "/icons/scale.svg",
    },
  ];

  console.log("seeding icons");
  console.table(icons);
  await db.insert(icon).values(icons).onConflictDoNothing();
  console.log("icons seeded");

  const colors: InferSelectModel<typeof color>[] = [
    {
      id: 1,
      color: "#00acfbef",
    },
    {
      id: 2,
      color: "#2dbe34ef",
    },
    {
      id: 3,
      color: "#1dacbf",
    },
    {
      id: 4,
      color: "#bf1d6b",
    },
    {
      id: 5,
      color: "#d0d613",
    },
    {
      id: 6,
      color: "#2413d6",
    },
    {
      id: 7,
      color: "#ac13d6",
    },
    {
      id: 8,
      color: "#d66413",
    },
    {
      id: 9,
      color: "#8bd613",
    },
    {
      id: 10,
      color: "#d61313",
    },
  ];
  console.log("seeding colors");
  console.table(colors);

  await db.insert(color).values(colors).onConflictDoNothing();
  console.log("colors seeded");

  return;
})();
