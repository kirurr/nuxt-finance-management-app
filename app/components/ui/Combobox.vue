<script lang="ts" setup>
import { CheckIcon, ChevronsUpDownIcon } from "lucide-vue-next";
import { ref, watch } from "vue";

interface Item {
  value: string;
  label: string;
}

const props = defineProps<{
	id?: string;
  modelValue: string;
  data: Item[];
}>();

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const internalValue = ref(props.modelValue);

const extendedData = computed(() => [
  { label: "All", value: "" },
  { label: "Without category", value: "no category" },
  ...props.data,
]);

watch(
  () => props.modelValue,
  (v) => {
    internalValue.value = v;
  },
);

watch(internalValue, (v) => {
  emit("update:modelValue", v);
});

const inputId = computed(() => props.id ?? 'items-select')
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger
			as-child>
      <Button
				:id="inputId"
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :aria-controls="'items-popover'"
        class="w-[200px] justify-between"
      >
        {{
          internalValue
            ? extendedData.find((f) => f.value === internalValue)?.label
            : "Select category..."
        }}
        <ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent id="items-popover" class="w-[200px] p-0">
      <Command>
        <CommandInput placeholder="Search category..." />
        <CommandList>
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="item in extendedData"
              :key="item.value"
              class="hover:bg-accent"
              :value="item.value"
              @select="
                () => {
                  internalValue =
                    internalValue === item.value ? '' : item.value;
                  open = false;
                }
              "
            >
              <CheckIcon
                class="mr-2 h-4 w-4"
                :class="
                  internalValue === item.value ? 'opacity-100' : 'opacity-0'
                "
              />
              {{ item.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
