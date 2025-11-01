<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Transaction } from "~~/server/transaction/schema";

const { transactionData } = defineProps<{
  transactionData: Transaction;
}>();

const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline">Update transaction</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update transaction</DialogTitle>
        <DialogDescription>Update a transaction</DialogDescription>
      </DialogHeader>

      <TransactionUpdateForm
        :transaction-data="transactionData"
        :close-dialog="() => (isOpen = false)"
      />
    </DialogContent>
  </Dialog>
</template>
