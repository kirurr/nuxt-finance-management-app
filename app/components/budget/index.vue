<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";

const { $orpc } = useNuxtApp();

const dateStore = useDateStore();

const { isPending, data } = useQuery({
  queryKey: computed(() => [
    ...queryKeys.budget,
    dateStore.startDateStr,
    dateStore.endDateStr,
  ]),
  queryFn: async () => {
    return await $orpc.budget.calculateUserBudget.call({
      start: dateStore.startDate.toDate(),
      end: dateStore.endDate?.toDate() ?? undefined,
    });
  },
});
</script>

<template>
  <div v-if="isPending">Loading...</div>
  <div v-else>
    <div>
      <div>total: {{ data?.amount }} </div>
      <div>spend: {{ data?.totalExpenses }} </div>
			<div>income: {{ data?.totalIncome }}</div>
			<div>remaining: {{ data?.remainingBudget }}</div>
		</div>
    <div v-if="data">
      <BudgetDialogUpdate :data="data" />
    </div>
    <div v-else>
      <BudgetDialogCreate />
    </div>
  </div>
</template>
