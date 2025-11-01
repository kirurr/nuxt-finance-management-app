<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import type { CategoryFormData } from "~~/server/category/schema";

const { closeDialog } = defineProps<{
  closeDialog: () => void;
}>();

const session = authClient.useSession();
const { $orpc } = useNuxtApp();

const mutation = useMutation({
  mutationFn: async (data: CategoryFormData) => {
    await $orpc.category.createCategory.call({
      ...data,
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
</script>

<template>
  <div>
    <CategoryForm :action="mutation.mutateAsync" />
  </div>
</template>
