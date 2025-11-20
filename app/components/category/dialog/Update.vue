<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TransactionCategory } from "~~/server/category/schema";
import { Pencil } from "lucide-vue-next";

const { categoryData, className } = defineProps<{
  categoryData: TransactionCategory;
	className?: string;
}>();

const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button :class="className" variant="ghost" size="icon"><Pencil /></Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update category</DialogTitle>
        <DialogDescription>Update a category</DialogDescription>
      </DialogHeader>

      <CategoryUpdateForm
        :category-data="categoryData"
        :close-dialog="() => (isOpen = false)"
      />
    </DialogContent>
  </Dialog>
</template>
