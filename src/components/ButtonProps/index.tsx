import React from "react";

interface ButtonPropsType {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const ButtonProps: React.FC<ButtonPropsType> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon,
}) => {
  const baseStyles = "rounded-md font-medium transition-colors duration-200 flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-primary hover:bg-primary/90 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default ButtonProps; 