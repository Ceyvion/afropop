'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cx = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

const buttonVariants = cva(
  // Base styles - applied to all buttons
  'inline-flex items-center justify-center font-semibold uppercase tracking-[0.3em] transition-[background-color,color,border-color,transform,box-shadow,opacity] duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-v focus-visible:ring-offset-[#050506]',
  {
    variants: {
      variant: {
        primary:
          'bg-white text-black hover:bg-accent-v hover:text-white border border-transparent',
        secondary:
          'bg-elevated text-white border border-white/20 hover:border-white/40 hover:bg-white/5',
        outline:
          'border border-white/20 text-white/90 hover:border-white hover:text-white hover:bg-white/5',
        ghost:
          'text-white/90 hover:text-white hover:bg-white/5',
        accent:
          'bg-accent-v text-white hover:bg-[#ff5165] border border-transparent',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 border border-transparent',
      },
      size: {
        sm: 'px-4 py-2 text-[0.65rem] rounded-lg',
        md: 'px-6 py-2.5 text-xs rounded-xl',
        lg: 'px-8 py-3 text-sm rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      asChild = false,
      type = 'button',
      onClick,
      ...rest
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading);
    const classes = cx(buttonVariants({ variant, size, fullWidth }), className);

    const labelContent =
      asChild && React.isValidElement(children) ? children.props.children : children;

    const buttonContent = (
      <>
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {labelContent}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    };

    if (asChild) {
      if (!React.isValidElement(children)) {
        throw new Error('Button with asChild expects a valid React element child.');
      }

      const childElement = React.Children.only(children) as React.ReactElement<any>;
      const childOnClick = childElement.props.onClick as
        | ((event: React.MouseEvent<HTMLElement>) => void)
        | undefined;

      const mergedOnClick = (event: React.MouseEvent<HTMLElement>) => {
        handleClick(event);
        if (!isDisabled) {
          childOnClick?.(event);
        }
      };

      return React.cloneElement(
        childElement,
        {
          ...rest,
          className: cx(classes, childElement.props.className),
          'aria-disabled': isDisabled || undefined,
          'aria-busy': loading || undefined,
          onClick: mergedOnClick,
          ref,
        },
        buttonContent
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        type={type}
        onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
        {...rest}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
