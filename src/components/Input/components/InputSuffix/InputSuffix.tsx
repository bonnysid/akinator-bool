import { FC } from 'react';

import { bindStyles } from '@/utils';

import { Loader } from '@/components';
import styles from './InputSuffix.module.scss';

export type InputSuffixProps = {
  suffix?: string;
  isLoading?: boolean;
};

const cx = bindStyles(styles);

export const InputSuffix: FC<InputSuffixProps> = ({ suffix, isLoading }) => {
  if (isLoading) {
    return <Loader className={cx('icon')} />;
  }

  if (suffix) {
    return <div className={cx('suffix')}>{suffix}</div>;
  }

  return null;
};
