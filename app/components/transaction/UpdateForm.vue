<script setup lang="ts">
import { useTransactions } from "~/composables/transactions/useTransactions";
import type {
  Transaction,
  TransactionFormData,
} from "~~/server/transaction/schema";

const { closeDialog, transactionData } = defineProps<{
  closeDialog: () => void;
  transactionData: Transaction;
}>();

const { updateMutation } = useTransactions();

async function handleSubmit(data: TransactionFormData) {
  await updateMutation.mutateAsync({ id: transactionData.id, data });
	closeDialog();
}

const defaultValues: TransactionFormData = {
  name: transactionData.name,
  amount: transactionData.amount.toString(),
  date: transactionData.date.toISOString().split("T")[0]!,
  type: transactionData.type,
  description: transactionData.description ?? "",
  categoryId: transactionData.categoryId?.toString() ?? "",
};
</script>

<template>
    <TransactionForm
      :default-values="defaultValues"
      :action="handleSubmit"
    />
</template>
