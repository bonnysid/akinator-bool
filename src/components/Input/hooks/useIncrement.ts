import { InputType } from '../types';

export type UseIncrementProps = {
  value: string;
  onChange: (value: string) => void;
  type: InputType;
};

const toNumber = (value: string) => {
  if (value === '-') {
    return 0;
  }

  return Number(value);
};

export const useIncrement = ({ onChange, value, type }: UseIncrementProps) => {
  const increment = () => {
    if (type === 'number') {
      let valueNum = toNumber(value);

      valueNum++;

      onChange(String(valueNum));
    }
  };

  const decrement = () => {
    if (type === 'number') {
      let valueNum = toNumber(value);

      valueNum--;

      onChange(String(valueNum));
    }
  };

  return { increment, decrement };
};
