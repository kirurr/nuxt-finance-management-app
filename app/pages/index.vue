<script setup lang="ts">
import { authClient } from '~/utils/auth-client';

definePageMeta({
  middleware: 'auth'
})

async function handleSignOut() {
	await authClient.signOut({
		fetchOptions: {
			onSuccess: async () => {
				await navigateTo('signin', { external: true })
			}
		}
	})
}
</script>
<template>
	<div>
		main
		<button @click="handleSignOut">sign out</button>
		<NuxtPage />
	</div>
</template>
