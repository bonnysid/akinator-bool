import { FC, useMemo } from 'react';

import { bindStyles } from '@/utils';

import styles from './IntervalSelection.module.scss';
import { useDatePickerContext } from '../DatePickerProvider/DatePickerContext';
import { IntervalVariants } from '../types';
import { TabList } from '@/components/TabList';

const cx = bindStyles(styles);

const INTERVAL_TEXTS = {
  [IntervalVariants.DAY]: 'День',
  [IntervalVariants.MONTH]: 'Месяц',
}

const IntervalSelection: FC = () => {
  const { interval, changeInterval, intervals } = useDatePickerContext();

  const tabs = useMemo(() => {
    return intervals?.map(it => ({
      text: INTERVAL_TEXTS[it],
      value: it,
    })) || []
  }, [intervals]);

  return (
    <div className={cx('wrapper')}>
      <TabList tabs={tabs} value={interval} onChange={changeInterval} />
    </div>
  );
};

export { IntervalSelection };
