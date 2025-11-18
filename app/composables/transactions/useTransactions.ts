import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useQuery, useMutation } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type {
  TransactionFormData,
  TransactionWithCategory,
} from "~~/server/transaction/schema";

export function useTransactions() {
  const dateStore = useDateStore();

  const { $orpc } = useNuxtApp();

  const transactions = useQuery({
    queryKey: computed(() =>
      [
        ...queryKeys.transactions,
        dateStore.startDateStr,
        dateStore.endDateStr,
      ].filter(Boolean),
    ),
    queryFn: async () =>
      await $orpc.transaction.getTransactionsByUserId.call({
        startDate: dateStore.startDate.toDate(),
        endDate: dateStore.endDate?.toDate() ?? dateStore.startDate.toDate(),
      }),
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
      context.client.setQueriesData<TransactionWithCategory[]>(
        { queryKey: [...queryKeys.transactions], exact: false },
        (old) => {
          if (!old) {
            return [value];
          }

          const index = old?.findIndex((item) => item.id === data.id);
          if (index == -1) {
            return old;
          }

          const newArray = [...old];
          newArray[index] = value;
          return newArray;
        },
      );
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
      context.client.setQueriesData<TransactionWithCategory[]>(
        { queryKey: [...queryKeys.transactions], exact: false },
        (old) => [value, ...(old ?? [])],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await $orpc.transaction.deleteTransaction.call(id);
    },
    mutationKey: [...queryKeys.transactions],
    onSuccess: async (_, id, ___, context) => {
      context.client.setQueriesData<TransactionWithCategory[]>(
        { queryKey: [...queryKeys.transactions], exact: false },
        (old) => [...(old ?? [])].filter((item) => item.id !== id),
      );
    },
  });

  return {
    transactions,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
