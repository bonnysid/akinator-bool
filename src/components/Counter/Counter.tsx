import { FC } from 'react';
import styles from './Counter.module.scss';
import { bindStyles } from '@/utils';

export enum CounterVariants {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export enum CounterColors {
  BLUE = 'blue',
  RED ='red',
}

export enum CounterSizes {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
}

export type CounterProps = {
  count?: number;
  variant?: CounterVariants;
  color?: CounterColors;
  size?: CounterSizes;
}

const cx = bindStyles(styles);

export const Counter: FC<CounterProps> = ({ variant, size, count, color }) => {
  return (
    <div className={cx('container', size, variant, color)}>
      {count}
    </div>
  )
}
