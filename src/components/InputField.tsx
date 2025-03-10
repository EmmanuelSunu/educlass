// components/InputField.tsx
import React from "react";

interface InputFieldProps {
  type?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
  style?: React.CSSProperties; // Add this line
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text", // Default to text input
  id = "",
  placeholder = "",
  className = "",
  isRequired = false,
  style, // Destructure the style prop
}) => {
  return (
    <input
      type={type}
      id={id}
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
      style={style} // Pass the style prop to the input element
    />
  );
};

export default InputField;
