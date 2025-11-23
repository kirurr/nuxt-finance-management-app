<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button>Create budget</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create your budget</DialogTitle>
        <DialogDescription>Create your budget for this month</DialogDescription>
      </DialogHeader>

      <BudgetCreationForm :close-dialog="() => (isOpen = false)" />
    </DialogContent>
  </Dialog>
</template>
