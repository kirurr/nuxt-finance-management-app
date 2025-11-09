import type { DateValue, ZonedDateTime } from "@internationalized/date";
import {
  fromDate,
  getLocalTimeZone,
  now,
  startOfMonth,
} from "@internationalized/date";
import { defineStore } from "pinia";
import type { DateRange } from "reka-ui";

export const useDateStore = defineStore("date", () => {
  const startDateStr = ref(
    startOfMonth(now(getLocalTimeZone())).toAbsoluteString(),
  );
  const endDateStr = ref<string | undefined>(
    now(getLocalTimeZone()).toAbsoluteString(),
  );

  const startDate = computed<ZonedDateTime>(() => {
    return fromDate(new Date(startDateStr.value), getLocalTimeZone());
  });

  const endDate = computed<ZonedDateTime | undefined>(() => {
    return endDateStr.value
      ? fromDate(new Date(endDateStr.value), getLocalTimeZone())
      : undefined;
  });

  const range = computed<DateRange>({
    get: () => ({
      start: startDate.value as DateValue,
      end: endDate.value as DateValue | undefined,
    }),
    set: (newRange: DateRange) => {
      startDateStr.value = newRange.start
        ? newRange.start.toDate(getLocalTimeZone()).toISOString()
        : now(getLocalTimeZone()).toDate().toISOString();
      endDateStr.value = newRange.end
        ? newRange.end.toDate(getLocalTimeZone()).toISOString()
        : undefined;
    },
  });

  function setDate(start: Date, end?: Date) {
    startDateStr.value = start.toISOString();
    endDateStr.value = end?.toISOString();
  }

  return {
    startDateStr,
    endDateStr,
    startDate,
    endDate,
    range,
    setDate,
  };
});
