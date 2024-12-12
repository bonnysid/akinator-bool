import { Controller, useFormContext, ControllerProps } from 'react-hook-form';
import { FC } from 'react';


import { Textarea, TextareaProps } from './Textarea';

type Props = TextareaProps & ControllerProps & {
  name: string;
};

const FormTextarea: FC<Props> = ({ name, rules, onChange, ...inputProps }) => {
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
          <Textarea
            {...field}
            isError={Boolean(fieldState.error)}
            errorText={fieldState.error?.message || ''}
            onChange={handleChange}
            {...inputProps}
          />
        );
      }}
    />
  );
};

export { FormTextarea };
