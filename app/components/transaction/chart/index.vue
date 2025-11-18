<script setup lang="ts">
import { calculateChartData } from "~/composables/transactions/charts";
import { useTransactions } from "~/composables/transactions/useTransactions";
const { title, type } = defineProps<{
	title?: string;
	type: "expense" | "income";
}>();

const { transactions } = useTransactions();
const { data } = transactions;
const chart = computed(() => calculateChartData(type, data.value ?? []));

const value = computed(() => chart.value.chartData.reduce((acc, cur) => acc + cur.total, 0));
</script>

<template>
  <div class="space-y-8">
		<div class="flex flex-row items-center gap-2">
			<slot name="icon"/>
			<div>
				<h3 class="text-lg font-bold">{{ title }}:</h3>
				<p class="text-muted-foreground">{{ value }} for given period</p>
			</div>
		</div>
    <DonutChart
      index="name"
      :data="chart.chartData"
      :category="'total'"
      :colors="[...chart.colors]"
			class="size-92 mx-auto"
			:arc-width="60"
    />
		<TransactionChartCategoryList :categories="chart.chartData" />
  </div>
</template>
