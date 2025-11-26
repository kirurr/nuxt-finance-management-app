<script setup lang="ts">
import { useTransactions } from "~/composables/transactions/useTransactions";

useTransactions();
useCategories();
useBudget();
</script>

<template>
    <HeaderComponent />
    <main class="rounded-md mt-8 mb-4 lg:px-2">
      <slot />
    </main>
</template>
