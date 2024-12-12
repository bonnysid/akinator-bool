import { FC, useMemo } from 'react';

import { startOfDay, startOfMonth } from 'date-fns';
import { bindStyles, formatDDMMYYYY } from '@/utils';

import { DatePickerVariant, IntervalVariants } from '../types';
import { useDatePickerContext } from '../DatePickerProvider/DatePickerContext';
import styles from './DateItem.module.scss';
import { MONTHS } from '@/constants';

enum DateItemState {
  NORMAL = 'normal',
  SELECTED = 'selected',
  DISABLED_CROSS = 'disabledCross',
  DISABLED = 'disabled',
  RANGE_START = 'rangeStart',
  RANGE_END = 'rangeEnd',
  RANGE_DAY = 'rangeDay',
  HIDDEN = 'hidden',
}

type Props = {
  date: Date;
  state?: DateItemState;
};

const DISABLED_STATES = [
  DateItemState.DISABLED_CROSS,
  DateItemState.DISABLED,
  DateItemState.HIDDEN,
];

const cx = bindStyles(styles);

const DateItem: FC<Props> = ({ date, state }) => {
  const {
    startRange,
    endRange,
    selectStartRange,
    selectEndRange,
    selectDate,
    variant,
    interval,
    disabledDates,
    minDate,
    maxDate,
  } = useDatePickerContext();

  const currentState = useMemo(() => {
    if (state) {
      return state;
    }

    if (disabledDates) {
      const mappedDisabledDates = disabledDates.map((it) => formatDDMMYYYY(it));
      if (mappedDisabledDates.includes(formatDDMMYYYY(date))) {
        return DateItemState.DISABLED_CROSS;
      }
    }

    if (maxDate && date > maxDate) {
      return DateItemState.DISABLED;
    }

    if (minDate && date < minDate) {
      return DateItemState.DISABLED;
    }

    if (!startRange) {
      return DateItemState.NORMAL;
    }

    const formattedDate = interval === IntervalVariants.DAY ? startOfDay(date) : startOfMonth(date);

    if (variant === DatePickerVariant.DATE) {
      const calendarDate = startRange || endRange;

      if (!calendarDate) {
        return DateItemState.NORMAL;
      }

      const formattedCalendarDate =
        interval === IntervalVariants.DAY ? startOfDay(calendarDate) : startOfMonth(calendarDate);

      if (formattedDate.getTime() === formattedCalendarDate.getTime()) {
        return DateItemState.SELECTED;
      }
    } else {
      const formattedStartRange =
        interval === IntervalVariants.DAY ? startOfDay(startRange) : startOfMonth(startRange);

      if (
        endRange?.getTime() === formattedDate.getTime() &&
        formattedStartRange.getTime() === formattedDate.getTime()
      ) {
        return DateItemState.SELECTED;
      }

      if (formattedStartRange.getTime() === formattedDate.getTime()) {
        return DateItemState.RANGE_START;
      }

      if (endRange) {
        const formattedEndRange =
          interval === IntervalVariants.DAY ? startOfDay(endRange) : startOfMonth(endRange);

        if (formattedEndRange.getTime() === formattedDate.getTime()) {
          return DateItemState.RANGE_END;
        }

        if (date > startRange && date < endRange) {
          return DateItemState.RANGE_DAY;
        }
      }
    }

    return DateItemState.NORMAL;
  }, [startRange, endRange, interval, variant, state, date, disabledDates, minDate, maxDate]);

  const handleClick = () => {
    if (variant === DatePickerVariant.DATE) {
      selectDate(date);
    } else {
      if (startRange && endRange) {
        selectStartRange(date);
        selectEndRange(null);
      } else if (!startRange) {
        selectStartRange(date);
      } else if (!endRange) {
        if (date < startRange) {
          selectStartRange(date);
          selectEndRange(null);
        } else {
          selectEndRange(date);
        }
      } else {
        selectStartRange(date);
        selectEndRange(null);
      }
    }
  };

  const isToday = useMemo(() => {
    const now = startOfDay(new Date());

    return now.getTime() === startOfDay(date).getTime();
  }, [date]);

  const dateString = useMemo(() => {
    if (interval === IntervalVariants.DAY) {
      return date.getDate();
    } else {
      return MONTHS[date.getMonth() + 1];
    }
  }, [date, interval]);

  return (
    <button
      className={cx('wrapper', currentState, interval, { isToday })}
      onClick={handleClick}
      disabled={DISABLED_STATES.includes(currentState)}
      type="button"
    >
      <span>{dateString}</span>
    </button>
  );
};

export { DateItem, DateItemState };
