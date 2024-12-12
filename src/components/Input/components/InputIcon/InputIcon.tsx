import { FC } from 'react';

import { bindStyles } from '@/utils';

import { Icon, IconSizes, IconTypes } from '../../../Icon';
import styles from './InputIcon.module.scss';

type Props = {
  type: IconTypes;
  onClick?: () => void;
  disabled?: boolean;
  isPlaceholder?: boolean;
};

const cx = bindStyles(styles);

export const InputIcon: FC<Props> = ({ onClick, type, disabled, isPlaceholder }) => {
  return (
    <Icon
      className={cx('icon', { clickable: Boolean(onClick), disabled, isPlaceholder })}
      type={type}
      size={IconSizes.XL}
      onClick={disabled ? undefined : onClick}
    />
  );
};
