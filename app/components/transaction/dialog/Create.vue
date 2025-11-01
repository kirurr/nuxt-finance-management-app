<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline"> Create transaction </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create transaction</DialogTitle>
        <DialogDescription>
					Create a new transaction
        </DialogDescription>
      </DialogHeader>

      <TransactionCreationForm :close-dialog="() => isOpen = false" />
    </DialogContent>
  </Dialog>
</template>
