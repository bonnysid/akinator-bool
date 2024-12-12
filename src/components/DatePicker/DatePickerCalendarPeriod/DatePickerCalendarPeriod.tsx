import { FC, useEffect, useMemo } from 'react';

import { bindStyles } from '@/utils';
import { addMonths, addYears } from 'date-fns';
import { Popup } from '@/components';

import styles from './DatePickerCalendarPeriod.module.scss';
import { DatePickerFooter } from '../DatePickerFooter';
import { FastDatesSelection } from '../FastDatesSelection';
import { IntervalSelection } from '../IntervalSelection';
import { ControlDateSelection } from '../ControlDateSelection';
import { DatesSelection } from '../DatesSelection';
import { useDatePickerContext } from '../DatePickerProvider';
import { IntervalVariants } from '../types';

const cx = bindStyles(styles);

const DatePickerCalendarPeriod: FC = () => {
  const { controlDate, interval, reset, modalControls, position } = useDatePickerContext();

  const nextControlDate = useMemo(() => {
    if (interval === IntervalVariants.DAY) {
      return addMonths(controlDate, 1);
    } else {
      return addYears(controlDate, 1);
    }
  }, [controlDate]);

  useEffect(() => {
    return reset;
  }, []);

  return (
    <Popup
      position={position}
      className={cx('popup')}
      open={modalControls.isOpened}
      onClose={modalControls.closePopup}
      repositionOnResize
      closeOnDocumentClick
    >
      <div className={cx('wrapper')}>
        <div className={cx('content')}>
          <div className={cx('datesContainer')}>
            <IntervalSelection />
            <ControlDateSelection />
            <div className={cx('dateSelectionContainer', interval)}>
              <DatesSelection date={controlDate} />
              {interval === IntervalVariants.DAY && <DatesSelection date={nextControlDate} />}
            </div>
          </div>
          <FastDatesSelection />
        </div>
        <DatePickerFooter />
      </div>
    </Popup>
  );
};

export { DatePickerCalendarPeriod };
