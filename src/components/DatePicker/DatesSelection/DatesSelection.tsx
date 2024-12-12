import { FC, useMemo } from 'react';

import { bindStyles } from '@/utils';
import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
} from 'date-fns';

import styles from './DatesSelection.module.scss';
import { WeekItem } from '../WeekItem';
import { useDatePickerContext } from '../DatePickerProvider/DatePickerContext';
import { DatePickerVariant, IntervalVariants } from '../types';
import { DateItem, DateItemState } from '../DateItem';

const cx = bindStyles(styles);

type Props = {
  date: Date;
};

const DAYS_IN_WEEK = 7;

const WEEKS_NUMBERS = Array(DAYS_IN_WEEK)
  .fill(0)
  .map((_, i) => i + 1);

const DatesSelection: FC<Props> = ({ date }) => {
  const { interval, variant } = useDatePickerContext();

  const renderedDates = useMemo(() => {
    const dates =
      interval === IntervalVariants.DAY
        ? eachDayOfInterval({
            start: startOfMonth(date),
            end: endOfMonth(date),
          })
        : eachMonthOfInterval({
            start: startOfYear(date),
            end: endOfYear(date),
          });

    if (interval === IntervalVariants.DAY) {
      const startInterval = dates[0];
      const startIntervalDayWeek = startInterval.getDay() || 7;

      if (startIntervalDayWeek !== 1) {
        const prevDates = eachDayOfInterval({
          start: subDays(startInterval, startIntervalDayWeek - 1),
          end: subDays(startInterval, 1),
        });

        dates.unshift(...prevDates);
      }

      const endInterval = dates[dates.length - 1];
      const endIntervalDayWeek = endInterval.getDay();

      if (endIntervalDayWeek !== 0) {
        const nextDates = eachDayOfInterval({
          start: addDays(endInterval, 1),
          end: addDays(endInterval, DAYS_IN_WEEK - endIntervalDayWeek),
        });

        dates.push(...nextDates);
      }
    }

    return dates.map((it) => {
      const isOut = interval === IntervalVariants.DAY ? date.getMonth() !== it.getMonth() : false;
      const state = isOut ? DateItemState.HIDDEN : undefined;

      return (
        <DateItem
          key={it.toDateString()}
          date={it}
          state={variant === DatePickerVariant.DATE && isOut ? DateItemState.DISABLED : state}
        />
      );
    });
  }, [interval, variant, date]);

  const renderedWeeks = useMemo(() => {
    return WEEKS_NUMBERS.map((it) => (
      <WeekItem
        key={it}
        weekNumber={it}
      />
    ));
  }, []);

  return (
    <div className={cx('wrapper', variant)}>
      {interval === IntervalVariants.DAY && <div className={cx('weekRow')}>{renderedWeeks}</div>}
      <div className={cx('dateItems', interval)}>{renderedDates}</div>
    </div>
  );
};

export { DatesSelection };
