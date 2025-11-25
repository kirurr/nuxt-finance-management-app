<script setup lang="ts">
import { useTransactions } from '~/composables/transactions/useTransactions';


const { transactions } = useTransactions();
const { data: transactionsData } = transactions;

const { budget } = useBudget();
const { isPending, data } = budget;

const totalExpenses = computed(() => {
  return transactionsData.value?.reduce((total, transaction) => {
    if (transaction.type === "expense") {
      return total + transaction.amount;
    }
    return total;
  }, 0);
});

const totalIncome = computed(() => {
  return transactionsData.value?.reduce((total, transaction) => {
    if (transaction.type === "income") {
      return total + transaction.amount;
    }
    return total;
  }, 0);
});

const remainingBudget = computed(() => {
  return (data.value?.amount ?? 0) - (totalExpenses.value ?? 0);
});
</script>

<template>
  <div v-if="isPending" role="status" aria-label="Loading budget data">Loading...</div>
  <div v-else class="flex flex-row gap-2" role="group" aria-label="Budget summary information">
      <div aria-label="Total budget amount">total: {{ data?.amount }}</div>
      <div aria-label="Total expenses">spend: {{ totalExpenses }}</div>
      <div aria-label="Total income">income: {{ totalIncome }}</div>
      <div aria-label="Remaining budget">remaining: {{ remainingBudget }}</div>
    <template v-if="data">
      <BudgetDialogUpdate :data="data" />
    </template>
    <template v-else>
      <BudgetDialogCreate />
    </template>
  </div>
</template>
