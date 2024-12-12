import { useMemo } from 'react';

export type UseValueMaskProps = {
  value: string;
  mask?: string;
  maskMarkSymbol?: string;
};

export type UseValueMaskReturn = {
  formattedValue: string;
  cleanNewValue: (value: string) => string;
};

export const MASK_MARK_SYMBOL_DEFAULT = 'X';

export const RU_PHONE_CODE = '+7';

export const VALUE_MASKS = {
  phoneRU: `${RU_PHONE_CODE} (XXX) XXX-XX-XX`,
};

export const applyMask = ({
  mask,
  maskMarkSymbol = MASK_MARK_SYMBOL_DEFAULT,
  value,
}: UseValueMaskProps): string => {
  if (!mask) {
    return value;
  }

  let formatted = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === maskMarkSymbol) {
      formatted += value[valueIndex];
      valueIndex++;
    } else {
      formatted += mask[i];
    }
  }

  return formatted;
};

export const cleanMask = ({
  mask,
  maskMarkSymbol = MASK_MARK_SYMBOL_DEFAULT,
  value,
}: UseValueMaskProps) => {
  if (!mask) {
    return value;
  }

  let cleanedValue = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === maskMarkSymbol) {
      cleanedValue += value[valueIndex];
      valueIndex++;
    } else if (value[valueIndex] === mask[i]) {
      valueIndex++;
    }
  }

  return cleanedValue;
};

export const useValueMask = ({
  value,
  mask,
  maskMarkSymbol = MASK_MARK_SYMBOL_DEFAULT,
}: UseValueMaskProps): UseValueMaskReturn => {
  const cleanNewValue = (newValue: string) => {
    if (!mask || !value) {
      return newValue;
    }

    return cleanMask({
      value: newValue,
      mask,
      maskMarkSymbol,
    });
  };

  const formattedValue = useMemo(() => {
    return applyMask({
      value,
      mask,
      maskMarkSymbol,
    });
  }, [value, mask, maskMarkSymbol]);

  return {
    formattedValue,
    cleanNewValue,
  };
};
