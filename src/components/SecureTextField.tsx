
import React, { useRef, useEffect, ClipboardEvent, KeyboardEvent } from "react";

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
  
  // Add document-level event listeners to prevent drag and drop globally
  useEffect(() => {
    const preventDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };
    
    const preventDragOver = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };
    
    const preventDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Add listeners to document
    document.addEventListener('dragstart', preventDragStart);
    document.addEventListener('dragover', preventDragOver);
    document.addEventListener('drop', preventDrop);
    
    return () => {
      // Clean up
      document.removeEventListener('dragstart', preventDragStart);
      document.removeEventListener('dragover', preventDragOver);
      document.removeEventListener('drop', preventDrop);
    };
  }, []);

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
      onDragStart={(e) => e.preventDefault()}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      rows={rows}
      style={{ 
        WebkitUserDrag: 'none',
        MozUserDrag: 'none',
        msUserDrag: 'none',
        userDrag: 'none',
        WebkitUserSelect: 'text',
        userSelect: 'text'
      }}
    />
  );
};

export default SecureTextField;
