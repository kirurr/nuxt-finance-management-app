<script setup lang="ts">
import { handleSignOut } from "~/lib/auth";

definePageMeta({
  middleware: "auth",
});

</script>
<template>
  <div>
    <Button @click="handleSignOut">Sign out</Button>
		<Budget />
		<NotificationsList />
    <TransactionDialogCreate />
    <TransactionList />
    <NuxtPage />
  </div>
</template>
