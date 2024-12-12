import { FC } from 'react';
import { Controller, ControllerProps, useFormContext } from 'react-hook-form';

import { Input, InputProps } from './Input';

type Props = InputProps & ControllerProps & {
  name: string;
  onChange?: (value: string) => void;
};

const FormInput: FC<Props> = ({ name, rules, isError, errorText, onChange, ...inputProps }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (value: string) => {
          if (onChange) {
            onChange(value);
          }
          field.onChange(value);
        };

        return (
          <Input
            {...field}
            isError={Boolean(fieldState.error) || isError}
            errorText={fieldState.error?.message || errorText || ''}
            onChange={handleChange}
            {...inputProps}
          />
        );
      }}
    />
  );
};

export { FormInput };
export type { Props as FormInputProps };
