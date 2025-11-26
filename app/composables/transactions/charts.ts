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
    const name = transaction.category?.name ?? "Without category";
    const item = valuesMap.get(name);
		if (item) {
			item.total += transaction.amount;
			item.transactions.push(transaction);
		}
		else {
			valuesMap.set(name, {
				total:transaction.amount,
				transactions: [transaction],
			});
		}
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
