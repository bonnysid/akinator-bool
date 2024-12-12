import { FC } from 'react';

import { HiddenControl } from '../HiddenControl';
import { InputIcon } from '../InputIcon';
import { InputType } from '../../types';
import { NumberControls } from '../NumberControls';

type Props = {
  withControls?: boolean;
  canBeHidden?: boolean;
  clearable?: boolean;
  isHidden?: boolean;
  disabledHideControl?: boolean;
  reveal: () => void;
  hide: () => void;
  decrement: () => void;
  increment: () => void;
  onClear?: () => void;
  value?: string;
  type: InputType;
};

export const InputControls: FC<Props> = ({
  withControls,
  type,
  canBeHidden,
  isHidden,
  disabledHideControl,
  hide,
  reveal,
  value,
  onClear,
  decrement,
  increment,
  clearable,
}) => {
  if (withControls && type === 'number') {
    return (
      <NumberControls
        decrement={decrement}
        increment={increment}
      />
    );
  }

  if (canBeHidden) {
    return (
      <HiddenControl
        isHidden={isHidden}
        disabled={disabledHideControl}
        reveal={reveal}
        hide={hide}
        isPlaceholder={!value}
      />
    );
  }

  if (onClear && value && clearable) {
    return (
      <InputIcon
        type="close"
        onClick={onClear}
      />
    );
  }

  return null;
};
