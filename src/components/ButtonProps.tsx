// ButtonProps.tsx

import React from 'react';

// Define button variants
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

// Define button sizes
type ButtonSize = 'small' | 'regular' | 'medium' | 'large' | 'extra-large';

// ButtonProps interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

// Style configuration objects
const ButtonStyles = {
  base: 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-out',
  
  variants: {
    primary: 'bg-primary text-white hover:bg-accent focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  } as const,
  
  sizes: {
    small: 'px-2.5 py-1.5 text-xs',
    regular: 'px-4 py-2 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-base font-semibold',
    'extra-large': 'px-8 py-4 text-xl'
  } as const
};

export const ButtonProps: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'regular',
  children,
  className = '',
  ...props
}) => {
  const buttonClasses = `
    ${ButtonStyles.base}
    ${ButtonStyles.variants[variant]}
    ${ButtonStyles.sizes[size]}
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonProps;