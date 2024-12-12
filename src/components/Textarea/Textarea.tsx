import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { Caption, Description, CaptionProps, DescriptionProps } from '@/components';
import { bindStyles, isUndefinedOrNull } from '@/utils';
import { UseValueMaskProps } from '@/hooks';

import styles from './Textarea.module.scss';
import { useTextarea } from './hooks';

type TextareaAdditionalProps = CaptionProps &
  DescriptionProps &
  Omit<UseValueMaskProps, 'value'> & {
    allowSpaces?: boolean;
    trimOnBlur?: boolean;
    onChange: (value: string) => void;
    customReplacer?: (value: string) => string;
  };

export type TextareaProps = Omit<
  ComponentPropsWithoutRef<'textarea'>,
  keyof TextareaAdditionalProps
> &
  TextareaAdditionalProps;

const cx = bindStyles(styles);

export const Textarea: FC<TextareaProps> = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      onFocus,
      onBlur,
      onChange,
      caption,
      description,
      hint,
      isError,
      errorText,
      disabled,
      className,
      mask,
      maskMarkSymbol,
      onKeyDown,
      allowSpaces,
      customReplacer,
      trimOnBlur,
      ...rest
    },
    ref,
  ) => {
    const { handleBlur, handleFocus, handleKeyDown, isFocused, handleChange, formattedValue } =
      useTextarea({
        value: isUndefinedOrNull(value) ? '' : String(value),
        onFocus,
        onBlur,
        onChange,
        mask,
        maskMarkSymbol,
        onKeyDown,
        allowSpaces,
        customReplacer,
        trimOnBlur,
      });

    return (
      <label
        className={cx(className, 'body')}
        data-testid="textarea"
      >
        <Caption
          caption={caption}
          hint={hint}
        />

        <textarea
          ref={ref}
          className={cx('controller', { isError, isFocused })}
          disabled={disabled}
          value={formattedValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          {...rest}
        />

        <Description
          description={description}
          isError={isError}
          errorText={errorText}
        />
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';
