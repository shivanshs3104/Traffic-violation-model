import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * A reusable Button component with multiple variants.
 * It can also be rendered as a Link from react-router-dom.
 */
const Button = forwardRef(
  (
    {
      children,
      as: Component = 'button',
      variant = 'primary',
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      // Default solid
      primary: 'bg-accent-violet text-white hover:bg-violet-500',
      // Gradient accent
      gradient:
        'bg-gradient-to-r from-accent-violet to-accent-pink text-white hover:opacity-90 shadow-lg shadow-accent-violet/30',
      // Outline
      outline:
        'border border-accent-violet/50 bg-transparent text-accent-violet hover:bg-accent-violet/10',
      // Ghost/Link
      link: 'bg-transparent text-accent-cyan hover:text-cyan-300 !p-0',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <Component
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;