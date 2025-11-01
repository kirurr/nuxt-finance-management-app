<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { useQuery } from "@tanstack/vue-query";
import { z } from "zod";
import type { CategoryFormData } from "~~/server/category/schema";

interface Props {
  action: (data: CategoryFormData) => Promise<void>;
  defaultValues?: CategoryFormData;
}

const {
  action,
  defaultValues = {
    colorId: "",
    iconId: "",
    name: "",
  },
} = defineProps<Props>();

const form = useForm({
  defaultValues: defaultValues,
  onSubmit: async ({ value }) => {
		try {
			await action(value);
		} catch (error) {
			console.error(error);
		}
  },
});

const { $orpc } = useNuxtApp();

const icons = useQuery({
  queryKey: ["icons"],
  queryFn: async () => await $orpc.icon.getIcons.call(),
});

const colors = useQuery({
  queryKey: ["colors"],
  queryFn: async () => await $orpc.color.getColors.call(),
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
      <form.Field name="iconId">
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Icon</FieldLabel>
            <RadioGroup
							v-for="icon in icons.data?.value ?? []"
							:key="icon.id"
              :model-value="field.state.value"
              @update:model-value="(val: string) => field.handleChange(val)"
						>
              <div class="flex items-center space-x-2">
                <RadioGroupItem
                  :id="icon.id.toString()"
                  :value="icon.id.toString()"
                />
                <FieldLabel :for="icon.id.toString()">{{
                  icon.name
                }}</FieldLabel>
              </div>
            </RadioGroup>
          </Field>
        </template>
      </form.Field>
      <form.Field name="colorId">
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Color</FieldLabel>
            <RadioGroup
              v-for="color in colors.data?.value ?? []"
              :key="color.id"
              :model-value="field.state.value"
              @update:model-value="(val: string) => field.handleChange(val)"
            >
              <div class="flex items-center space-x-2">
                <RadioGroupItem
                  :id="color.id.toString()"
                  :value="color.id.toString()"
                />
                <FieldLabel :for="color.id.toString()">{{
                  color.hex
                }}</FieldLabel>
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
