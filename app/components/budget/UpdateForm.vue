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
};
</script>

<template>
  <div>
    <BudgetForm :default-values="defaultValues" :action="handleSubmit" />
    <em
      v-if="updateMutation.isError"
      class="mt-4 text-destructive-foreground"
      aria-live="assertive"
      aria-label="Budget form error"
      >{{ updateMutation.error }}</em
    >
  </div>
</template>
