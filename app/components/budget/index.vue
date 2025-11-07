<script setup lang="ts">
import { getLocalTimeZone, now } from "@internationalized/date";
import { useQuery } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type { UserBudget } from "~~/server/budget/schema";
import type { Transaction } from "~~/server/transaction/schema";

const { $orpc } = useNuxtApp();

const localTimeZone = getLocalTimeZone();
const monthCalendarDate = now(localTimeZone);

const userBudget = useQuery({
  queryKey: [...queryKeys.budget],
  queryFn: async (): Promise<UserBudget> =>
    await $orpc.budget.getUserBudgetByMonth.call(monthCalendarDate.month),
});

const transactions = useQuery({
  queryKey: [...queryKeys.transactions, monthCalendarDate.month],
  queryFn: async (): Promise<Transaction[]> => {
    return await $orpc.transaction.getTransactionsByUserIdAndMonth.call({
      month: monthCalendarDate.toDate(),
    });
  },
});

const isPending = computed(
  () => userBudget.isPending.value || transactions.isPending.value,
);

const spend = computed(
  () =>
    transactions.data.value
      ?.filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0) ?? 0,
);

const income = computed(
  () =>
    transactions.data.value
      ?.filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0) ?? 0,
);

const budgetRemaining = computed(() =>
  userBudget.data.value ? userBudget.data.value.amount - spend.value : 0,
);
</script>

<template>
  <div v-if="isPending">Loading...</div>
  <div v-else>
    <div>
      spend: {{ spend.toLocaleString() }} income:
      {{ income.toLocaleString() }} remaining:
      {{ budgetRemaining.toLocaleString() }}
    </div>
    <div v-if="userBudget.data.value">
      <BudgetDialogUpdate :data="userBudget.data.value" />
    </div>
    <div v-else>
      <BudgetDialogCreate />
    </div>
  </div>
</template>
