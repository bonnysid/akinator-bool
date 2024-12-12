import { ComponentPropsWithRef, FC, forwardRef } from 'react';

import { IconSizes, IconTypes, Loader } from '@/components';
import { bindStyles, isUndefinedOrNull } from '@/utils';

import styles from './Button.module.scss';
import { ButtonIcon } from './ButtonIcon';

const cx = bindStyles(styles);

export enum ButtonVariants {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
  BLUR = 'blur',
  ADD_BUTTON = 'addButton',
}

export enum ButtonSizes {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
}

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  text?: string;
  count?: number;
  iconLeft?: IconTypes | JSX.Element;
  iconRight?: IconTypes | JSX.Element;
  iconOnly?: boolean;
  variant?: ButtonVariants;
  size?: ButtonSizes;
  fullWidth?: boolean;
  isLoading?: boolean;
  active?: boolean;
};

export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      disabled,
      onClick,
      className,
      fullWidth,
      type = 'button',
      text,
      variant = ButtonVariants.PRIMARY,
      iconLeft,
      iconRight,
      size = ButtonSizes.LARGE,
      isLoading,
      children,
      count,
      active,
      ...restProps
    },
    ref,
  ) => {
    const iconOnly = !text && !children && (iconRight || iconLeft);

    return (
      <button
        ref={ref}
        className={cx(className, 'container', variant, size, {
          active,
          fullWidth,
          isLoading,
          iconOnly,
        })}
        disabled={isUndefinedOrNull(disabled) ? isLoading : disabled}
        onClick={onClick}
        type={type}
        {...restProps}
      >
        {isLoading && (
          <Loader
            size={IconSizes.M}
            className={cx('loader')}
          />
        )}
        {iconLeft && <ButtonIcon icon={iconLeft} />}
        {(text || children) && <span className={cx('text')}>{text || children}</span>}
        {iconRight && <ButtonIcon icon={iconRight} />}
        {count && <span className={cx('count')}>{count}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
