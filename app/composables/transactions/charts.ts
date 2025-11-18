import type { TransactionWithCategory } from "~~/server/transaction/schema";

const defaultColor = "#00f2d6";

export function calculateChartData(
  type: "income" | "expense",
  data: TransactionWithCategory[],
): {
  colors: string[];
  chartData: {
    name: string;
    total: number;
    color: string;
		category: TransactionWithCategory["category"] | undefined;
  }[];
} {
  const sortedData = data
    .filter((item) => item.type === type)
    .sort((a, b) => b.amount - a.amount);
  const colorsMap = new Map(
    sortedData
      ?.filter((item) => item.type === type)
      .sort((a, b) => b.amount - a.amount)
      .map((item) => [item.category?.name ?? "Without category", item]),
  );

  const valuesMap = new Map<
    string,
    { total: number; transactions: TransactionWithCategory[] }
  >();

  for (const transaction of sortedData) {
    if (transaction.type === (type === "income" ? "expense" : "income")) {
      continue;
    }
    const name = transaction.category?.name ?? "Without category";
    const item = valuesMap.get(name);
    valuesMap.set(name, {
      total: item?.total ?? 0 + transaction.amount,
      transactions: [...(item?.transactions ?? []), transaction],
    });
  }
  const chartData = Array.from(valuesMap.entries()).map(([name, value]) => ({
    name,
    total: value.total,
    color: value.transactions[0]?.category?.color?.color ?? defaultColor,
		category: value.transactions[0]?.category,
  }));

  return {
    colors: Array.from(
      colorsMap
        .values()
        .map((item) => item.category?.color?.color ?? defaultColor),
    ),
    chartData,
  };
}
