<script setup lang="ts">
import { authClient } from "~/utils/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/vue-form";
import z from "zod";

const errorRef = ref("");
const isLoadingRef = ref<boolean>(false);

async function handleSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  isLoadingRef.value = true;
  const { error } = await authClient.signIn.email({
    callbackURL: "/",
    email: email,
    password: password,
  });
  isLoadingRef.value = false;
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
  onSubmit: async ({ value }) => await handleSignIn(value),
});
</script>

<template>
  <div>
    <form @submit.prevent.stop="form.handleSubmit">
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
              placeholder="email"
              type="email"
              @blur="field.handleBlur"
              @input="(e: any) => field.handleChange(e.target.value)"
            />
            <FieldError>{{
              field.state.meta.errors.map((e) => e?.message).join(", ")
            }}</FieldError>
          </Field>
        </template>
      </form.Field>
      <form.Field
        name="password"
        :validators="{
          onChange: z.string().min(8, 'Password must be at least 8 characters'),
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
              placeholder="password"
              @blur="field.handleBlur"
              @input="
                (e: { target: HTMLInputElement }) => {
                  return field.handleChange(
                    (e.target as HTMLInputElement).value,
                  );
                }
              "
            />
          </Field>
          <FieldError
            >{{ field.state.meta.errors.map((e) => e?.message).join(", ") }}
          </FieldError>
        </template>
      </form.Field>
      <Field>
        <Button :disabled="isLoadingRef">Sign in</Button>
        <FieldError>{{ errorRef }}</FieldError>
      </Field>
    </form>
  </div>
</template>
