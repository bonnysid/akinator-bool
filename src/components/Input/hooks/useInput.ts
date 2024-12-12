import { ChangeEvent, FocusEvent, KeyboardEvent, useMemo, useState } from 'react';

import { useValueMask, UseValueMaskProps } from '@/hooks';
import { isUndefinedOrNull } from '@/utils';

import { InputType } from '../types';
import {
  FormatterValueFunctionSettings,
  CleanerValueFunctionSettings,
  useFormatter,
} from './useFormatter';
import { useIncrement } from './useIncrement';
import { useHidden } from './useHidden';
import { useValueRules, ValueRules } from './useValueRules';

export type UseInputProps = UseValueMaskProps &
  CleanerValueFunctionSettings &
  FormatterValueFunctionSettings &
  ValueRules & {
    onChange: (value: string) => void;
    type?: InputType;
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    clearable?: boolean;
    trimOnBlur?: boolean;
    allowSpaces?: boolean;
    customReplacer?: (value: string) => string;
  };

const TYPE_BY_TYPE = {
  number: 'text',
};

const ALLOWED_SPACES_BY_TYPE: Record<InputType, boolean> = {
  tel: false,
  number: false,
  search: true,
  email: false,
  password: false,
  text: true,
};

export const useInput = ({
  type = 'text',
  value,
  onChange,
  maskMarkSymbol,
  mask,
  onFocus,
  onBlur,
  onKeyDown,
  clearable,
  trimOnBlur,
  allowNegative,
  decimals,
  allowSpaces,
  customReplacer,
  withThousandSeparator,
  maxLength,
}: UseInputProps) => {
  const { formattedValue: formattedValueMask, cleanNewValue } = useValueMask({
    mask,
    maskMarkSymbol,
    value,
  });
  const { formatter, cleaner } = useFormatter({ type });
  const { applyRules } = useValueRules({
    type,
    cleaner,
  });
  const { increment, decrement } = useIncrement({
    type,
    value,
    onChange,
  });
  const { isHidden, hide, reveal } = useHidden({ type });
  const [isFocused, setIsFocused] = useState(false);
  const isAllowedSpace = isUndefinedOrNull(allowSpaces)
    ? ALLOWED_SPACES_BY_TYPE[type]
    : allowSpaces;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = cleanNewValue(e.target.value);

    value = applyRules({
      value,
      maxLength,
      allowNegative,
      decimals,
    });

    if (customReplacer) {
      value = customReplacer(value);
    }

    onChange(value);
  };

  const currentType = useMemo(() => {
    if (isHidden) {
      return 'password';
    }

    if (type !== 'password') {
      return TYPE_BY_TYPE[type as keyof typeof TYPE_BY_TYPE] || type;
    }

    return 'text';
  }, [type, isHidden]);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (trimOnBlur) {
      onChange(value.trim());
    }
    onBlur?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isSpace = e.code === 'Space';

    if (isSpace && !isAllowedSpace) {
      e.preventDefault();
    }

    onKeyDown?.(e);
  };

  const onClear = () => {
    if (clearable) {
      onChange('');
    }
  };

  const formattedValue = useMemo(() => {
    return formatter({
      value: formattedValueMask,
      withThousandSeparator,
    });
  }, [formattedValueMask]);

  return {
    isHidden,
    hide,
    reveal,

    formattedValue,
    handleChange,

    increment,
    decrement,

    currentType,

    isFocused,
    handleFocus,
    handleBlur,
    handleKeyDown,
    onClear,
  };
};
