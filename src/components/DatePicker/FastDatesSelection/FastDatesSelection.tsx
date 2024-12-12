import { FC, useMemo } from 'react';

import { bindStyles } from '@/utils';
import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';

import styles from './FastDatesSelection.module.scss';
import { useDatePickerContext } from '../DatePickerProvider/DatePickerContext';
import { IntervalVariants } from '../types';
import { Button, ButtonSizes, ButtonVariants } from '../../Button';

const cx = bindStyles(styles);

const now = endOfDay(new Date());

const date = endOfDay(new Date());
date.setMonth(date.getMonth() - 1);

const DAY_RANGES = {
  week: [startOfDay(subDays(now, 6)), now],
  month: [startOfDay(subDays(now, 29)), now],
  twoMonths: [startOfDay(subDays(now, 59)), now],
  quarter: [startOfDay(subDays(now, 89)), now],
  currentMonth: [startOfDay(startOfMonth(now)), now],
  previousMonth: [startOfDay(startOfMonth(date)), endOfMonth(date)],
};

const MONTH_RANGES = {
  threeMonth: [subMonths(now, 2), now],
  sixMonth: [subMonths(now, 5), now],
  twelveMonth: [subMonths(now, 11), now],
};

type FastDateKey = keyof typeof DAY_RANGES | keyof typeof MONTH_RANGES;

const TEXT_BY_KEY: Record<FastDateKey, string> = {
  week: '7 дней',
  month: '30 дней',
  twoMonths: '60 дней',
  quarter: '90 дней',
  currentMonth: 'Текущий месяц',
  previousMonth: 'Прошлый месяц',
  threeMonth: '3 месяца',
  sixMonth: '6 месяцев',
  twelveMonth: '12 месяцев',
}

const FastDatesSelection: FC = () => {
  const { interval, selectStartRange, selectEndRange, startRange, endRange } =
    useDatePickerContext();

  const ranges = useMemo(() => {
    return interval === IntervalVariants.MONTH ? MONTH_RANGES : DAY_RANGES;
  }, [interval]);

  return (
    <div className={cx('wrapper')}>
      {Object.keys(ranges).map((key) => {
        const value: [Date, Date] = ranges[key as keyof typeof ranges];
        let isActive = false;

        if (startRange && endRange) {
          if (interval === IntervalVariants.MONTH) {
            isActive =
              startOfMonth(value[0]).getTime() === startOfMonth(startRange).getTime() &&
              endOfMonth(value[1]).getTime() === endOfMonth(endRange).getTime();
          } else {
            isActive =
              startOfDay(value[0]).getTime() === startOfDay(startRange).getTime() &&
              endOfDay(value[1]).getTime() === endOfDay(endRange).getTime();
          }
        }

        const handleClick = () => {
          selectStartRange(
            interval === IntervalVariants.DAY ? startOfDay(value[0]) : startOfMonth(value[0]),
          );
          selectEndRange(
            interval === IntervalVariants.DAY ? endOfDay(value[1]) : endOfMonth(value[1]),
          );
        };

        return (
          <Button
            key={key}
            text={TEXT_BY_KEY[key as FastDateKey]}
            size={ButtonSizes.MEDIUM}
            variant={isActive ? ButtonVariants.PRIMARY : ButtonVariants.TERTIARY}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export { FastDatesSelection, MONTH_RANGES, DAY_RANGES };
