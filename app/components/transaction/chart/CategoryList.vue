<script setup lang="ts">
import { colord } from "colord";
import type { TransactionWithCategory } from "~~/server/transaction/schema";

const { categories } = defineProps<{
  categories: {
    name: string;
    color: string;
    total: number;
    category: TransactionWithCategory["category"] | undefined;
  }[];
}>();
</script>

<template>
  <ul class="space-y-4">
    <li
      v-for="item in categories"
      :key="item.name"
      class="relative overflow-hidden rounded-md font-semibold flex justify-between gap-2 items-center pr-2"
      :style="{
        backgroundColor: colord(item.color).alpha(0.1).toRgbString(),
        color: colord(item.color).darken(0.25).toRgbString(),
      }"
    >
      <span
        class="p-1 rounded-md size-8 relative z-10"
        :style="{
          backgroundColor: colord(item.color).darken(0.25).toRgbString(),
          maskImage: `url(${item.category?.icon?.path ?? ''})`,
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${item.category?.icon?.path ?? ''})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }"
      />
      <span
        class="size-8 rounded-md absolute"
        :style="{
          backgroundColor: colord(item.color).alpha(0.5).toRgbString(),
        }"
      />
      <span class="mr-auto">{{ item.name }}</span>
      <span>{{ item.total }}</span>
    </li>
  </ul>
</template>
