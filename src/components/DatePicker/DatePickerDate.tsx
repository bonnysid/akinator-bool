import { PopupPosition } from 'reactjs-popup/dist/types';
import { FC } from 'react';

import { bindStyles } from '@/utils';
import { TooltipPositions } from '@/components';

import {
  CalendarSize,
  DatePickerOnChangeFunction,
  DatePickerVariant,
  IntervalVariants,
} from './types';
import { DatePickerProvider } from './DatePickerProvider';
import { DatePickerButton } from './DatePickerButton';
import { DatePickerCalendarDate } from './DatePickerCalendarDate/DatePickerCalendarDate';
import styles from './DatePicker.module.scss';

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  initialInterval?: IntervalVariants;
  size?: CalendarSize;
  onClear?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  caption?: string;
  position?: PopupPosition | PopupPosition[];
  maxDate?: Date;
  minDate?: Date;
  disabledDates?: Date[];
  hint?: string;
  tooltipClass?: string;
  tooltipTextClass?: string;
  tooltipPosition?: TooltipPositions;
};

const cx = bindStyles(styles);

const DatePickerDate: FC<Props> = ({
  initialInterval = IntervalVariants.DAY,
  caption,
  isError,
  onChange,
  size,
  value,
  isDisabled,
  onClear,
  isLoading,
  position,
  disabledDates,
  maxDate,
  minDate,
  hint,
  tooltipClass,
  tooltipTextClass,
  tooltipPosition = 'right',
}) => {
  return (
    <DatePickerProvider
      value={value}
      initialInterval={initialInterval}
      variant={DatePickerVariant.DATE}
      onChange={onChange as DatePickerOnChangeFunction}
      position={position}
      disabledDates={disabledDates}
      maxDate={maxDate}
      minDate={minDate}
    >
      <div className={cx('wrapper')}>
        <DatePickerButton
          onClear={onClear}
          isLoading={isLoading}
          isDisabled={isDisabled}
          isError={isError}
          caption={caption}
          size={size}
          hint={hint}
          tooltipClass={tooltipClass}
          tooltipTextClass={tooltipTextClass}
          tooltipPosition={tooltipPosition}
        />
        <DatePickerCalendarDate />
      </div>
    </DatePickerProvider>
  );
};

export { DatePickerDate };
