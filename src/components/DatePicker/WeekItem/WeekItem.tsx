import { FC } from 'react';

import styles from './WeekItem.module.scss';
import { bindStyles } from '@/utils';
import { WEEK_DAYS } from '@/constants';

type Props = {
  weekNumber: number;
};

const cx = bindStyles(styles);

const WeekItem: FC<Props> = ({ weekNumber }) => {
  return <div className={cx('wrapper')}>{WEEK_DAYS[weekNumber]}</div>;
};

export { WeekItem };
