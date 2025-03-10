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

  // Add comprehensive event listeners to prevent drag and drop globally
  useEffect(() => {
    // More aggressive approach to prevent drag events
    const preventDragEvents = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Handle focus to disable clipboard operations
    const handleFocus = () => {
      if (textareaRef.current) {
        // Force disable browser's native drag behavior
        textareaRef.current.setAttribute("ondragstart", "return false;");
        textareaRef.current.setAttribute("ondrop", "return false;");
      }
    };

    // Prevent browser default behavior for these events
    document.addEventListener("dragstart", preventDragEvents, true);
    document.addEventListener("dragenter", preventDragEvents, true);
    document.addEventListener("dragover", preventDragEvents, true);
    document.addEventListener("drop", preventDragEvents, true);

    // For iOS Safari which handles events differently
    if (textareaRef.current) {
      textareaRef.current.addEventListener("focus", handleFocus);
    }

    return () => {
      // Clean up
      document.removeEventListener("dragstart", preventDragEvents, true);
      document.removeEventListener("dragenter", preventDragEvents, true);
      document.removeEventListener("dragover", preventDragEvents, true);
      document.removeEventListener("drop", preventDragEvents, true);

      if (textareaRef.current) {
        textareaRef.current.removeEventListener("focus", handleFocus);
      }
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
    alert(
      "Dragging content into this field is not allowed for security reasons",
    );
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
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alert("Dragging content into this field is not allowed");
        return false;
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      onDrag={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      placeholder={placeholder}
      className={`no-drag-drop ${className}`}
      disabled={disabled}
      rows={rows}
      draggable="false"
      spellCheck="false"
      autoCorrect="off"
      autoCapitalize="off"
      data-secure-field="true"
      style={
        {
          WebkitUserSelect: "text",
          userSelect: "text",
          WebkitUserDrag: "none",
          MozUserDrag: "none",
          msUserDrag: "none",
          userDrag: "none",
        } as React.CSSProperties
      }
      onContextMenu={(e) => {
        // Optional: Prevent right-click menu for additional security
        // e.preventDefault();
        // return false;
      }}
    />
  );
};

export default SecureTextField;
