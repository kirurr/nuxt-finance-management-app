<script setup lang="ts">
import { useTransactions } from "~/composables/transactions/useTransactions";

useTransactions();
useCategories();
</script>

<template>
    <HeaderComponent />
    <main class="rounded-md mt-8 mb-4">
      <slot />
    </main>
</template>
