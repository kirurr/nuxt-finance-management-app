<script setup lang="ts">
import { TrendingUp, TrendingDown } from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
});

function calculatePercentages(total: number, spent: number) {
  if (total === 0) {
    return { spentPercent: 0, remainingPercent: 0 };
  }

  let spentPercent = Math.round((spent / total) * 100);

  // Ограничиваем максимум 100%
  if (spentPercent > 100) spentPercent = 100;

  const remainingPercent = 100 - spentPercent;

  return {
    spentPercent: spentPercent,
    remainingPercent: remainingPercent,
  };
}

const { budget, monthBudgetInfo, remainingBudget, totalExpenses } = useBudget();
const { isPending, data: budgetData } = budget;

const progressData = computed(() =>
  calculatePercentages(budgetData.value?.amount ?? 0, totalExpenses.value ?? 0),
);
</script>
<template>
  <section class="space-y-4" labeledby="budget-summary">
    <div class="flex flex-row items-center justify-between">
      <div>
        <h1 id="budget-summary" class="text-4xl font-bold mb-2">
          Budget & summary
        </h1>
        <p class="text-lg text-muted-foreground">Lorem ipsum dolor sit amet.</p>
      </div>
      <DateSelect />
    </div>

    <section labeledby="monthly-budget">
      <Card class="p-6 rounded-md">
        <div class="flex flex-row justify-between">
          <div>
            <h3
              id="monthly-budget"
              class="text-lg font-bold mb-2 text-muted-foreground"
            >
              Monthly budget
            </h3>
            <span class="text-4xl font-bold">{{
              budgetData?.amount ?? 0
            }}</span>
          </div>
          <template v-if="budgetData">
            <BudgetDialogUpdate :data="budgetData" />
          </template>
          <template v-else>
            <BudgetDialogCreate />
          </template>
        </div>
        <div class="flex flex-row gap-4">
          <div class="w-full">
            <div class="flex flex-row items-center justify-between mb-2">
              <span class="text-muted-foreground">Spent</span>
              <span class="font-bold">{{ totalExpenses }}</span>
            </div>
            <Progress
              id="spent-progress"
              class="*:bg-red-500"
              :model-value="progressData.spentPercent"
            />
          </div>
          <div class="w-full">
            <div class="flex flex-row items-center justify-between mb-2">
              <span class="text-muted-foreground">Remaining</span>
              <span class="font-bold">{{
                remainingBudget > 0 ? remainingBudget : 0
              }}</span>
            </div>
            <Progress
              id="remaining-progress"
              class="*:bg-green-500"
              :model-value="progressData.remainingPercent"
            />
          </div>
        </div>
      </Card>
    </section>

    <div class="flex flex-row gap-4">
      <Card class="p-6 rounded-md my-8 w-full">
        <TransactionChart title="Expenses" type="expense">
          <template #icon>
            <div class="rounded-md bg-red-200/50 p-2 text-red-600">
              <TrendingDown />
            </div>
          </template>
        </TransactionChart>
      </Card>
      <Card class="p-6 rounded-md my-8 w-full">
        <TransactionChart title="Income" type="income">
          <template #icon>
            <div class="rounded-md bg-green-200/50 p-2 text-green-600">
              <TrendingUp />
            </div>
          </template>
        </TransactionChart>
      </Card>
    </div>

    <div class="flex flex-row w-full gap-4">
      <section labeledby="monthly-income" class="flex-1">
        <Card class="p-6 rounded-md">
          <h3 id="monthly-income">Monthly income</h3>
          <p class="text-2xl font-bold">
            {{ monthBudgetInfo.data.value?.totalIncome }}
          </p>
        </Card>
      </section>
      <section labeledby="monthly-expenses" class="flex-1">
        <Card class="p-6 rounded-md">
          <h3 id="monthly-expenses">Monthly expenses</h3>
          <p class="text-2xl font-bold">
            {{ monthBudgetInfo.data.value?.totalExpenses }}
          </p>
        </Card>
      </section>
      <section labeledby="monthly-profit" class="flex-1">
        <Card class="p-6 rounded-md">
          <h3 id="monthly-profit">Monthly profit</h3>
          <p class="text-2xl font-bold">
            {{
              (monthBudgetInfo.data.value?.totalIncome ?? 0) -
              (monthBudgetInfo.data.value?.totalExpenses ?? 0)
            }}
          </p>
        </Card>
      </section>
    </div>
  </section>

  <TransactionSection />
</template>
