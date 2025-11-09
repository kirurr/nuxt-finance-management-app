<script setup lang="ts">
import { handleSignOut } from "~/lib/auth";

definePageMeta({
  middleware: "auth",
});

</script>
<template>
  <div>
		<div class="flex flex-row gap-4">
			<Button @click="handleSignOut">Sign out</Button>
			<DateSelect />
		</div>
		<Budget />
		<NotificationsList />
    <TransactionDialogCreate />
    <TransactionList />
    <NuxtPage />
  </div>
</template>
