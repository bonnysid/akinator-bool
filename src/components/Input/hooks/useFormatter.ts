import { convertThousands } from '@/utils';

import { InputType } from '../types';

export type CleanerValueFunctionSettings = {
  value: string;
};

export type FormatterValueFunctionSettings = {
  value: string;
  withThousandSeparator?: boolean;
};

export type CleanerValueFunction = (settings: CleanerValueFunctionSettings) => string;
export type FormatterValueFunction = (settings: FormatterValueFunctionSettings) => string;

export type UseFormatterProps = {
  type: InputType;
};

export type UseFormatterReturn = {
  formatter: FormatterValueFunction;
  cleaner: CleanerValueFunction;
};

const defaultCleaner: CleanerValueFunction = ({ value }) => {
  return value;
};

const defaultFormatter: FormatterValueFunction = ({ value }) => {
  return value;
};

const FORMATTER_BY_TYPE: Partial<Record<InputType, UseFormatterReturn>> = {
  tel: {
    cleaner: ({ value }) => {
      const regex = /\D/g;
      return value.replace(regex, '');
    },
    formatter: defaultFormatter,
  },
  number: {
    cleaner: ({ value }) => {
      const regex = /(?!^-)[^0-9.]|(?<=\..*)\.|(?<!\d)\./g;

      return value.replace(regex, '');
    },
    formatter: ({ value, withThousandSeparator = true }) => {
      let newValue = value;

      if (withThousandSeparator) {
        newValue = convertThousands(newValue);
      }

      return newValue;
    },
  },
};

export const useFormatter = ({ type }: UseFormatterProps): UseFormatterReturn => {
  return (
    FORMATTER_BY_TYPE[type] || {
      cleaner: defaultCleaner,
      formatter: defaultFormatter,
    }
  );
};
