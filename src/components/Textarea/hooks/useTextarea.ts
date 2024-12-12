import { ChangeEvent, FocusEvent, KeyboardEvent, useState } from 'react';

import { useValueMask, UseValueMaskProps } from '@/hooks';

export type UseTextareaProps = UseValueMaskProps & {
  onChange: (value: string) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  trimOnBlur?: boolean;
  allowSpaces?: boolean;
  customReplacer?: (value: string) => string;
};
export const useTextarea = ({
  value,
  onChange,
  maskMarkSymbol,
  mask,
  onFocus,
  onBlur,
  onKeyDown,
  trimOnBlur,
  allowSpaces,
  customReplacer,
}: UseTextareaProps) => {
  const { formattedValue, cleanNewValue } = useValueMask({
    mask,
    maskMarkSymbol,
    value,
  });
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let value = cleanNewValue(e.target.value);

    if (customReplacer) {
      value = customReplacer(value);
    }

    onChange(value);
  };

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (trimOnBlur) {
      onChange(value.trim());
    }
    onBlur?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isSpace = e.code === 'Space';

    if (isSpace && !allowSpaces) {
      e.preventDefault();
    }

    onKeyDown?.(e);
  };

  return {
    formattedValue,
    handleChange,

    isFocused,
    handleFocus,
    handleBlur,
    handleKeyDown,
  };
};
