<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";

const { $orpc } = useNuxtApp();

const budget = useQuery({
  queryKey: [...queryKeys.budget],
  queryFn: async () =>
    await $orpc.budget.calculateUserBudget.call({ month: 11, year: 2025 }),
});

</script>

<template>
	<pre>{{ JSON.stringify(budget.data.value, null, 2) }}</pre>
</template>
