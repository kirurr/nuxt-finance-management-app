<script setup lang="ts">
import { Funnel, LoaderCircle } from "lucide-vue-next";
import { useTransactions } from "~/composables/transactions/useTransactions";
import type { TransactionWithCategory } from "~~/server/transaction/schema";
import { useForm } from "@tanstack/vue-form";
import * as z from "zod";

const isFiltersOpen = ref(false);

function toggleFilters() {
  isFiltersOpen.value = !isFiltersOpen.value;
}

const { transactions } = useTransactions();

const { data, isPending, error } = transactions;

const { categories } = useCategories();
const { data: categoriesData } = categories;

const transactionsData = ref<TransactionWithCategory[]>([]);
const originalTransactions = ref<TransactionWithCategory[]>([]);

watch(
  () => data.value,
  (value) => {
    originalTransactions.value = value ? [...value] : [];
    transactionsData.value = [...originalTransactions.value];
  },
  { immediate: true },
);

const form = useForm({
  defaultValues: {
    category: "",
    minAmount: "",
    maxAmount: "",
    type: "",
  },
  onSubmit: ({ value }) => {
    console.log(value);
    let filteredTransactions = [...originalTransactions.value]; // ← START FROM ORIGINAL

    if (value.minAmount) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount >= Number(value.minAmount),
      );
    }

    if (value.maxAmount) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount <= Number(value.maxAmount),
      );
    }

    if (value.category === "without category") {
      filteredTransactions = filteredTransactions.filter((t) => !t.categoryId);
    } else if (value.category !== "") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.categoryId?.toString() === value.category,
      );
    }

    if (value.type === "expense") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === "expense",
      );
    } else if (value.type === "income") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === "income",
      );
    }

    transactionsData.value = filteredTransactions;
  },
});
</script>

<template>
  <section
    id="transactions"
    class="lg:mt-12"
    aria-labelledby="transactions-title"
  >
    <Card class="p-4 rounded-md my-8">
      <div
        class="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between lg:items-center"
      >
        <div>
          <h2 id="transactions-title" class="text-3xl font-bold">
            Transactions
          </h2>
        </div>
        <div class="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4">
          <Button
            variant="outline"
            aria-label="Toggle filters"
            @click="toggleFilters"
          >
            <Funnel aria-hidden="true" /> Filters
          </Button>
          <TransactionDialogCreate />
        </div>
      </div>

      <Collapsible v-model:open="isFiltersOpen">
        <CollapsibleContent>
          <form
            class="lg:p-2"
            aria-label="Transaction filters form"
            @submit.prevent.stop="form.handleSubmit"
          >
            <FieldGroup class="grid lg:grid-cols-4 gap-4 items-center">
              <form.Field name="category">
                <template #default="{ field }">
                  <Field>
                    <CategoryCombobox
                      id="category-filter"
                      v-model="field.state.value"
                      aria-label="Category filter"
                      :name="field.name"
                      :data="
                        categoriesData?.map((c) => ({
                          value: c.id.toString(),
                          label: c.name,
                        })) ?? []
                      "
                      @update:model-value="(e: string) => field.handleChange(e)"
                      @blur="field.handleBlur"
                    />
                  </Field>
                </template>
              </form.Field>
              <form.Field name="type">
                <template #default="{ field }">
                  <Field>
                    <Select
                      id="type-filter"
                      v-model="field.state.value"
                      class="bg-background"
                      aria-label="Type filter"
                      :name="field.name"
                      @update:model-value="
                        (v) => field.handleChange(v?.toString() ?? '')
                      "
                      @blur="field.handleBlur"
                    >
                      <SelectTrigger class="">
                        <SelectValue>
                          <template v-if="field.state.value === 'expense'">
                            <span class="text-destructive font-bold"
                              >Expense</span
                            >
                          </template>
                          <template v-else-if="field.state.value === 'income'">
                            <span class="text-success font-bold">Income</span>
                          </template>
                          <template v-else>
                            <span>Select type</span>
                          </template>
                        </SelectValue>
                        <SelectContent>
                          <SelectItem :value="null">Select type</SelectItem>
                          <SelectItem value="expense">
                            <span class="text-destructive font-bold"
                              >Expense</span
                            >
                          </SelectItem>
                          <SelectItem value="income">
                            <span class="text-success font-bold">Income</span>
                          </SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </Field>
                </template>
              </form.Field>
              <FieldSet class="flex flex-row gap-2 items-center">
                <form.Field
									name="minAmount"
									:validators="{
										onChange: z.string().refine((val) => {
											const num = Number(val);
											if (num) return { message: 'Amount must be a number' };
											if (num <= 0) return { message: 'Amount must be greater than 0' };
											if (num >= Number.MAX_VALUE)
												return { message: 'Number is too large' };
										}),
									}"
								>
                  <template #default="{ field }">
                    <Field>
                      <Input
                        id="min-amount-filter"
                        v-model="field.state.value"
                        class="bg-background"
                        aria-label="Min amount filter"
                        :name="field.name"
                        type="number"
                        placeholder="Min amount"
                        @blur="field.handleBlur"
                        @input="(e: any) => field.handleChange(e.target.value)"
                      />
                    </Field>
                  </template>
                </form.Field>
                <form.Field
									name="maxAmount"
									:validators="{
										onChange: z.string().refine((val) => {
											const num = Number(val);
											if (num) return { message: 'Amount must be a number' };
											if (num <= 0) return { message: 'Amount must be greater than 0' };
											if (num >= Number.MAX_VALUE)
												return { message: 'Number is too large' };
										}),
									}"
								>
                  <template #default="{ field }">
                    <Field>
                      <Input
                        id="max-amount-filter"
                        v-model="field.state.value"
                        class="bg-background"
                        aria-label="Max amount filter"
                        :name="field.name"
                        type="number"
                        placeholder="Max amount"
                        @blur="field.handleBlur"
                        @input="(e: any) => field.handleChange(e.target.value)"
                      />
                    </Field>
                  </template>
                </form.Field>
              </FieldSet>
              <Field>
                <Button type="submit" aria-label="Apply filters">
                  Apply filters
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CollapsibleContent>
      </Collapsible>

      <template v-if="isPending">
        <LoaderCircle
          class="size-12 mx-auto lg:size-16 text-primary/60 animate-spin"
          aria-label="Loading transactions"
          role="status"
        />
      </template>
      <span v-else-if="error"
        >Error: {{ error.message ?? "Unknown error" }}</span
      >

      <TransactionList v-if="data" :data="transactionsData ?? []" />
    </Card>
  </section>
</template>
