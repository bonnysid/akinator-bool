import { FC } from 'react';

import { bindStyles } from '@/utils';

import styles from './ColorPulsator.module.scss';

const cx = bindStyles(styles);

const ColorPulsator: FC = () => {
  return <div className={cx('colorPulsator')} />;
};

export { ColorPulsator };
