<script setup lang="ts">
import DatePicker from "@/components/ui/DatePicker.vue";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "@tanstack/vue-form";
import type { TransactionFormData } from "~~/server/transaction/schema";
import { z } from "zod";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import CategoryRadioGroupItem from "@/components/category/RadioGroupItem.vue";

interface Props {
  action: (data: TransactionFormData) => Promise<void>;
  defaultValues?: TransactionFormData;
}

const {
  action,
  defaultValues = {
    name: "",
    amount: "",
    date: today(getLocalTimeZone()).toString(),
    type: "expense",
    categoryId: "",
  },
} = defineProps<Props>();

const form = useForm({
  defaultValues: defaultValues,
  onSubmit: async ({ value }) => {
    await action(value);
  },
});

const minDate = new CalendarDate(1900, 1, 1);
const maxDate = today(getLocalTimeZone());

const { categories } = useCategories();
</script>

<template>
  <ScrollArea class="max-h-[80lvh]">
    <form class="px-4" @submit.prevent.stop="form.handleSubmit">
      <FieldGroup>
        <form.Field
          name="name"
          :validators="{
            onChange: z.string().min(1, 'Name must be at least 1 character'),
          }"
        >
          <template #default="{ field }">
            <Field>
              <FieldLabel :for="field.name">Name</FieldLabel>
              <Input
                :id="field.name"
                v-model="field.state.value"
                autocomplete="category"
                required
                :name="field.name"
                placeholder="Groceries"
                type="text"
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
        <form.Field
          name="amount"
          :validators="{
            onChange: z
              .string()
              .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
                message: 'Amount must be a numeric string of at least 1',
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
                placeholder="3000"
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
        <form.Field
          name="date"
          :validators="{
            onChange: z.string(),
          }"
        >
          <template #default="{ field }">
            <Field>
              <FieldLabel :for="field.name">Date</FieldLabel>
              <DatePicker
                :id="field.name"
                required
                :model-value="field.state.value"
                placeholder="Pick a date"
                :min-date="minDate"
                :max-date="maxDate"
                class="w-full"
                @update:model-value="field.handleChange($event ?? '')"
              />
              <FieldError>{{
                field.state.meta.errors.map((e) => e?.message).join(", ")
              }}</FieldError>
            </Field>
          </template>
        </form.Field>
        <form.Field
          name="description"
          :validators="{
            onChange: z
              .string()
              .max(250, 'Description must be at most 250 characters')
              .optional(),
          }"
        >
          <template #default="{ field }">
            <Field>
              <FieldLabel :for="field.name">Description</FieldLabel>
              <Textarea
                :id="field.name"
                v-model="field.state.value"
                :name="field.name"
                placeholder="Groceries"
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
        <form.Field
          name="categoryId"
          :validators="{
            onChange: z.string().optional(),
          }"
        >
          <template #default="{ field }">
            <Field>
              <div
                class="flex flex-row justify-between items-center gap-2 mb-2"
              >
                <FieldLabel :id="field.state.value ?? ''" as-child><span>Category</span></FieldLabel>
                <CategoryDialogCreate />
              </div>
              <RadioGroup
                :model-value="field.state.value ?? ''"
                :aria-labelledby="`label-${field.name}`"
                class="space-y-2"
                @update:model-value="(val) => field.handleChange(val)"
              >
                <div
                  v-if="categories.isPending.value"
                  class="px-2 py-1.5 text-sm text-muted-foreground"
                >
                  Loading categories...
                </div>
                <div
                  v-if="categories.isError.value"
                  class="px-2 py-1.5 text-sm text-destructive"
                >
                  Failed to load categories
                </div>
                <CategoryRadioGroupItem
                  v-for="category in categories.data?.value"
                  :id="`category-${category.id.toString()}`"
                  :key="category.id"
                  :category="category"
                  :value="category.id.toString()"
                />
                <div
                  v-if="categories.data?.value?.length === 0"
                  class="px-2 py-1.5 text-sm text-muted-foreground"
                >
                  No categories available
                </div>
              </RadioGroup>
              <FieldError>{{
                field.state.meta.errors.map((e) => e?.message).join(", ")
              }}</FieldError>
            </Field>
          </template>
        </form.Field>
        <form.Field name="type">
          <template #default="{ field }">
            <Field>
              <RadioGroup
                :aria-labelledby="`label-${field.name}`"
                :model-value="field.state.value"
                @update:model-value="
                  (val: string) =>
                    field.handleChange(val as 'expense' | 'income')
                "
              >
                <FieldLabel :id="`label-${field.name}`" as-child
                  ><span>Type</span></FieldLabel
                >
                <div class="flex flex-col items-start gap-4 space-x-4">
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="expense" value="expense" />
                    <FieldLabel for="expense">Expense</FieldLabel>
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="income" value="income" />
                    <FieldLabel for="income">Income</FieldLabel>
                  </div>
                </div>
              </RadioGroup>
            </Field>
          </template>
        </form.Field>
        <Field>
          <form.Subscribe>
            <template #default="{ canSubmit, isSubmitting }">
              <Button type="submit" :disabled="!canSubmit">
                {{ isSubmitting ? "..." : "Submit" }}
              </Button>
            </template>
          </form.Subscribe>
        </Field>
      </FieldGroup>
    </form>
  </ScrollArea>
</template>
