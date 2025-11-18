<script setup lang="ts">
import type { CategoryFormData } from "~~/server/category/schema";

const { closeDialog } = defineProps<{
  closeDialog: () => void;
}>();

const { createMutation } = useCategories();

async function handleSubmit(data: CategoryFormData) {
  await createMutation.mutateAsync(data);
  closeDialog();
}
</script>

<template>
  <div>
    <CategoryForm :action="handleSubmit" />
  </div>
</template>
