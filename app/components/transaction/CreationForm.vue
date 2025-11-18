<script setup lang="ts">
import { useTransactions } from "~/composables/transactions/useTransactions";
import type { TransactionFormData } from "~~/server/transaction/schema";

const { closeDialog } = defineProps<{
  closeDialog: () => void;
}>();

const { createMutation } = useTransactions();

async function handleSubmit(data: TransactionFormData) {
  await createMutation.mutateAsync(data);
  closeDialog();
}
</script>

<template>
  <div>
    <TransactionForm :action="handleSubmit" />
  </div>
</template>
