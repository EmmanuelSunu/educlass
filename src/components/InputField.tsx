// components/InputField.tsx
import React from "react";

interface InputFieldProps {
  type?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
  style?: React.CSSProperties;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  id = "",
  name = "",
  value = "",
  onChange,
  placeholder = "",
  className = "",
  isRequired = false,
  style,
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={isRequired}
      className={`
        placeholder:text-slate-400 placeholder:text-sm
        p-2 text-p text-dark border-2 rounded-md w-full
        leading-5 h-10
        transition duration-150 ease-out  
        hover:border-primary hover:ease-in hover:drop-shadow-md
        outline-none focus:border-primary focus:transition-all
        invalid:border-pink-500 invalid:text-pink-600
        focus:invalid:border-pink-500 focus:invalid:ring-pink-500 
        ${className}
      `}
      style={style}
    />
  );
};

export default InputField;
