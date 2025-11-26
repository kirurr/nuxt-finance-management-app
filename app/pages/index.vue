<script setup lang="ts">
import { TrendingUp, TrendingDown, LoaderCircle } from "lucide-vue-next";
import { createMoneyString } from "~/lib/utils";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Dashboard - Expensess",
  meta: [
    {
      name: "description",
      content:
        "View your budget summary, expenses, and income on the dashboard",
    },
  ],
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

const { budget } = useBudget();
const { data: budgetData, isPending: isBudgetPending } = budget;

const progressData = computed(() =>
  calculatePercentages(
    budgetData.value?.amount ?? 0,
    budgetData.value?.totalExpenses ?? 0,
  ),
);
</script>
<template>
  <section
    class="space-y-8 lg:space-y-4 px-2 lg:px-0"
    aria-labelledby="budget-summary"
  >
    <div class="flex flex-col lg:flex-row items-center justify-between">
      <div>
        <h1 id="budget-summary" class="text-4xl font-bold mb-2">
          Budget & summary
        </h1>
      </div>
      <DateSelect />
    </div>

    <section aria-labelledby="monthly-budget">
      <Card class="p-6 rounded-md">
				<template v-if="isBudgetPending">
					<div class="flex items-center justify-center min-h-40">
						<LoaderCircle class="size-12 lg:size-16 text-primary/60 animate-spin" />
					</div>
				</template>
        <template v-if="budgetData">
          <div class="flex flex-row justify-between">
            <div>
              <h3
                id="monthly-budget"
                class="text-lg font-bold mb-2 text-muted-foreground"
              >
                Monthly budget
              </h3>
              <span
                class="text-4xl font-bold"
                aria-label="Monthly budget amount"
                >{{ createMoneyString( budgetData?.amount ?? 0 ) }}</span
              >
            </div>
            <div>
              <div class="flex flex-row items-center gap-2">
                <BudgetDialogUpdate :data="budgetData" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4">
            <div class="w-full">
              <div class="flex flex-row items-center justify-between mb-2">
                <span class="text-muted-foreground">Spent</span>
                <span class="font-bold" aria-label="Amount spent">{{
                  createMoneyString( budgetData?.totalExpenses )
                }}</span>
              </div>
              <Progress
                id="spent-progress"
                class="*:bg-red-500"
                :model-value="progressData.spentPercent"
                :aria-valuenow="progressData.spentPercent"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Spent budget percentage"
              />
            </div>
            <div class="w-full">
              <div class="flex flex-row items-center justify-between mb-2">
                <span class="text-muted-foreground">Remaining</span>
                <span class="font-bold" aria-label="Amount remaining">{{
                  createMoneyString( budgetData?.remainingBudget > 0
                    ? budgetData?.remainingBudget
                    : 0 )
                }}</span>
              </div>
              <Progress
                id="remaining-progress"
                class="*:bg-green-500"
                :model-value="progressData.remainingPercent"
                :aria-valuenow="progressData.remainingPercent"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Remaining budget percentage"
              />
            </div>
          </div>
        </template>
        <template v-else-if="!isBudgetPending && !budgetData">
          <div class="flex flex-row items-center gap-2 justify-center min-h-40">
            <BudgetDialogCreate />
          </div>
        </template>
      </Card>
    </section>

    <template v-if="budgetData">
      <div class="flex flex-col lg:flex-row w-full gap-4">
        <section aria-labelledby="monthly-income" class="flex-1">
          <Card
            class="p-4 lg:p-6 rounded-md flex flex-row gap-4 justify-between lg:justify-start lg:flex-col lg:h-full"
          >
            <h3 id="monthly-income">Monthly income</h3>
            <p class="text-2xl font-bold" aria-label="Monthly income amount">
              {{ createMoneyString( budgetData.totalIncome ) }}
            </p>
          </Card>
        </section>
        <section aria-labelledby="monthly-expenses" class="flex-1">
          <Card
            class="p-4 lg:p-6 rounded-md flex flex-row gap-4 justify-between lg:justify-start lg:flex-col lg:h-full"
          >
            <h3 id="monthly-expenses">Monthly expenses</h3>
            <p class="text-2xl font-bold" aria-label="Monthly expenses amount">
              {{ createMoneyString( budgetData.totalExpenses ) }}
            </p>
          </Card>
        </section>
        <section aria-labelledby="monthly-profit" class="flex-1">
          <Card
            class="p-4 lg:p-6 rounded-md flex flex-row gap-4 justify-between lg:justify-start lg:flex-col lg:h-full"
          >
            <h3 id="monthly-profit">Monthly profit</h3>
            <p class="text-2xl font-bold" aria-label="Monthly profit amount">
              {{
                createMoneyString( (budgetData.totalIncome ?? 0) - (budgetData.totalExpenses ?? 0) )
              }}
            </p>
          </Card>
        </section>
      </div>
    </template>

    <div class="flex flex-col lg:flex-row gap-4">
      <Card class="lg:p-6 p-4 rounded-md w-full grow">
        <TransactionChart title="Expenses" type="expense">
          <template #icon>
            <div
              class="rounded-md bg-red-200/50 p-2 text-red-600"
              aria-hidden="true"
            >
              <TrendingDown />
            </div>
          </template>
        </TransactionChart>
      </Card>
      <Card class="p-6 rounded-md w-full grow">
        <TransactionChart title="Income" type="income">
          <template #icon>
            <div
              class="rounded-md bg-green-200/50 p-2 text-green-600"
              aria-hidden="true"
            >
              <TrendingUp />
            </div>
          </template>
        </TransactionChart>
      </Card>
    </div>

    <TransactionSection />
  </section>
</template>
