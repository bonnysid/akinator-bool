enum CalendarSize {
  MEDIUM = 'medium',
  LARGE = 'large',
}

enum IntervalVariants {
  DAY = 'days',
  MONTH = 'months',
}

enum DatePickerVariant {
  DATE = 'date',
  RANGE = 'range',
}

type PeriodType = [Date | null, Date | null];

type CalendarValue = PeriodType | Date | null;

type DatePickerOnChangeFunction = (value: CalendarValue) => void;

export { IntervalVariants, CalendarSize, DatePickerVariant };
export type { PeriodType, CalendarValue, DatePickerOnChangeFunction };
