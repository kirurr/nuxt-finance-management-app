<script setup lang="ts">
import type { TransactionCategory } from "~~/server/category/schema";

const { closeDialog, categoryData } = defineProps<{
  closeDialog: () => void;
  categoryData: TransactionCategory;
}>();
const { deleteMutation } = useCategories();
const { isPending } = deleteMutation;

async function mutateAsync() {
  await deleteMutation.mutateAsync(categoryData.id);
	closeDialog();
}
</script>

<template>
  <Button variant="destructive" :disabled="isPending" @click="mutateAsync"
    >Delete category</Button
  >
</template>
