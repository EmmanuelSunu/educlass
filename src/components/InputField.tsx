import React from "react";

const InputField = ({
  type = "text", // Default to text input
  id = "",
  placeholder = "",
  className = "",
  isRequired = false,
}) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      required ={isRequired}
      className={`
        placeholder:text-slate-400 placeholder:text-sm
        p-2 text-p text-dark border-2 rounded-md w-full
        leading-5 h-10
        transition duration-150 ease-out  
        hover:border-primary hover:ease-in hover:drop-shadow-md
        outline-none focus:border-primary focus:transition-all 
        ${className}
        `}
    />
  );
};

export default InputField;
