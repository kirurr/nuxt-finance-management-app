<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { useQuery } from "@tanstack/vue-query";
import { z } from "zod";
import type { CategoryFormData } from "~~/server/category/schema";
import queryKeys from "~/lib/query-keys";
import { colord } from "colord";

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
            <FieldLabel :for="`category-field-${field.name}`">Name</FieldLabel>
            <Input
              :id="`category-field-${field.name}`"
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
      <div class="flex flex-row gap-2">
        <form.Field
          name="iconId"
          :validators="{
            onChange: z.string().min(1, 'Must pick an icon'),
          }"
        >
          <template #default="{ field }">
            <Field>
              <FieldLabel :for="`category-field-${field.name}`"
                >Icon</FieldLabel
              >
              <Select
                v-model="field.state.value"
                :aria-label="`category-field-${field.name}`"
                :name="field.name"
                :aria-invalid="!field.state.meta.isValid"
                @blur="field.handleBlur"
                @update:model-value="
                  (val) => field.handleChange(val?.toString() ?? '')
                "
              >
                <SelectTrigger :id="`category-field-${field.name}`">
                  <SelectValue>
                    <template v-if="field.state.value">
                      <NuxtImg
                        class="w-8 h-8 rounded-md"
                        :src="
                          icons.data.value?.find(
                            (i) => i.id.toString() === field.state.value,
                          )?.path
                        "
                        :alt="`Icon ${
                          icons.data.value?.find(
                            (i) => i.id.toString() === field.state.value,
                          )?.name
                        }`"
                      />
                    </template>
                    <template v-else> Pick icon </template>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="icon in icons.data?.value ?? []"
                    :key="icon.id"
                    :value="icon.id.toString()"
                    >
                      <NuxtImg
                        class="w-8 h-8 rounded-md"
                        :src="icon.path"
                        :alt="`Icon ${icon.name}`"
                      />
									</SelectItem
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
              <FieldLabel :for="`category-field-${field.name}`"
                >Color</FieldLabel
              >
              <Select
                v-model="field.state.value"
                :aria-label="`category-field-${field.name}`"
                :name="field.name"
                :aria-invalid="!field.state.meta.isValid"
                @blur="field.handleBlur"
                @update:model-value="
                  (val) => field.handleChange(val?.toString() ?? '')
                "
              >
                <SelectTrigger :id="`category-field-${field.name}`">
                  <SelectValue class="block w-full">
                    <template v-if="field.state.value">
                      <div
                        :style="{
                          backgroundColor: colord(
                            colors?.data?.value?.find(
                              (c) => c.id.toString() === field.state.value,
                            )?.color ?? '',
                          ).toRgbString(),
                        }"
                        class="w-full h-6 rounded-md"
                      />
                    </template>
                    <template v-else> Pick color </template>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="color in colors.data?.value ?? []"
                    :key="color.id"
                    :value="color.id.toString()"
                    class="block"
                  >
                    <div
                      :style="{
                        backgroundColor: colord(color.color).toRgbString(),
                      }"
                      class="w-full h-6 rounded-md"
                    />
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{{
                field.state.meta.errors.map((e) => e?.message).join(", ")
              }}</FieldError>
            </Field>
          </template>
        </form.Field>
      </div>
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
