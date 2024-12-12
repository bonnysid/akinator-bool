import { FC } from 'react';
import { Controller, RegisterOptions, ControllerProps, useFormContext } from 'react-hook-form';

import { DatePickerPeriodProps } from './DatePickerPeriod';
import { DatePickerDate } from './DatePickerDate';

type Props = Omit<DatePickerPeriodProps, 'value' | 'onChange'> & ControllerProps & {
  name: string;
  rules?: RegisterOptions;
};

const FormDatePickerDate: FC<Props> = ({ name, rules, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <DatePickerDate
            value={field.value}
            onChange={field.onChange}
            isError={Boolean(fieldState.error)}
            {...props}
          />
        );
      }}
    />
  );
};

export { FormDatePickerDate };
