import { FC, MouseEvent, useMemo } from 'react';

import { bindStyles, formatDDMMYYYY } from '@/utils';
import { IconSizes, Loader, Tooltip, TooltipPositions } from '@/components';
import { format } from 'date-fns';

import styles from './DatePickerButton.module.scss';
import { CalendarSize, DatePickerVariant, IntervalVariants } from '../types';
import { useDatePickerContext } from '../DatePickerProvider';
import { Icon } from '../../Icon';
import { MONTHS } from '@/constants';

type Props = {
  size?: CalendarSize;
  onClear?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  caption?: string;
  hint?: string;
  tooltipClass?: string;
  tooltipTextClass?: string;
  tooltipPosition?: TooltipPositions;
};

const cx = bindStyles(styles);

const DatePickerButton: FC<Props> = ({
  size = CalendarSize.LARGE,
  caption,
  isError,
  onClear,
  isLoading,
  isDisabled,
  hint,
  tooltipClass,
  tooltipTextClass,
  tooltipPosition,
}) => {
  const { modalControls, interval, value, variant } = useDatePickerContext();

  const stringValue = useMemo(() => {
    if (Array.isArray(value)) {
      const start = value[0];
      const end = value[1] || value[0];

      if (start && end) {
        return interval === IntervalVariants.DAY
          ? `${formatDDMMYYYY(start)}-${formatDDMMYYYY(end)}`
          : `${MONTHS[start.getMonth()]}’${format(start, 'yy')}-${MONTHS[end.getMonth()]}’${format(end, 'yy')}`;
      }
    } else if (value) {
      return interval === IntervalVariants.DAY
        ? formatDDMMYYYY(value)
        : `${MONTHS[value.getMonth()]}’${format(value, 'yy')}`;
    }
  }, [value, interval]);

  const placeholder = useMemo(() => {
    if (variant === DatePickerVariant.RANGE) {
      return interval === IntervalVariants.DAY
        ? `дд.мм.гггг-дд.мм.ггг`
        : `мм'гггг-мм'гггг`;
    } else {
      return interval === IntervalVariants.DAY
        ? 'дд.мм.гггг'
        : `мм'гггг`;
    }
  }, [interval, value]);

  const handleClear = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClear?.();
  };

  return (
    <div className={cx('wrapper')}>
      {caption && (
        <div className={cx('caption')}>
          <div className={cx('captionText')}>{caption}</div>
          {hint && (
            <Tooltip
              text={hint}
              place={tooltipPosition}
              classes={{
                tooltip: tooltipClass,
                tooltipTextItem: tooltipTextClass,
              }}
            >
              <Icon
                type="question-mark-circle"
                size={IconSizes.M}
                className={cx('icon', 'hint')}
              />
            </Tooltip>
          )}
        </div>
      )}
      <button
        className={cx('buttonWrapper', variant, size, { isError })}
        onClick={modalControls.togglePopup}
        disabled={isDisabled}
        type="button"
      >
        <div className={cx('valueContainer')}>
          <Icon
            type="calendarLight"
            className={cx('icon')}
          />
          {stringValue && <div className={cx('value')}>{stringValue}</div>}
          {!stringValue && <div className={cx('placeholder')}>{placeholder}</div>}
        </div>

        <div className={cx('controls')}>
          {onClear && stringValue && (
            <Icon
              type="close"
              className={cx('icon')}
              onClick={handleClear}
            />
          )}
          {isLoading && <Loader className={cx('icon')} />}
        </div>
      </button>
    </div>
  );
};

export { DatePickerButton, CalendarSize };
