import { FC, useMemo } from 'react';

import { bindStyles, formatDDMMYYYY } from '@/utils';
import { format } from 'date-fns';

import styles from './DatePickerFooter.module.scss';
import { useDatePickerContext } from '../DatePickerProvider/DatePickerContext';
import { DatePickerVariant, IntervalVariants } from '../types';
import { Button, ButtonSizes, ButtonVariants } from '../../Button';
import { MONTHS } from '@/constants';

const cx = bindStyles(styles);

const DatePickerFooter: FC = () => {
  const { startRange, endRange, interval, onChange, variant, modalControls, reset } =
    useDatePickerContext();

  const selectedDate = useMemo(() => {
    if (interval === IntervalVariants.DAY) {
      return `${startRange ? formatDDMMYYYY(startRange) : ''}${
        endRange ? '-' + formatDDMMYYYY(endRange) : ''
      }`;
    } else {
      return `${
        startRange ? `${MONTHS[startRange.getMonth()]}’${format(startRange, 'yy')}` : ''
      }${endRange ? `-${MONTHS[endRange.getMonth()]}’${format(endRange, 'yy')}` : ''}`;
    }
  }, [startRange, endRange, interval]);

  const handleChange = () => {
    if (variant === DatePickerVariant.DATE) {
      onChange(startRange);
    } else {
      onChange([startRange, endRange]);
    }

    modalControls.closePopup();
  };

  const handleCancel = () => {
    reset();
    modalControls.closePopup();
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('selectedDateText')}>{selectedDate}</div>
      <Button
        size={ButtonSizes.MEDIUM}
        text="Отмена"
        variant={ButtonVariants.SECONDARY}
        onClick={handleCancel}
      />
      <Button
        size={ButtonSizes.MEDIUM}
        text="Сохранить"
        onClick={handleChange}
      />
    </div>
  );
};

export { DatePickerFooter };
