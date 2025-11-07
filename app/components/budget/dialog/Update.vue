<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserBudget } from "~~/server/budget/schema";

const { data } = defineProps<{
  data: UserBudget;
}>();

const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline">Update your budget</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update your budget</DialogTitle>
        <DialogDescription>Update your budget for this month</DialogDescription>
      </DialogHeader>

      <BudgetUpdateForm
        :original-data="data"
        :close-dialog="() => (isOpen = false)"
      />
    </DialogContent>
  </Dialog>
</template>
