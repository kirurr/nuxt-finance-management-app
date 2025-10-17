<script setup lang="ts">
import { authClient } from '~/utils/auth-client';

const name = ref("");
const email = ref("");
const password = ref("");

const errorRef = ref("")
const isLoadingRef = ref<boolean>(false)

async function handleSignUp() {
	isLoadingRef.value = true
	const { data, error } = await authClient.signUp.email({
		callbackURL: '/',
		name: name.value,
		email: email.value,
		password: password.value
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
    <form @submit.prevent="handleSignUp">
      <input v-model="name" placeholder="name" />
      <input type="email" v-model="email" placeholder="email" />
      <input type="password" v-model="password" placeholder="password" />
			<button :disabled="isLoadingRef">sign up</button>
			<em>{{ errorRef }}</em>
    </form>
  </div>
</template>
