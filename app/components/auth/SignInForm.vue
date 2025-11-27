<script setup lang="ts">
import { authClient } from "~/utils/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/vue-form";
import z from "zod";

const errorRef = ref("");

async function handleSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error } = await authClient.signIn.email({
    callbackURL: "/",
    email: email,
    password: password,
  });
  if (error) {
    errorRef.value = error.message ?? "unknown error";
    return;
  }
}

const form = useForm({
  defaultValues: {
    email: "",
    password: "",
  },
	onSubmit: async ({ value }) => {
		errorRef.value = ""
		await handleSignIn(value)
	},
});
</script>

<template>
  <form aria-label="Sign in form" @submit.prevent.stop="form.handleSubmit">
    <FieldGroup>
      <form.Field
        name="email"
        :validators="{
          onBlur: z.email('Invalid email'),
        }"
      >
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Email</FieldLabel>
            <Input
              :id="field.name"
              v-model="field.state.value"
              :name="field.name"
              placeholder="example@email.com"
              type="email"
              aria-describedby="email-error"
              @blur="field.handleBlur"
              @input="(e: any) => field.handleChange(e.target.value)"
            />
            <FieldError id="email-error">{{
              field.state.meta.errors.map((e) => e?.message).join(", ")
            }}</FieldError>
          </Field>
        </template>
      </form.Field>
      <form.Field
        name="password"
        :validators="{
          onBlur: z.string().min(8, 'Password must be at least 8 characters'),
        }"
      >
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Password</FieldLabel>
            <Input
              :id="field.name"
              v-model="field.state.value"
              type="password"
              :name="field.name"
              placeholder="********"
              aria-describedby="password-error"
              @blur="field.handleBlur"
              @input="(e: any) => field.handleChange(e.target.value)"
            />
            <FieldError id="password-error"
              >{{ field.state.meta.errors.map((e) => e?.message).join(", ") }}
            </FieldError>
          </Field>
        </template>
      </form.Field>
      <Field>
        <form.Subscribe>
          <template #default="{ canSubmit, isSubmitting }">
            <Button type="submit" :disabled="!canSubmit" aria-describedby="submit-error">
              {{ isSubmitting ? "Signing in..." : "Sign in" }}
            </Button>
          </template>
        </form.Subscribe>
        <FieldError id="submit-error">{{ errorRef }}</FieldError>
      </Field>
    </FieldGroup>
  </form>
</template>
