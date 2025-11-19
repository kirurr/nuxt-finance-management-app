<script setup lang="ts">
import { useTransactions } from '~/composables/transactions/useTransactions';

useTransactions();
useCategories();
</script>

<template>
	<HeaderComponent />
	<main class="p-4 rounded-md bg-gray-100 my-8">
		<slot />
	</main>
</template>
