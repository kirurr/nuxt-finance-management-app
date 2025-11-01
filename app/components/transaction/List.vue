<script setup lang="ts">
import { useInfiniteQuery } from "@tanstack/vue-query";

const { $orpc } = useNuxtApp();

const {
  data,
  isPending,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["transactions"],
  initialPageParam: 0,
  queryFn: async ({ pageParam }) =>
    await $orpc.transaction.getTransactionsByUserId.call({
      cursor: pageParam,
    }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
</script>

<template>
  <div>
    <span v-if="isPending">Loading...</span>
    <span v-else-if="error">Error: {{ error.message ?? "Unknown error" }}</span>
    <div v-else-if="data">
      <ul v-for="(transactions, index) in data.pages" :key="index">
        <li v-for="transaction in transactions.items" :key="transaction.id">
          <pre>{{ JSON.stringify(transaction, null, "\t") }}</pre>
					<TransactionDialogUpdate :transaction-data="transaction" />
					<TransactionDialogDelete :transaction-data="transaction" />
        </li>
      </ul>
    </div>
    <Button
      :disabled="!hasNextPage || isFetchingNextPage"
      @click="() => fetchNextPage()"
    >
      <span v-if="isFetchingNextPage">Loading more...</span>
      <span v-else-if="hasNextPage">Load More</span>
      <span v-else>Nothing more to load</span>
    </Button>
  </div>
</template>
