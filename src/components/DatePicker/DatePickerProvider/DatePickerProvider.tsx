import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { PopupPosition } from 'reactjs-popup/dist/types';

import { addMonths, addYears, endOfMonth, startOfMonth, subMonths, subYears } from 'date-fns';
import { usePopupControls } from '@/hooks';

import {
  CalendarValue,
  DatePickerOnChangeFunction,
  DatePickerVariant,
  IntervalVariants,
} from '../types';
import { DatePickerContext } from './DatePickerContext';
import { DAY_RANGES } from '../FastDatesSelection';

type Props = PropsWithChildren<{
  value: CalendarValue;
  initialInterval: IntervalVariants;
  variant: DatePickerVariant;
  onChange: DatePickerOnChangeFunction;
  position?: PopupPosition | PopupPosition[];
  disabledDates?: Date[];
  maxDate?: Date;
  minDate?: Date;
  intervals?: IntervalVariants[];
}>;

const DatePickerProvider: FC<Props> = ({
  initialInterval,
  children,
  value,
  variant,
  onChange,
  position = 'bottom left',
  disabledDates,
  minDate,
  maxDate,
  intervals,
}) => {
  const modalControls = usePopupControls();
  const [controlDate, setControlDate] = useState<Date>(() => {
    if (Array.isArray(value)) {
      return value[0] || new Date();
    }

    return value || new Date();
  });
  const [interval, setInterval] = useState<IntervalVariants>(
    intervals?.[0] || initialInterval || IntervalVariants.DAY,
  );
  const [startRange, setStartRange] = useState<Date | null>(() => {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  });
  const [endRange, setEndRange] = useState<Date | null>(() => {
    if (Array.isArray(value)) {
      return value[1];
    }

    return value;
  });

  const changeInterval = (newInterval: string) => {
    if (newInterval !== interval) {
      if (startRange && endRange) {
        if (newInterval === IntervalVariants.DAY) {
          setStartRange(DAY_RANGES.week[0]);
          setEndRange(DAY_RANGES.week[1]);
        } else {
          setStartRange(startOfMonth(startRange));
          setEndRange(endOfMonth(endRange));
        }
      }

      setInterval(newInterval as IntervalVariants);
    }
  };

  const prevControlDate = () => {
    setControlDate((prev) => {
      if (interval === IntervalVariants.DAY) {
        return subMonths(prev, 1);
      } else {
        return subYears(prev, 1);
      }
    });
  };

  const nextControlDate = () => {
    setControlDate((prev) => {
      if (interval === IntervalVariants.DAY) {
        return addMonths(prev, 1);
      } else {
        return addYears(prev, 1);
      }
    });
  };

  const selectDate = (date: Date | null) => {
    setStartRange(date);
    setEndRange(date);
    onChange(date);
    modalControls.closePopup();
  };

  const reset = () => {
    if (Array.isArray(value)) {
      setStartRange(value[0]);
      setEndRange(value[1]);
      setControlDate(value[0] || new Date());
    } else {
      setStartRange(value);
      setEndRange(value);
      setControlDate(value || new Date());
    }
  };

  useEffect(() => {
    reset();
  }, [value]);

  return (
    <DatePickerContext.Provider
      value={{
        variant,
        interval,
        changeInterval,
        controlDate,
        prevControlDate,
        nextControlDate,
        selectEndRange: setEndRange,
        selectStartRange: setStartRange,
        endRange,
        selectDate,
        startRange,
        value,
        modalControls,
        onChange,
        reset,
        position,
        disabledDates,
        minDate,
        maxDate,
        intervals,
      }}
    >
      {children}
    </DatePickerContext.Provider>
  );
};

export { DatePickerProvider };
