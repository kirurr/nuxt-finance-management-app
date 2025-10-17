<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
const { $orpc } = useNuxtApp();

const { data, isPending, error, isError } = useQuery({
  queryFn: async () => {
    return await $orpc.test.call();
  },
  queryKey: ["test"],
});
</script>

<template>
  <div>
    <div v-if="data">
      <pre>{{ JSON.stringify(data) }}</pre>
    </div>
    <div v-if="isError">
      <pre>{{ error?.message }}</pre>
    </div>
  </div>
</template>
