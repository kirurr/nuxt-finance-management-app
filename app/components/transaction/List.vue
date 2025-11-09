<script setup lang="ts">
import { useInfiniteQuery } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";

const { $orpc } = useNuxtApp();

const dateStore = useDateStore();

const {
  data,
  isPending,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
	queryKey: computed(() => [
		...queryKeys.transactions,
		dateStore.startDateStr,
		dateStore.endDateStr,
	]),
  initialPageParam: 0,
  queryFn: async ({ pageParam }) =>
    await $orpc.transaction.getTransactionsByUserId.call({
      cursor: pageParam,
			startDate: dateStore.startDate.toDate(),
			endDate: dateStore.endDate?.toDate() ?? dateStore.startDate.toDate(),
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
        <li
          v-for="transaction in transactions.items"
          :key="transaction.id"
          :style="{ backgroundColor: transaction.category?.color?.hex }"
        >
          <pre>{{ JSON.stringify(transaction, null, "\t") }}</pre>
          <div>
            <NuxtImg
							v-if="transaction.category?.icon?.path"
              :src="transaction.category?.icon?.path"
              width="24"
              height="24"
              alt="Icon"
            />
          </div>
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
