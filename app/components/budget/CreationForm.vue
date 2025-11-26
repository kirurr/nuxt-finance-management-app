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
	<div>
		<BudgetForm :action="handleSubmit" />
    <em
      v-if="createMutation.isError"
      class="mt-4 text-destructive-foreground"
      aria-live="assertive"
      aria-label="Budget form error"
      >{{ createMutation.error }}</em
    >
	</div>
</template>
