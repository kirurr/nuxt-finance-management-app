<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { useQuery } from "@tanstack/vue-query";
import { z } from "zod";
import type { CategoryFormData } from "~~/server/category/schema";
import queryKeys from "~/lib/query-keys";

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
  queryKey: [...queryKeys.icons],
  queryFn: async () => await $orpc.icon.getIcons.call(),
});

const colors = useQuery({
  queryKey: [...queryKeys.colors],
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
      <form.Field
        name="iconId"
        :validators="{
          onChange: z.string().min(1, 'Must pick an icon'),
        }"
      >
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Icon</FieldLabel>
            <Select
              :id="field.name"
              v-model="field.state.value"
              :name="field.name"
              :aria-invalid="!field.state.meta.isValid"
              @blur="field.handleBlur"
              @update:model-value="
                (val) => field.handleChange(val?.toString() ?? '')
              "
            >
              <SelectTrigger>
                <SelectValue>
									<template v-if="field.state.value">
										{{ field.state.value }}
									</template>
									<template v-else>
										Pick icon
									</template>
								</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="icon in icons.data?.value ?? []"
                  :key="icon.id"
                  :value="icon.id.toString()"
                  >{{ icon.name }}</SelectItem
                >
              </SelectContent>
            </Select>
            <FieldError>{{
              field.state.meta.errors.map((e) => e?.message).join(", ")
            }}</FieldError>
          </Field>
        </template>
      </form.Field>
      <form.Field
        name="colorId"
        :validators="{
          onChange: z.string().min(1, 'Must select a color'),
        }"
      >
        <template #default="{ field }">
          <Field>
            <FieldLabel :for="field.name">Color</FieldLabel>
            <Select
              :id="field.name"
              v-model="field.state.value"
              :name="field.name"
              :aria-invalid="!field.state.meta.isValid"
              @blur="field.handleBlur"
              @update:model-value="
                (val) => field.handleChange(val?.toString() ?? '')
              "
            >
              <SelectTrigger>
                <SelectValue>
									<template v-if="field.state.value">
										{{ field.state.value }}
									</template>
									<template v-else>
										Pick color
									</template>
								</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="color in colors.data?.value ?? []"
                  :key="color.id"
                  :value="color.id.toString()"
                  >{{ color.color }}</SelectItem
                >
              </SelectContent>
            </Select>
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
              {{ isSubmitting ? "..." : "Submit" }}
            </Button>
          </template>
        </form.Subscribe>
      </Field>
    </FieldGroup>
  </form>
</template>
