import { ComponentPropsWithRef, FC, forwardRef } from 'react';

import { bindStyles, isUndefinedOrNull } from '@/utils';
import { UseValueMaskProps } from '@/hooks';
import { Caption, Description, CaptionProps, DescriptionProps } from '@/components';

import styles from './Input.module.scss';
import { IconTypes } from '../Icon';
import { InputControls, InputIcon, InputSuffix, InputSuffixProps } from './components';
import { useInput, UseInputProps } from './hooks';
import { InputType } from '@/components/Input/types.ts';

type HTMLInputProps = ComponentPropsWithRef<'input'>;

export enum InputSizes {
  LARGE = 'large',
  MEDIUM = 'medium',
}

type OwnProps = Partial<Omit<UseValueMaskProps, 'initialValue'>> &
  CaptionProps &
  DescriptionProps &
  UseInputProps &
  InputSuffixProps & {
    value?: string;
    onChange: (value: string) => void;
    type?: InputType;
    size?: InputSizes;
    withControls?: boolean;
    canBeHidden?: boolean;
    icon?: IconTypes;
  };

export type InputProps = Omit<HTMLInputProps, keyof OwnProps> & OwnProps;

const cx = bindStyles(styles);

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      size = InputSizes.LARGE,
      type = 'text',
      placeholder,
      caption,
      description,
      isError,
      errorText,
      disabled,
      isLoading,
      className,
      prefix,
      suffix,
      hint,
      children,
      mask,
      maskMarkSymbol,
      onChange,
      withControls,
      canBeHidden,
      max,
      min,
      icon,
      onFocus,
      onKeyDown,
      onBlur,
      clearable,
      trimOnBlur = true,
      allowNegative = false,
      allowSpaces,
      decimals,
      customReplacer,
      maxLength,
      withThousandSeparator,
      ...rest
    },
    ref,
  ) => {
    const {
      hide,
      formattedValue,
      isHidden,
      reveal,
      handleChange,
      decrement,
      increment,
      currentType,
      isFocused,
      handleBlur,
      handleFocus,
      handleKeyDown,
      onClear,
    } = useInput({
      type,
      onChange,
      value: isUndefinedOrNull(value) ? '' : String(value),
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
      maxLength,
      withThousandSeparator,
    });

    return (
      <label className={cx(className, 'wrapper')}>
        <Caption
          caption={caption}
          hint={hint}
        />
        <div className={cx('controller', size, { isError, isFocused, disabled, withControls })}>
          {icon && <InputIcon type={icon} />}
          <input
            ref={ref}
            className={cx('field')}
            type={currentType}
            value={formattedValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            {...rest}
          />

          <InputSuffix
            suffix={suffix}
            isLoading={isLoading}
          />
          <InputControls
            reveal={reveal}
            hide={hide}
            decrement={decrement}
            increment={increment}
            type={type}
            value={value}
            disabledHideControl={disabled}
            onClear={onClear}
            clearable={clearable}
            isHidden={isHidden}
            withControls={withControls}
            canBeHidden={canBeHidden}
          />
        </div>
        <Description
          isError={isError}
          errorText={errorText}
          description={description}
        />
      </label>
    );
  },
);

Input.displayName = 'Input';
