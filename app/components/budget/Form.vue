<script setup lang="ts">
import { getLocalTimeZone, today } from "@internationalized/date";
import { useForm } from "@tanstack/vue-form";
import type { UserBudgetFormData } from "~~/server/budget/schema";
import * as z from "zod";

interface Props {
  action: (data: UserBudgetFormData) => Promise<void>;
  defaultValues?: UserBudgetFormData;
}

const {
  action,
  defaultValues = {
    amount: "",
    month: today(getLocalTimeZone()).month.toString(),
    year: today(getLocalTimeZone()).year.toString(),
  },
} = defineProps<Props>();

const form = useForm({
  defaultValues: defaultValues,
  onSubmit: async ({ value }) => {
    await action(value);
  },
});
</script>

<template>
  <form @submit.prevent.stop="form.handleSubmit">
    <FieldGroup>
      <form.Field
        name="amount"
        :validators="{
          onChange: z.string().refine((val) => {
            const num = Number(val);
            if (num) return { message: 'Amount must be a number' };
            if (num <= 0) return { message: 'Amount must be greater than 0' };
            if (num >= Number.MAX_VALUE)
              return { message: 'Amount must be less than 999999999999' };
          }),
        }"
      >
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Amount</FieldLabel>
            <Input
              :id="field.name"
              v-model="field.state.value"
              required
              :name="field.name"
              placeholder="1000"
              type="number"
              :aria-invalid="!field.state.meta.isValid"
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
        <form.Subscribe>
          <template #default="{ canSubmit, isSubmitting }">
            <Button type="submit" :disabled="!canSubmit">
              {{ isSubmitting ? "Submitting..." : "Submit" }}
            </Button>
          </template>
        </form.Subscribe>
      </Field>
    </FieldGroup>
  </form>
</template>
