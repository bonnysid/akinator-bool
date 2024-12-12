import { FC } from 'react';

import { bindStyles } from '@/utils';

import styles from './Description.module.scss';

export type DescriptionProps = {
  errorText?: string;
  isError?: boolean;
  description?: string;
};

const cx = bindStyles(styles);

export const Description: FC<DescriptionProps> = ({ errorText, description, isError }) => {
  const showError = isError && errorText;

  if (!errorText && !description) {
    return null;
  }

  return (
    <div className={cx('container')}>
      {showError && <div className={cx('error')}>{errorText}</div>}
      {description && !errorText && <div className={cx('description')}>{description}</div>}
    </div>
  );
};
