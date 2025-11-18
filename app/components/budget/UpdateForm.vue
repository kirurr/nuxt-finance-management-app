<script setup lang="ts">
import type { UserBudget, UserBudgetFormData } from "~~/server/budget/schema";

const { closeDialog, originalData } = defineProps<{
  closeDialog: () => void;
  originalData: UserBudget;
}>();

const { updateMutation } = useBudget();

async function handleSubmit(data: UserBudgetFormData) {
  await updateMutation.mutateAsync({ id: originalData.id, data });
	closeDialog();
}

const defaultValues = {
  amount: originalData.amount.toString(),
	month: originalData.month.toString(),
	year: originalData.year.toString(),
}

</script>

<template>
  <BudgetForm :default-values="defaultValues" :action="handleSubmit" />
</template>
