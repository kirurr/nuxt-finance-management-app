<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import type { Transaction } from "~~/server/transaction/schema";

const { closeDialog, transactionData } = defineProps<{
  closeDialog: () => void;
  transactionData: Transaction;
}>();
const { $orpc } = useNuxtApp();

const { mutateAsync, isPending } = useMutation({
  mutationFn: async () => {
    await $orpc.transaction.deleteTransaction.call(transactionData.id);
  },
  mutationKey: ["transactions"],
  onSuccess: async (_, __, ___, context) => {
    await context.client.invalidateQueries({ queryKey: ["transactions"] });
    closeDialog();
  },
});
</script>

<template>
  <Button
    variant="destructive"
    :disabled="isPending"
    @click="mutateAsync"
    >Delete transaction</Button
  >
</template>
