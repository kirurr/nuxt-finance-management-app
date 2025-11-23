import type {
  CalendarDate,
  DateValue,
  ZonedDateTime,
} from "@internationalized/date";
import {
  fromDate,
  getLocalTimeZone,
  now,
  startOfMonth,
  parseDate,
} from "@internationalized/date";
import { defineStore } from "pinia";
import type { DateRange } from "reka-ui";

// Store only "YYYY-MM-DD" local-date strings
function formatDateOnly(d: DateValue | ZonedDateTime): string {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

export const useDateStore = defineStore("date", () => {
  const tz = getLocalTimeZone();

  // Initial values
  const startDateStr = ref(formatDateOnly(startOfMonth(now(tz))));

  const endDateStr = ref<string | undefined>(formatDateOnly(now(tz)));

  // Convert stored YYYY-MM-DD → ZonedDateTime
  const startDate = computed<CalendarDate>(() => {
    return parseDate(startDateStr.value);
  });

  const endDate = computed<CalendarDate | undefined>(() => {
    return endDateStr.value ? parseDate(endDateStr.value) : undefined;
  });

  // Reka-UI <DateRange>
  const range = computed<DateRange>({
    get: () => ({
      start: parseDate(startDateStr.value),
      end: endDateStr.value ? parseDate(endDateStr.value) : undefined,
    }),
    set: (newRange: DateRange) => {
      startDateStr.value = newRange.start
        ? formatDateOnly(newRange.start)
        : formatDateOnly(now(tz));

      endDateStr.value = newRange.end
        ? formatDateOnly(newRange.end)
        : undefined;
    },
  });

  // Manual setter using JS Date → convert to ZonedDateTime → store date parts only
  function setDate(start: Date, end?: Date) {
    const s = fromDate(start, tz);
    const e = end ? fromDate(end, tz) : undefined;

    startDateStr.value = formatDateOnly(s);
    endDateStr.value = e ? formatDateOnly(e) : undefined;
  }

  return {
    startDateStr,
    endDateStr,
    startDate, // ZonedDateTime
    endDate, // ZonedDateTime | undefined
    range,
    setDate,
  };
});
