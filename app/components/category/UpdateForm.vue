<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import type {
  TransactionCategory,
  CategoryFormData,
} from "~~/server/category/schema";

const { closeDialog, categoryData } = defineProps<{
  closeDialog: () => void;
  categoryData: TransactionCategory;
}>();

const session = authClient.useSession();
const { $orpc } = useNuxtApp();

const mutation = useMutation({
  mutationFn: async (data: CategoryFormData) => {
    await $orpc.category.updateCategory.call({
      ...data,
      id: categoryData.id,
      iconId: Number(data.iconId),
      colorId: Number(data.colorId),
      userId: session.value!.data!.user.id,
    });
  },
  mutationKey: ["categories"],
  onSuccess: async (_, __, ___, context) => {
    await context.client.invalidateQueries({ queryKey: ["categories"] });
    closeDialog();
  },
});

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
      :action="mutation.mutateAsync"
    />
  </div>
</template>