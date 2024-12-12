import React from 'react';
import ReactPopup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';

import { useBodyOverflow } from '@/hooks';
import { InputStub } from './InputStub';

import styles from './Popup.module.scss';
import { bindStyles } from '@/utils';

export enum PopupSizes {
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
}

type Props = PopupProps & {
  size?: PopupSizes;
  classNamePrefix?: string;
  lockBodyScroll?: boolean;
};

const cx = bindStyles(styles);

const Popup: React.FC<Props> = ({
  children,
  className,
  on = 'click',
  position = 'bottom right',
  size = PopupSizes.S,
  arrow = false,
  trigger,
  classNamePrefix,
  open,
  lockBodyScroll = true,
  ...rest
}) => {
  useBodyOverflow(Boolean(open), lockBodyScroll);

  return (
    <ReactPopup
      trigger={trigger}
      on={on}
      position={position}
      arrow={arrow}
      className={classNamePrefix}
      open={open}
      {...rest}
    >
      <InputStub />
      <div className={cx('popup', [size], className)}>{children}</div>
    </ReactPopup>
  );
};
export { Popup };
