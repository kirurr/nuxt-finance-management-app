<script setup lang="ts">
import { RadioGroupItem } from "reka-ui";
import type { CategoryWithIconAndColor } from "~~/server/category/schema";
import { colord } from "colord";
import { cn } from "@/lib/utils";

const props = defineProps<{
  category: CategoryWithIconAndColor;
  id: string;
  value: string;
}>();

const color = colord(props.category?.color?.color ?? "");
const bg = color.toRgbString();
const iconColor = color.lighten(0.5).toRgbString();
const iconBg = color.lighten(0.1).toRgbString();
</script>

<template>
  <RadioGroupItem
    as-child
    :id="id"
    :value="value"
  >
    <button
      type="button"
      :style="{
        '--bg': bg,
        '--color': bg,
        '--icon-color': iconColor,
        '--icon-bg': iconBg,
      }"
      :class="
        cn(
          'group flex w-full items-center gap-3 rounded-lg p-2 transition-all',
          'cursor-pointer outline-2 outline-offset-2 outline-transparent',
          'focus-visible:outline-(--color)',
          'data-[state=checked]:outline-(--color)',
          'hover:opacity-90',
          'item'
        )
      "
    >
      <!-- Icon -->
      <div class="relative size-12 rounded-md shrink-0">
        <span
          class="absolute inset-0 rounded-md z-10"
          :style="{
            backgroundColor: 'var(--icon-color)',
            maskImage: `url(${props.category?.icon?.path ?? ''})`,
            maskSize: '80%',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: `url(${props.category?.icon?.path ?? ''})`,
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          }"
        />
        <span
          class="absolute inset-0 rounded-md"
          :style="{ backgroundColor: 'var(--icon-bg)' }"
        />
      </div>

      <!-- Name -->
      <span class="text-lg font-semibold text-white">
        {{ props.category.name }}
      </span>

      <!-- Controls -->
      <div class="flex items-center ml-auto">
        <CategoryDialogUpdate
          class-name="text-white hover:bg-(--icon-bg) hover:text-white"
          :category-data="props.category"
        />
        <CategoryDialogDelete
          class-name="text-white hover:bg-(--icon-bg) hover:text-white"
          :category-data="props.category"
        />
      </div>
    </button>
  </RadioGroupItem>
</template>

<style scoped>
.item {
  background-color: var(--bg) !important;
}
</style>

