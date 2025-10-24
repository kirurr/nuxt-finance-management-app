<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { authClient } from "~/utils/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ref } from "vue";
import { z } from "zod";

const errorRef = ref("");
const isLoadingRef = ref<boolean>(false);

async function handleSignUp({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  isLoadingRef.value = true;
  const { error } = await authClient.signUp.email({
    callbackURL: "/",
    name: name,
    email: email,
    password: password,
  });
  isLoadingRef.value = false;
  if (error) {
    errorRef.value = error.message ?? "Unknown error";
    return;
  }
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
  <div>
    <form @submit.prevent.stop="form.handleSubmit">
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
              @blur="field.handleBlur"
              @input="(e: any) => field.handleChange(e.target.value)"
            />
            <FieldError>{{
              field.state.meta.errors.map((e) => e?.message).join(", ")
            }}</FieldError>
          </Field>
        </template>
      </form.Field>
      <Field>
        <Button :disabled="isLoadingRef">Sign up</Button>
        <FieldError>{{ errorRef }}</FieldError>
      </Field>
    </form>
  </div>
</template>
