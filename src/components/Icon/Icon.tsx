import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { ICONS_DICTIONARY } from '@/assets';
import { bindStyles } from '@/utils';

import styles from './Icon.module.scss';

export type IconTypes = keyof typeof ICONS_DICTIONARY;

export enum IconSizes {
  XXXL = 'xxxl',
  XXL = 'xxl',
  XL = 'xl',
  L = 'l',
  M = 'm',
  S = 's',
  XS = 'xs',
}

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  type: IconTypes;
  isControl?: boolean;
  size?: IconSizes;
};

const cx = bindStyles(styles);

export const Icon: FC<Props> = ({ type, size = IconSizes.XL, isControl, className, ...restProps }) => {
  const Icon = ICONS_DICTIONARY[type];

  if (!Icon) {
    return null;
  }

  return (
    <div
      className={cx('icon', `icon_${size}`, { isControl }, className)}
      {...restProps}
    >
      <Icon />
    </div>
  );
};
