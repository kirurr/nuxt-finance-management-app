<script lang="ts" setup>
import { colord } from "colord";
import type { CategoryWithIconAndColor } from "~~/server/category/schema";
import { CheckIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const { item } = defineProps<{
  item: {
    value: string;
    label: string;
  };
  isSelected: boolean;
  category: CategoryWithIconAndColor | undefined;
}>();
</script>

<template>
  <CommandItem
    :class="
      cn(
        'my-2 relative overflow-hidden rounded-md font-semibold flex justify-between gap-2 items-center pr-2 custom-item',
        !category && 'hover:bg-accent!',
      )
    "
    :value="item.value"
    :style="
      category !== undefined && {
        '--hover-bg': colord(category?.color?.color ?? '')
          .alpha(0.2)
          .toRgbString(),
        '--hover-color': colord(category?.color?.color ?? '')
          .darken(0.35)
          .toRgbString(),
        backgroundColor: colord(category?.color?.color ?? '')
          .alpha(0.1)
          .toRgbString(),
        color: colord(category?.color?.color ?? '')
          .darken(0.25)
          .toRgbString(),
      }
    "
  >
    <span
      v-if="category !== undefined"
      class="p-1 rounded-md size-8 relative z-10"
      :style="{
        backgroundColor: colord(category?.color?.color ?? '')
          .darken(0.25)
          .toRgbString(),
        maskImage: `url(${category?.icon?.path ?? ''})`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${category?.icon?.path ?? ''})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }"
    />
    <span
      v-if="category !== undefined"
      class="size-8 rounded-md absolute"
      :style="{
        backgroundColor: colord(category?.color?.color ?? '')
          .alpha(0.5)
          .toRgbString(),
      }"
    />
    <span class="mr-auto">{{ item.label }}</span>
    <CheckIcon
      class="mr-2 h-4 w-4"
      :class="isSelected ? 'opacity-100' : 'opacity-0'"
    />
  </CommandItem>
</template>

<style scoped>
.custom-item:hover {
  background-color: var(--hover-bg) !important;
  color: var(--hover-color) !important;
}
</style>
