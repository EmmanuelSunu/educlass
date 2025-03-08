
import React from 'react';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridLayoutProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  gap?: number;
}

const GridLayout: React.FC<GridLayoutProps> = ({ 
  children, 
  className = '',
  cols = { xs: 1, md: 3 },
  gap = 6
}) => {
  const getColsClasses = () => {
    const classes = [];
    
    if (cols.xs) classes.push(`grid-cols-${cols.xs}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    return classes.join(' ');
  };
  
  return (
    <div className={`grid ${getColsClasses()} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default GridLayout;
