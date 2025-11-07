<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import type { Transaction } from "~~/server/transaction/schema";
import queryKeys from "~/lib/query-keys";

const { closeDialog, transactionData } = defineProps<{
  closeDialog: () => void;
  transactionData: Transaction;
}>();
const { $orpc } = useNuxtApp();

const { mutateAsync, isPending } = useMutation({
  mutationFn: async () => {
    await $orpc.transaction.deleteTransaction.call(transactionData.id);
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
  <Button variant="destructive" :disabled="isPending" @click="mutateAsync"
    >Delete transaction</Button
  >
</template>
