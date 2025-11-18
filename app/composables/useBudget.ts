import { useQuery, useMutation } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type { UserBudget, UserBudgetFormData } from "~~/server/budget/schema";
import { useTransactions } from "./transactions/useTransactions";

export function useBudget() {
  const dateStore = useDateStore();

  const { $orpc } = useNuxtApp();

  const budget = useQuery({
    queryKey: computed(() =>
      [
        ...queryKeys.budget,
        dateStore.startDateStr,
        dateStore.endDateStr,
      ].filter(Boolean),
    ),
    queryFn: async () =>
      await $orpc.budget.getUserBudgetByMonth.call(dateStore.startDate.month),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UserBudgetFormData;
    }) => {
      return await $orpc.budget.updateUserBudget.call({
        id,
        amount: Number(data.amount),
        month: Number(data.month),
        year: Number(data.year),
      });
    },
    mutationKey: [...queryKeys.budget],
    onSuccess: async (value, _, ___, context) => {
      context.client.setQueriesData<UserBudget>(
        { queryKey: [...queryKeys.budget], exact: false },
        () => value,
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserBudgetFormData) => {
      return await $orpc.budget.createUserBudget.call({
        ...data,
        amount: Number(data.amount),
        month: Number(data.month),
        year: Number(data.year),
      });
    },
    mutationKey: [...queryKeys.budget],
    onSuccess: async (value, _, ___, context) => {
      context.client.setQueriesData<UserBudget>(
        { queryKey: [...queryKeys.budget], exact: false },
        () => value,
      );
    },
  });

  const { transactions } = useTransactions();
  const { data: transactionsData } = transactions;

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
    return (budget.data.value?.amount ?? 0) - (totalExpenses.value ?? 0);
  });

  const monthBudgetInfo = useQuery({
    queryKey: computed(() =>
      [...queryKeys.budget, dateStore.startDateStr].filter(Boolean),
    ),
    queryFn: async () => {
      return await $orpc.budget.calculateUserBudget.call({
        start: dateStore.startDate.toDate(),
      });
    },
    refetchInterval: 3000,
  });

  return {
    budget,
    monthBudgetInfo,
    createMutation,
    updateMutation,
    totalExpenses,
    totalIncome,
    remainingBudget,
  };
}
