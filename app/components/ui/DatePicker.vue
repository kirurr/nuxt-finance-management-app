<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { Calendar as CalendarIcon } from "lucide-vue-next"
import { toDate } from "reka-ui/date"
import { computed, ref } from "vue"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Props {
  modelValue?: string
  label?: string
  required?: boolean
  minDate?: CalendarDate
  maxDate?: CalendarDate
  placeholder?: string
  class?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select date',
  required: false,
  minDate: () => new CalendarDate(1900, 1, 1),
  maxDate: () => today(getLocalTimeZone()),
  placeholder: 'Pick a date'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const df = new DateFormatter("en-US", {
  dateStyle: "long",
})

const placeholderRef = ref()
const open = ref(false)

const value = computed({
  get: () => props.modelValue ? parseDate(props.modelValue) : undefined,
  set: (val) => {
    if (val) {
      emit('update:modelValue', val.toString())
    } else {
      emit('update:modelValue', undefined)
    }
    open.value = false
  }
})

const displayValue = computed(() => {
  return value.value ? df.format(toDate(value.value)) : props.placeholder
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full ps-3 text-start font-normal',
          !value && 'text-muted-foreground',
          props.class
        )"
        :disabled="disabled"
      >
        <span>{{ displayValue }}</span>
        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        v-model:placeholder="placeholderRef"
        v-model="value"
        calendar-label="Date selection"
        initial-focus
        :min-value="minDate"
        :max-value="maxDate"
      />
    </PopoverContent>
  </Popover>
</template>
