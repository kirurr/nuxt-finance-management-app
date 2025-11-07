<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import type { UserBudgetFormData } from "~~/server/budget/schema";
import queryKeys from "~/lib/query-keys";

const { closeDialog } = defineProps<{
  closeDialog: () => void;
}>();

const { $orpc } = useNuxtApp();

const session = authClient.useSession();

const mutation = useMutation({
  mutationFn: async (data: UserBudgetFormData) => {
    await $orpc.budget.createUserBudget.call({
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
</script>

<template>
  <BudgetForm :action="mutation.mutateAsync" />
</template>
