<script setup lang="ts">
import type { TransactionWithCategory } from "~~/server/transaction/schema";
import { colord } from "colord";

const { data } = defineProps<{
  data: TransactionWithCategory;
}>();

const isHaveCategory = computed(() => data.category);
</script>

<template>
  <Card class="shadow-none flex flex-row p-2 bg bg-gray-100 items-center">
    <div class="relative flex items-center rounded-md size-12">
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
        <Badge
          v-if="data.type === 'expense'"
          class="bg-destructive/10 text-destructive"
          >Expense</Badge
        >
        <Badge v-if="data.type === 'income'" class="bg-success/10 text-success"
          >Income</Badge
        >
      </div>
        <p v-if="data.description" class="text-muted-foreground">
          {{ data.description }}
        </p>
      <div class="mt-2 flex gap-4 text-muted-foreground" >
				<div v-if="data.category" class="flex items-center gap-2">
					<div
						class="rounded-full size-2"
						:style="{
							backgroundColor: colord(data.category.color?.color ?? '').toRgbString(),
						}"
					/>
					<span>{{ data.category.name }}</span>
				</div>
				<span>{{ data.date.toLocaleDateString() }}</span>
      </div>
    </div>
		<div class="text-xl font-bold ml-auto flex items-center">
			<span v-if="data.type === 'expense'" class="text-destructive">-{{ data.amount }}</span>
			<span v-if="data.type === 'income'" class="text-success">+{{ data.amount }}</span>
		</div>
    <div class="flex flex-row items-center gap-2">
      <TransactionDialogUpdate :transaction-data="data" />
      <TransactionDialogDelete :transaction-data="data" />
    </div>
  </Card>
</template>
