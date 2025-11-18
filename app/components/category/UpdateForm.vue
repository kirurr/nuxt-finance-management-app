<script setup lang="ts">
import type {
  TransactionCategory,
  CategoryFormData,
} from "~~/server/category/schema";

const { closeDialog, categoryData } = defineProps<{
  closeDialog: () => void;
  categoryData: TransactionCategory;
}>();

const { updateMutation } = useCategories();

async function handleSubmit(data: CategoryFormData) {
  await updateMutation.mutateAsync({ id: categoryData.id, data });
	closeDialog();
}

const defaultValues: CategoryFormData = {
  name: categoryData.name,
  iconId: categoryData.iconId.toString(),
  colorId: categoryData.colorId.toString(),
};
</script>

<template>
  <div>
    <CategoryForm
      :default-values="defaultValues"
      :action="handleSubmit"
    />
  </div>
</template>
