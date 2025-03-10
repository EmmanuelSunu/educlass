
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const AnimatedButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  // Determine base styles based on variant
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-secondary text-white hover:bg-gray-600',
    outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  // Determine size styles
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg font-medium transition-all duration-200 
        ${variantStyles[variant]} ${sizeStyles[size]} 
        button-hover focus:outline-none focus:ring-2 focus:ring-primary-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
