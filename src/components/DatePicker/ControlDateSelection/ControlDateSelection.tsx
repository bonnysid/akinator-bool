import { FC, useMemo } from 'react';

import { bindStyles } from '@/utils';

import styles from './ControlDateSelection.module.scss';
import { useDatePickerContext } from '../DatePickerProvider/DatePickerContext';
import { DatePickerVariant, IntervalVariants } from '../types';
import { Icon } from '../../Icon';
import { MONTHS } from '@/constants';

const cx = bindStyles(styles);

const ControlDateSelection: FC = () => {
  const { controlDate, nextControlDate, prevControlDate, interval, variant } =
    useDatePickerContext();

  const leftControlText = useMemo(() => {
    if (interval === IntervalVariants.DAY && variant !== DatePickerVariant.DATE) {
      return MONTHS[controlDate.getMonth()];
    }
  }, [controlDate, variant, interval]);

  const rightControlText = useMemo(() => {
    if (interval === IntervalVariants.DAY && variant !== DatePickerVariant.DATE) {
      return MONTHS[(controlDate.getMonth() + 2) % 13 || 1];
    }
  }, [controlDate, variant, interval]);

  const centerText = useMemo(() => {
    if (variant === DatePickerVariant.DATE) {
      return interval === IntervalVariants.DAY
        ? `${MONTHS[controlDate.getMonth()]} ${controlDate.getFullYear()}`
        : controlDate.getFullYear();
    } else {
      return controlDate.getFullYear();
    }
  }, [controlDate, variant, interval]);

  return (
    <div className={cx('wrapper', variant)}>
      <div className={cx('control', variant)}>
        <Icon
          type="chevron-left"
          className={cx('controlIcon')}
          onClick={prevControlDate}
        />
        {leftControlText && <div className={cx('controlText')}>{leftControlText}</div>}
      </div>
      <div className={cx('centerValue')}>{centerText}</div>
      <div className={cx('control', variant)}>
        {rightControlText && <div className={cx('controlText')}>{rightControlText}</div>}
        <Icon
          type="chevron-left"
          className={cx('controlIcon', 'nextIcon')}
          onClick={nextControlDate}
        />
      </div>
    </div>
  );
};

export { ControlDateSelection };
