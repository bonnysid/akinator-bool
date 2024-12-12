import { FC } from 'react';

import { bindStyles } from '@/utils';
import { Icon, IconTypes, IconSizes } from '@/components';

import styles from './Loader.module.scss';

type Props = {
  size?: IconSizes;
  type?: Extract<IconTypes, 'spinner' | 'spinner-progress' | 'spinner-filled'>;
  className?: string;
};

const cx = bindStyles(styles);

const Loader: FC<Props> = ({ size, className, type = 'spinner-filled' }) => {
  return (
    <Icon
      data-testid="loader"
      type={type}
      size={size}
      className={cx(className, 'loader')}
    />
  );
};

export { Loader };
