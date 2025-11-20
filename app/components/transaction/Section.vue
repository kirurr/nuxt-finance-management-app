<script setup lang="ts">
import { Funnel } from "lucide-vue-next";
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

    // Price filters
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

    // Category filters
    if (value.category === "") {
      // NO OP — means "All categories"
      // Just keep current filteredTransactions as-is
    } else if (value.category === "no category") {
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
  <section class="mt-12" labeledby="transactions">
    <Card class="p-4 rounded-md my-8">
      <div class="flex flex-row justify-between items-center">
        <div>
          <h2 id="transactions" class="text-3xl font-bold">Transactions</h2>
          <p class="text-lg text-muted-foreground">Transactions list</p>
        </div>
        <div class="flex flex-row gap-4">
          <Button variant="outline" @click="toggleFilters"
            ><Funnel /> Filters
          </Button>
          <TransactionDialogCreate />
        </div>
      </div>
      <Collapsible v-model:open="isFiltersOpen">
        <CollapsibleContent>
          <form
            class="p-2 rounded-md"
            @submit.prevent.stop="form.handleSubmit"
          >
            <FieldGroup class="grid grid-cols-3 gap-4 items-center">
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
                <Button type="submit"> Apply filters </Button>
              </Field>
            </FieldGroup>
          </form>
        </CollapsibleContent>
      </Collapsible>
      <span v-if="isPending">Loading...</span>
      <span v-else-if="error"
        >Error: {{ error.message ?? "Unknown error" }}</span
      >
      <TransactionList v-if="data" :data="transactionsData ?? []" />
    </Card>
  </section>
</template>
