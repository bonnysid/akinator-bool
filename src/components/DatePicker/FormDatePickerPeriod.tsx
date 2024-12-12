import { FC } from 'react';
import { Controller, useFormContext, ControllerProps } from 'react-hook-form';

import { DatePickerPeriod, DatePickerPeriodProps } from './DatePickerPeriod';

type Props = Omit<DatePickerPeriodProps, 'value' | 'onChange'> & ControllerProps & {
  name: string;
};

const FormDatePickerPeriod: FC<Props> = ({ name, rules, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <DatePickerPeriod
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

export { FormDatePickerPeriod };
