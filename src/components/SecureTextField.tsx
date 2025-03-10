import React from "react";

interface SecureTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
  id?: string;
  name?: string;
}

const SecureTextField: React.FC<SecureTextFieldProps> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled = false,
  rows = 4,
  id,
  name,
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onPaste={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      rows={rows}
      style={{
        userSelect: "text",
        WebkitUserSelect: "text",
        MozUserSelect: "text",
      }}
    />
  );
};

export default SecureTextField;
