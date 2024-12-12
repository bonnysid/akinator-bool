import { PopupPosition } from 'reactjs-popup/dist/types';
import { FC } from 'react';

import { TooltipPositions } from '@/components';
import { bindStyles } from '@/utils';

import {
  CalendarSize,
  DatePickerOnChangeFunction,
  DatePickerVariant,
  IntervalVariants,
  PeriodType,
} from './types';
import { DatePickerProvider } from './DatePickerProvider';
import { DatePickerButton } from './DatePickerButton';
import { DatePickerCalendarPeriod } from './DatePickerCalendarPeriod';
import styles from './DatePicker.module.scss';

type DatePickerPeriodProps = {
  value: [Date | null, Date | null];
  onChange: (date: PeriodType) => void;
  initialInterval?: IntervalVariants;
  size?: CalendarSize;
  onClear?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  caption?: string;
  disabledDates?: Date[];
  position?: PopupPosition | PopupPosition[];
  maxDate?: Date;
  minDate?: Date;
  hint?: string;
  tooltipClass?: string;
  tooltipTextClass?: string;
  tooltipPosition?: TooltipPositions;
  disabled?: boolean;
  intervals?: IntervalVariants[];
};

const cx = bindStyles(styles);

const DatePickerPeriod: FC<DatePickerPeriodProps> = ({
  initialInterval = IntervalVariants.DAY,
  caption,
  isError,
  onChange,
  size,
  value,
  onClear,
  isLoading,
  position,
  disabledDates,
  minDate,
  maxDate,
  hint,
  tooltipClass,
  tooltipTextClass,
  disabled,
  tooltipPosition = 'right',
  intervals,
}) => {
  return (
    <DatePickerProvider
      value={value}
      initialInterval={initialInterval}
      intervals={intervals}
      variant={DatePickerVariant.RANGE}
      onChange={onChange as DatePickerOnChangeFunction}
      position={position}
      disabledDates={disabledDates}
      minDate={minDate}
      maxDate={maxDate}
    >
      <div className={cx('wrapper')}>
        <DatePickerButton
          onClear={onClear}
          isLoading={isLoading}
          isDisabled={disabled}
          isError={isError}
          caption={caption}
          size={size}
          hint={hint}
          tooltipClass={tooltipClass}
          tooltipTextClass={tooltipTextClass}
          tooltipPosition={tooltipPosition}
        />
        <DatePickerCalendarPeriod />
      </div>
    </DatePickerProvider>
  );
};

export { DatePickerPeriod };
export type { DatePickerPeriodProps };
