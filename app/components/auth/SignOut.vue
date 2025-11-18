<script setup lang="ts">
import { handleSignOut } from "~/lib/auth";
</script>
<template>
	<Button variant="outline" @click="handleSignOut">Sign out</Button>
</template>
