<script setup lang="ts">
import type { TransactionWithCategory } from "~~/server/transaction/schema";

const { data } = defineProps<{
  data: TransactionWithCategory[];
}>();
</script>

<template>
  <ScrollArea class="max-h-[70lvh] lg:max-h-[700px] overflow-y-auto">
		<div v-if="data.length === 0" class="text-muted-foreground text-center" role="status" aria-label="No transactions found">No transactions</div>
    <ul class="space-y-4 pr-4" aria-label="Transaction list">
      <li
        v-for="(transaction, index) in data"
        :key="index"
      >
				<TransactionItem :data="transaction" />
      </li>
    </ul>
  </ScrollArea>
</template>
