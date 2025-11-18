<script setup lang="ts">
import { useTransactions } from "~/composables/transactions/useTransactions";
import type {
  Transaction,
} from "~~/server/transaction/schema";

const { closeDialog, transactionData } = defineProps<{
  closeDialog: () => void;
  transactionData: Transaction;
}>();
const { deleteMutation } = useTransactions();
const { isPending } = deleteMutation;

async function handleSubmit() {
  await deleteMutation.mutateAsync(transactionData.id);
	closeDialog();
}
</script>

<template>
  <Button variant="destructive" :disabled="isPending" @click="handleSubmit"
    >Delete transaction</Button
  >
</template>
