<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { authClient } from "~/utils/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ref } from "vue";
import { z } from "zod";

const errorRef = ref("");

async function handleSignUp({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const { error } = await authClient.signUp.email({
    callbackURL: "/",
    name: name,
    email: email,
    password: password,
  });
  if (error) {
    errorRef.value = error.message ?? "Unknown error";
    return;
  }
	navigateTo("/")
}

const form = useForm({
  defaultValues: {
    name: "",
    email: "",
    password: "",
  },
  onSubmit: async ({ value }) => await handleSignUp(value),
});
</script>

<template>
    <form aria-label="Sign up form" @submit.prevent.stop="form.handleSubmit">
		<FieldGroup>
      <form.Field
        name="name"
        :validators="{
          onBlur: z.string().min(2, 'Name must be at least 2 characters'),
        }"
      >
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Name</FieldLabel>
            <Input
              :id="field.name"
              v-model="field.state.value"
              :name="field.name"
							placeholder="John Doe"
              aria-describedby="name-error"
              @blur="field.handleBlur"
              @input="(e: any) => field.handleChange(e.target.value)"
            />
            <FieldError id="name-error">{{
              field.state.meta.errors.map((e) => e?.message).join(", ")
            }}</FieldError>
          </Field>
        </template>
      </form.Field>
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
              type="email"
							placeholder="example@email.com"
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
              :name="field.name"
              type="password"
							placeholder="********"
              aria-describedby="password-error"
              @blur="field.handleBlur"
              @input="(e: any) => field.handleChange(e.target.value)"
            />
            <FieldError id="password-error">{{
              field.state.meta.errors.map((e) => e?.message).join(", ")
            }}</FieldError>
          </Field>
        </template>
      </form.Field>
        <Field>
          <form.Subscribe>
            <template #default="{ canSubmit, isSubmitting }">
              <Button type="submit" :disabled="!canSubmit" aria-describedby="submit-error">
                {{ isSubmitting ? "Creating account..." : "Sign up" }}
              </Button>
            </template>
          </form.Subscribe>
          <FieldError id="submit-error">{{ errorRef }}</FieldError>
        </Field>
			</FieldGroup>
    </form>
</template>
