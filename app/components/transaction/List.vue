<script setup lang="ts">
import type { TransactionWithCategory } from "~~/server/transaction/schema";

const { data } = defineProps<{
  data: TransactionWithCategory[];
}>();
</script>

<template>
  <ScrollArea class="max-h-[700px] overflow-y-auto">
    <ul  class="space-y-4 pr-4">
      <li
        v-for="(transaction, index) in data"
        :key="index"
      >
				<TransactionItem :data="transaction" />
      </li>
    </ul>
  </ScrollArea>
</template>
