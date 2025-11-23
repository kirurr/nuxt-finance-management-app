import { useQuery, useMutation } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type { UserBudget, UserBudgetFormData } from "~~/server/budget/schema";
import { getLocalTimeZone } from "@internationalized/date";

export function useBudget() {
  const dateStore = useDateStore();

  const { $orpc } = useNuxtApp();

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

  const localTimeZone = getLocalTimeZone();

  const monthAndYear = computed<[string, string]>(() => {
    const month = dateStore.startDate.month.toString();
    const year = dateStore.startDate.year.toString();

    return [month, year];
  });

  const budget = useQuery({
    queryKey: computed(() =>
      [...queryKeys.budget, ...monthAndYear.value].filter(Boolean),
    ),
    queryFn: async () => {
      return await $orpc.budget.calculateUserBudget.call({
        start: dateStore.startDate.toDate(localTimeZone),
      });
    },
    refetchInterval: 3000,
  });

  return {
    budget,
    createMutation,
    updateMutation,
  };
}
