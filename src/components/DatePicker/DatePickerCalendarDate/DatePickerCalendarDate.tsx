import { FC, useEffect } from 'react';

import { bindStyles } from '@/utils';
import { Popup } from '@/components';

import styles from './DatePickerCalendarDate.module.scss';
import { ControlDateSelection } from '../ControlDateSelection';
import { DatesSelection } from '../DatesSelection';
import { useDatePickerContext } from '../DatePickerProvider';

const cx = bindStyles(styles);

const DatePickerCalendarDate: FC = () => {
  const { controlDate, reset, modalControls, position } = useDatePickerContext();

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
        <ControlDateSelection />
        <div className={cx('datesContainer')}>
          <DatesSelection date={controlDate} />
        </div>
      </div>
    </Popup>
  );
};

export { DatePickerCalendarDate };
