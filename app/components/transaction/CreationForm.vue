<script setup lang="ts">
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { useMutation } from "@tanstack/vue-query";
import type { TransactionFormData } from "~~/server/transaction/schema";
import queryKeys from "~/lib/query-keys";

const { closeDialog } = defineProps<{
  closeDialog: () => void;
}>();

const session = authClient.useSession();
const { $orpc } = useNuxtApp();

const mutation = useMutation({
  mutationFn: async (data: TransactionFormData) => {
    await $orpc.transaction.createTransaction.call({
      ...data,
      userId: session.value!.data!.user.id,
      date: parseDate(data.date).toDate(getLocalTimeZone()),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      amount: Number(data.amount),
    });
  },
  mutationKey: [...queryKeys.transactions],
  onSuccess: async (_, __, ___, context) => {
    await context.client.invalidateQueries({
      queryKey: [...queryKeys.transactions],
      exact: false,
    });
    closeDialog();
  },
});
</script>

<template>
  <div>
    <TransactionForm :action="mutation.mutateAsync" />
  </div>
</template>
