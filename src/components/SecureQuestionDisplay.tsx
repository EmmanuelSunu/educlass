
import React, { useEffect } from "react";

interface SecureQuestionDisplayProps {
  questionText: string;
  className?: string;
}

const SecureQuestionDisplay: React.FC<SecureQuestionDisplayProps> = ({
  questionText,
  className = "",
}) => {
  useEffect(() => {
    // Add global event listeners when component mounts
    const preventCopy = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventKeyboardCopy = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners to document
    document.addEventListener("copy", preventCopy as any);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventKeyboardCopy);

    // Clean up event listeners when component unmounts
    return () => {
      document.removeEventListener("copy", preventCopy as any);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeyboardCopy);
    };
  }, []);

  return (
    <div 
      className={`select-none ${className}`}
      unselectable="on"
      onCopy={(e) => e.preventDefault()}
    >
      {questionText}
    </div>
  );
};

export default SecureQuestionDisplay;
