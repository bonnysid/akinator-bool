import { FC } from 'react';

import { Icon, IconSizes, IconTypes } from '@/components';
import { bindStyles } from '@/utils';

import styles from './Button.module.scss';

type Props = {
  icon: IconTypes | JSX.Element;
};

const cx = bindStyles(styles);

export const ButtonIcon: FC<Props> = ({ icon }) => {
  if (typeof icon === 'string') {
    return (
      <Icon
        type={icon}
        className={cx('icon')}
        size={IconSizes.XL}
      />
    );
  }

  return icon;
};
