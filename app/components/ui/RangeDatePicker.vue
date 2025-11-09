<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "reka-ui";

interface Props {
  modelValue?: DateRange | undefined;
  label?: string;
  required?: boolean;
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  placeholder?: string;
  class?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Select date",
  required: false,
  minDate: () => new CalendarDate(1900, 1, 1),
	maxDate: () => today(getLocalTimeZone()).add({ days: 1 }),
  placeholder: "Pick a date",
});

const emit = defineEmits<{
  "update:modelValue": [value: DateRange | undefined];
}>();

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const placeholderRef = ref();
const open = ref(false);

const value = computed<DateRange | undefined>({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});

function updateRange(newRange: DateRange) {
  emit("update:modelValue", newRange);
}

const displayValue = computed(() => {
  if (!value.value) return props.placeholder;
  if (value.value.start && value.value.end) {
    return `${df.format(value.value.start.toDate(getLocalTimeZone()))} - ${df.format(value.value.end.toDate(getLocalTimeZone()))}`;
  }
  if (value.value.start)
    return df.format(value.value.start.toDate(getLocalTimeZone()));
  return props.placeholder;
});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-full ps-3 text-start font-normal',
            !value && 'text-muted-foreground',
            props.class,
          )
        "
        :disabled="disabled"
      >
        <span>{{ displayValue }}</span>
        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
        v-model:placeholder="placeholderRef"
        v-model="value"
        calendar-label="Date selection"
        initial-focus
        :min-value="minDate"
        :max-value="maxDate"
        @update:model-value="updateRange"
      />
    </PopoverContent>
  </Popover>
</template>
