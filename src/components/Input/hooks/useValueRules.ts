import { isUndefinedOrNull } from '@/utils';

import { InputType } from '../types';
import { CleanerValueFunction } from './useFormatter';

export type UseValueRulesProps = {
  type: InputType;
  cleaner?: CleanerValueFunction;
};

export type ValueRules = {
  allowNegative?: boolean;
  decimals?: number;
  maxLength?: number;
};

export type ApplyRulesFunctionProps = ValueRules & {
  value: string;
};

export type ApplyRulesFunction = (props: ApplyRulesFunctionProps) => string;

const defaultApplyRules: ApplyRulesFunction = ({ value, maxLength }) => {
  if (!isUndefinedOrNull(maxLength)) {
    return value.slice(0, maxLength);
  }

  return value;
};

const APPLIER_BY_TYPE: Partial<Record<InputType, ApplyRulesFunction>> = {
  number: ({ allowNegative, maxLength, decimals, value }) => {
    let newValue = value;

    if (!allowNegative) {
      newValue = newValue.replace('-', '');
    }

    let [val, dec] = newValue.split('.');

    if (!isUndefinedOrNull(maxLength)) {
      val = val.slice(0, maxLength);
    }

    if (decimals && newValue.includes('.')) {
      dec = dec?.slice(0, decimals) || '';
      newValue = [val, dec].join('.');
    } else {
      newValue = val;
    }

    return newValue;
  },
};

export const useValueRules = ({ cleaner, type }: UseValueRulesProps) => {
  const applyRules: ApplyRulesFunction = ({ value, ...rest }) => {
    const applier = APPLIER_BY_TYPE[type] || defaultApplyRules;

    if (cleaner) {
      value = cleaner({ value });
    }

    return applier({ value, ...rest });
  };

  return { applyRules };
};
