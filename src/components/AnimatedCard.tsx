
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  animation?: 'fadeIn' | 'slideInUp' | 'slideInLeft' | 'slideInRight';
  delay?: number;
}

const AnimatedCard: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  animation = 'fadeIn',
  delay = 0,
}) => {
  const animationClass = `animate-${animation}`;
  
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md p-4 
        ${hoverEffect ? 'card-hover' : ''}
        ${animationClass}
        ${className}
      `}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
