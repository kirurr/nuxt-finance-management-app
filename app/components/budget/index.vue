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
  <div v-if="isPending">Loading...</div>
  <div v-else class="flex flex-row gap-2">
      <div>total: {{ data?.amount }}</div>
      <div>spend: {{ totalExpenses }}</div>
      <div>income: {{ totalIncome }}</div>
      <div>remaining: {{ remainingBudget }}</div>
    <template v-if="data">
      <BudgetDialogUpdate :data="data" />
    </template>
    <template v-else>
      <BudgetDialogCreate />
    </template>
  </div>
</template>
