<script setup lang="ts">
import { authClient } from '~/utils/auth-client';

const email = ref("");
const password = ref("");
const errorRef = ref("")
const isLoadingRef = ref<boolean>(false)

async function handleSignIn() {
	isLoadingRef.value = true
	const { data, error } = await authClient.signIn.email({
		callbackURL: '/',
		email: email.value,
		password: password.value,
	})
	isLoadingRef.value = false
	if (error) {
		errorRef.value = error.message ?? ''
		return
	}
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSignIn">
      <input type="email" v-model="email" placeholder="email" />
      <input type="password" v-model="password" placeholder="password" />
			<button :disabled="isLoadingRef">sign in</button>
			<em>{{ errorRef }}</em>
    </form>
  </div>
</template>
