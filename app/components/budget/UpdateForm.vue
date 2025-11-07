<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import type { UserBudget, UserBudgetFormData } from "~~/server/budget/schema";
import queryKeys from "~/lib/query-keys";

const { closeDialog, originalData } = defineProps<{
  closeDialog: () => void;
  originalData: UserBudget;
}>();

const { $orpc } = useNuxtApp();

const session = authClient.useSession();

const mutation = useMutation({
  mutationFn: async (data: UserBudgetFormData) => {
    await $orpc.budget.updateUserBudget.call({
			id: originalData.id,
      userId: session.value!.data!.user.id,
      amount: Number(data.amount),
      month: Number(data.month),
      year: Number(data.year),
    });
  },
  mutationKey: [...queryKeys.budget],
  onSuccess: async (_, __, ___, context) => {
    await context.client.invalidateQueries({ queryKey: [...queryKeys.budget] });
    closeDialog();
  },
});

const defaultValues = {
  amount: originalData.amount.toString(),
	month: originalData.month.toString(),
	year: originalData.year.toString(),
}

</script>

<template>
  <BudgetForm :default-values="defaultValues" :action="mutation.mutateAsync" />
</template>
