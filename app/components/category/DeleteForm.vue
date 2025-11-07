<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import type { TransactionCategory } from "~~/server/category/schema";
import queryKeys from "~/lib/query-keys";

const { closeDialog, categoryData } = defineProps<{
  closeDialog: () => void;
  categoryData: TransactionCategory;
}>();
const { $orpc } = useNuxtApp();

const { mutateAsync, isPending } = useMutation({
  mutationFn: async () => {
    await $orpc.category.deleteCategory.call(categoryData.id);
  },
  mutationKey: [...queryKeys.categories],
  onSuccess: async (_, __, ___, context) => {
    await context.client.invalidateQueries({ queryKey: [...queryKeys.categories] });
    closeDialog();
  },
});
</script>

<template>
  <Button variant="destructive" :disabled="isPending" @click="mutateAsync"
    >Delete category</Button
  >
</template>
