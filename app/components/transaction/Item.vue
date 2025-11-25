<script setup lang="ts">
import type { TransactionWithCategory } from "~~/server/transaction/schema";
import { colord } from "colord";

const { data } = defineProps<{
  data: TransactionWithCategory;
}>();

const isHaveCategory = computed(() => data.category);
</script>

<template>
  <Card class="flex flex-row px-4 py-2 lg:p-2 items-center" role="listitem" aria-label="Transaction item">
    <div class="hidden lg:flex relative items-center rounded-md size-12" aria-hidden="true">
      <span
        v-if="isHaveCategory"
        class="size-full rounded-md relative z-10"
        :style="{
          backgroundColor: colord(data.category?.color?.color ?? '')
            .darken(0.25)
            .toRgbString(),
          maskImage: `url(${data.category?.icon?.path ?? ''})`,
          maskSize: '70%',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${data.category?.icon?.path ?? ''})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }"
        :aria-label="`Category icon for ${data.category?.name}`"
      />
      <span
        v-if="isHaveCategory"
        class="size-full rounded-md absolute"
        :style="{
          backgroundColor: colord(data.category?.color?.color ?? '')
            .alpha(0.3)
            .toRgbString(),
        }"
      />
    </div>
    <div>
      <div class="flex items-center gap-2">
        <h3 class="text-xl font-semibold">{{ data.name }}</h3>
				<div class="hidden lg:block">
					<Badge
						v-if="data.type === 'expense'"
						class="bg-destructive/10 text-destructive"
						role="status"
						aria-label="Expense transaction"
						>Expense</Badge
					>
					<Badge
						v-if="data.type === 'income'"
						class="bg-success/10 text-success-foreground"
						role="status"
						aria-label="Income transaction"
						>Income</Badge
					>
				</div>
      </div>
      <p v-if="data.description" class="text-muted-foreground" :aria-label="`Description: ${data.description}`">
        {{ data.description }}
      </p>
      <div class="mt-2 flex gap-4 text-muted-foreground">
        <div v-if="data.category" class="flex items-center gap-2" :aria-label="`Category: ${data.category.name}`">
          <div
            class="rounded-full size-2"
            :style="{
              backgroundColor: colord(
                data.category.color?.color ?? '',
              ).toRgbString(),
            }"
            :aria-label="`Category color for ${data.category.name}`"
          />
          <span>{{ data.category.name }}</span>
        </div>
        <span :aria-label="`Date: ${data.date.toLocaleDateString()}`">{{ data.date.toLocaleDateString() }}</span>
      </div>
    </div>
    <div class="text-xl font-bold ml-auto flex items-center" :aria-label="`${data.type === 'expense' ? 'Expense' : 'Income'} amount: ${data.type === 'expense' ? '-' : '+'}${data.amount}`">
      <span v-if="data.type === 'expense'" class="text-destructive"
        >-{{ data.amount }}</span
      >
      <span v-if="data.type === 'income'" class="text-success"
        >+{{ data.amount }}</span
      >
    </div>
    <div class="flex flex-col lg:flex-row items-center gap-2" role="group" aria-label="Transaction actions">
      <TransactionDialogUpdate :transaction-data="data" />
      <TransactionDialogDelete :transaction-data="data" />
    </div>
  </Card>
</template>
