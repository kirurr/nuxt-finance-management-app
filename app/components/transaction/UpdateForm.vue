<script setup lang="ts">
import {
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";
import { useMutation } from "@tanstack/vue-query";
import type {
  Transaction,
  TransactionFormData,
} from "~~/server/transaction/schema";

const { closeDialog, transactionData } = defineProps<{
  closeDialog: () => void;
  transactionData: Transaction;
}>();

const session = authClient.useSession();
const { $orpc } = useNuxtApp();

const mutation = useMutation({
  mutationFn: async (data: TransactionFormData) => {
    await $orpc.transaction.updateTransaction.call({
      ...data,
      id: transactionData.id,
      userId: session.value!.data!.user.id,
      date: parseDate(data.date).toDate(getLocalTimeZone()),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      amount: Number(data.amount),
    });
  },
  mutationKey: ["transactions"],
  onSuccess: async (_, __, ___, context) => {
    await context.client.invalidateQueries({ queryKey: ["transactions"] });
    closeDialog();
  },
});


const defaultValues: TransactionFormData = {
  name: transactionData.name,
  amount: transactionData.amount.toString(),
  date: transactionData.date.toISOString().split('T')[0]!,
  type: transactionData.type,
	description: transactionData.description ?? '',
	categoryId: transactionData.categoryId?.toString() ?? '',
};
</script>

<template>
  <div>
    <div v-if="!session.isPending">
      <TransactionForm
        :default-values="defaultValues"
        :action="mutation.mutateAsync"
      />
    </div>
  </div>
</template>
