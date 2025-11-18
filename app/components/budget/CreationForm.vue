<script setup lang="ts">
import type { UserBudgetFormData } from "~~/server/budget/schema";

const { closeDialog } = defineProps<{
  closeDialog: () => void;
}>();

const { createMutation } = useBudget();

async function handleSubmit(data: UserBudgetFormData) {
  await createMutation.mutateAsync(data);
  closeDialog();
}
</script>

<template>
  <BudgetForm :action="handleSubmit" />
</template>
