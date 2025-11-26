import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useQuery, useMutation } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type { TransactionFormData } from "~~/server/transaction/schema";

export function useTransactions() {
  const dateStore = useDateStore();

  const { $orpc } = useNuxtApp();

  const localTimeZone = getLocalTimeZone();
  const transactions = useQuery({
    queryKey: computed(() =>
      [
        ...queryKeys.transactions,
        dateStore.startDateStr,
        dateStore.endDateStr,
      ].filter(Boolean),
    ),
    queryFn: async () => {
      return await $orpc.transaction.getTransactionsByUserId.call({
        startDate: dateStore.startDate.toDate(localTimeZone),
        endDate:
          dateStore.endDate?.toDate(localTimeZone) ??
          dateStore.startDate.toDate(localTimeZone),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: TransactionFormData;
    }) => {
      return await $orpc.transaction.updateTransaction.call({
        ...data,
        id,
        date: parseDate(data.date).toDate(getLocalTimeZone()),
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        amount: Number(data.amount),
      });
    },
    mutationKey: [...queryKeys.transactions],
    onSuccess: async (value, data, ___, context) => {
      context.client.invalidateQueries({
        queryKey: [...queryKeys.transactions],
        exact: false,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      return await $orpc.transaction.createTransaction.call({
        ...data,
        date: parseDate(data.date).toDate(getLocalTimeZone()),
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        amount: Number(data.amount),
      });
    },
    mutationKey: [...queryKeys.transactions],
    onSuccess: async (value, _, ___, context) => {
      context.client.invalidateQueries({
        queryKey: [...queryKeys.transactions],
        exact: false,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await $orpc.transaction.deleteTransaction.call(id);
    },
    mutationKey: [...queryKeys.transactions],
    onSuccess: async (_, id, ___, context) => {
      context.client.invalidateQueries({
        queryKey: [...queryKeys.transactions],
        exact: false,
      });
    },
  });

  return {
    transactions,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
