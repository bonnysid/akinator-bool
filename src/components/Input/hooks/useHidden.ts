import { useState } from 'react';

import { InputType } from '../types';

export type UseHiddenProps = {
  type: InputType;
};

export const useHidden = ({ type }: UseHiddenProps) => {
  const [isHidden, setIsHidden] = useState(type === 'password');

  const hide = () => {
    setIsHidden(true);
  };

  const reveal = () => {
    setIsHidden(false);
  };

  return { isHidden, hide, reveal };
};
