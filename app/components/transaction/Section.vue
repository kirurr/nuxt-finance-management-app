<script setup lang="ts">
import { Funnel, LoaderCircle } from "lucide-vue-next";
import { useTransactions } from "~/composables/transactions/useTransactions";
import type { TransactionWithCategory } from "~~/server/transaction/schema";
import { useForm } from "@tanstack/vue-form";
import CategoryCombobox from "~/components/ui/CategoryCombobox.vue";

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
    minPrice: "",
    maxPrice: "",
  },
  onSubmit: ({ value }) => {
    let filteredTransactions = [...originalTransactions.value]; // ← START FROM ORIGINAL

    if (value.minPrice) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount >= Number(value.minPrice),
      );
    }

    if (value.maxPrice) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount <= Number(value.maxPrice),
      );
    }

    if (value.category === "no category") {
      filteredTransactions = filteredTransactions.filter((t) => !t.categoryId);
    } else {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.categoryId?.toString() === value.category,
      );
    }

    transactionsData.value = filteredTransactions;
  },
});
</script>

<template>
  <section id="transactions" class="lg:mt-12" aria-labelledby="transactions-title">
    <Card class="p-4 rounded-md my-8">
      <div
        class="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between lg:items-center"
      >
        <div>
          <h2 id="transactions-title" class="text-3xl font-bold">Transactions</h2>
        </div>
        <div class="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4">
          <Button variant="outline" aria-label="Toggle filters" @click="toggleFilters">
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
            <FieldGroup class="grid lg:grid-cols-3 gap-4 items-center">
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
              <FieldSet class="flex flex-row gap-2 items-center">
                <form.Field name="minPrice">
                  <template #default="{ field }">
                    <Field>
                      <Input
                        id="min-price-filter"
                        v-model="field.state.value"
                        class="bg-background"
                        aria-label="Min price filter"
                        :name="field.name"
                        type="number"
                        placeholder="Min price"
                        @blur="field.handleBlur"
                        @input="(e: any) => field.handleChange(e.target.value)"
                      />
                    </Field>
                  </template>
                </form.Field>
                <form.Field name="maxPrice">
                  <template #default="{ field }">
                    <Field>
                      <Input
                        id="max-price-filter"
                        v-model="field.state.value"
                        class="bg-background"
                        aria-label="Max price filter"
                        :name="field.name"
                        type="number"
                        placeholder="Max price"
                        @blur="field.handleBlur"
                        @input="(e: any) => field.handleChange(e.target.value)"
                      />
                    </Field>
                  </template>
                </form.Field>
              </FieldSet>
              <Field>
                <Button type="submit" aria-label="Apply filters"> Apply filters </Button>
              </Field>
            </FieldGroup>
          </form>
        </CollapsibleContent>
      </Collapsible>

			<template v-if="isPending">
				<LoaderCircle
          class="size-16 mx-auto lg:size-32 text-primary/60 animate-spin"
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
