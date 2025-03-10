
import React, { useRef, ClipboardEvent, KeyboardEvent } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prevent paste
  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    alert("Pasting is not allowed for security reasons");
    return false;
  };

  // Prevent cut
  const handleCut = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    return false;
  };

  // Prevent drag and drop operations
  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Dragging content into this field is not allowed for security reasons");
    return false;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Handle key combinations for copy/paste
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent Ctrl+V (paste)
    if (e.ctrlKey && (e.key === "v" || e.key === "V")) {
      e.preventDefault();
      alert("Pasting is not allowed for security reasons");
      return false;
    }
    
    // Prevent Ctrl+C (copy) 
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      alert("Copying is not allowed for security reasons");
      return false;
    }

    // Prevent Ctrl+X (cut)
    if (e.ctrlKey && (e.key === "x" || e.key === "X")) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onPaste={handlePaste}
      onCut={handleCut}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      rows={rows}
      style={{ WebkitUserDrag: 'none' }}
    />
  );
};

export default SecureTextField;
