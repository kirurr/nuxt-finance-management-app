<script setup lang="ts">
import { Funnel } from "lucide-vue-next";
import { useTransactions } from "~/composables/transactions/useTransactions";
import Combobox from "~/components/ui/Combobox.vue";

const isFiltersOpen = ref(false);

function toggleFilters() {
  isFiltersOpen.value = !isFiltersOpen.value;
}

const { transactions } = useTransactions();

const { data, isPending, error } = transactions;

const { categories } = useCategories();
const { data: categoriesData } = categories;

const selectedCategory = ref<string>("");

const transactionsData = computed(() => {
  if (!selectedCategory.value) {
    return data.value ?? [];
  }
  if (selectedCategory.value === "no category") {
    return data.value?.filter((t) => !t.categoryId) ?? [];
  }
  if (selectedCategory.value) {
    return (
      data.value?.filter(
        (t) => t.categoryId?.toString() === selectedCategory.value,
      ) ?? []
    );
  }
  return [];
});

//TODO: handle colors, handle without category items
</script>

<template>
  <section labeledby="transactions">
    <Card class="p-4 rounded-md bg-gray-200 my-8">
      <div class="mb-4 flex flex-row justify-between items-center">
        <div>
          <h2 id="transactions" class="text-3xl font-bold">Transactions</h2>
          <p class="text-lg text-muted-foreground">Transactions list</p>
        </div>
        <div>
          <Button class="mr-4" variant="outline" @click="toggleFilters"
            ><Funnel /> Filters
          </Button>
          <TransactionDialogCreate />
        </div>
      </div>
      <Collapsible v-model:open="isFiltersOpen">
        <CollapsibleContent>
          <Field>
            <FieldLabel for="category-filter">Category</FieldLabel>
            <Combobox
              id="category-filter"
              v-model="selectedCategory"
              :data="
                categoriesData?.map((c) => ({
                  value: c.id.toString(),
                  label: c.name,
                })) ?? []
              "
            />
          </Field>
        </CollapsibleContent>
      </Collapsible>
      <span v-if="isPending">Loading...</span>
      <span v-else-if="error"
        >Error: {{ error.message ?? "Unknown error" }}</span
      >
      <TransactionList v-if="data" :data="transactionsData" />
    </Card>
  </section>
</template>
