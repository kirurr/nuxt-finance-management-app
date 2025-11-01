<script setup lang="ts">
import DatePicker from "@/components/ui/DatePicker.vue";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "@tanstack/vue-form";
import type { TransactionFormData } from "~~/server/transaction/schema";
import { z } from "zod";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useQuery } from "@tanstack/vue-query";

interface Props {
  action: (data: TransactionFormData) => Promise<void>;
  defaultValues?: TransactionFormData;
}

const {
  action,
  defaultValues = {
    name: "",
    amount: "",
    date: "",
    type: "expense",
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

const { $orpc } = useNuxtApp();

const session = authClient.useSession();

const categories = useQuery({
  queryKey: ["categories", session.value.data?.user.id],
  queryFn: async () =>
    await $orpc.category.getCategories.call(session.value.data!.user.id),
  enabled: session.value.data?.user.id !== undefined,
});
</script>

<template>
  <form @submit.prevent.stop="form.handleSubmit">
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
      <form.Field name="date">
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Date</FieldLabel>
            <DatePicker
              required
              :model-value="field.state.value"
              placeholder="Pick a date"
              :min-date="minDate"
              :max-date="maxDate"
              class="w-full"
              @update:model-value="field.handleChange($event ?? '')"
            />
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
            <FieldLabel :for="field.name">Category</FieldLabel>
            <div class="flex items-center gap-2 mb-2">
              <CategoryDialogCreate />
            </div>
            <RadioGroup
              :model-value="field.state.value"
              class="space-y-2"
              @update:model-value="(val: string) => field.handleChange(val)"
            >
              <div
                v-if="categories.isLoading.value"
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
              <div
                v-for="category in categories.data?.value"
                :key="category.id"
                class="flex items-center justify-between p-3 border rounded-md"
                :style="{ backgroundColor: category.color?.hex }"
              >
                <div class="flex items-center space-x-3">
                  <RadioGroupItem
                    :id="`category-${category.id}`"
                    :value="category.id.toString()"
                    :checked="field.state.value === category.id.toString()"
                  />
                  <FieldLabel
                    :for="`category-${category.id}`"
                    class="cursor-pointer"
                  >
                    {{ category.name }}
                    <NuxtImg
                      v-if="category.icon?.path"
                      :src="category.icon?.path"
                      width="24"
                      height="24"
                      alt="Icon"
                    />
                  </FieldLabel>
                </div>
                <div class="flex space-x-2">
                  <CategoryDialogUpdate :category-data="category" />
                  <CategoryDialogDelete :category-data="category" />
                </div>
              </div>
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
            <FieldLabel :for="field.name">Type</FieldLabel>
            <RadioGroup
              :model-value="field.state.value"
              @update:model-value="
                (val: string) => field.handleChange(val as 'expense' | 'income')
              "
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
</template>
