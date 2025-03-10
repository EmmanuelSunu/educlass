
import React, { useEffect } from 'react';

const ExamSecurityScript: React.FC = () => {
  useEffect(() => {
    // Global event handlers to prevent drag and drop
    const preventDragDrop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Apply these event listeners to document
    document.addEventListener('dragstart', preventDragDrop, true);
    document.addEventListener('dragover', preventDragDrop, true);
    document.addEventListener('drop', preventDragDrop, true);
    
    // Disable native browser drag behaviors
    const disableDragElements = document.querySelectorAll('img, a, [draggable]');
    disableDragElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.draggable = false;
        el.setAttribute('draggable', 'false');
      }
    });

    // Prevent text selection in non-input areas
    const makeUnselectable = (elements: NodeListOf<Element>) => {
      elements.forEach(el => {
        if (el instanceof HTMLElement && 
            !(el instanceof HTMLInputElement) && 
            !(el instanceof HTMLTextAreaElement)) {
          el.style.userSelect = 'none';
          el.style.webkitUserSelect = 'none';
        }
      });
    };

    // Apply to all paragraphs, divs, spans (except within form fields)
    makeUnselectable(document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6'));

    return () => {
      // Clean up event listeners
      document.removeEventListener('dragstart', preventDragDrop, true);
      document.removeEventListener('dragover', preventDragDrop, true);
      document.removeEventListener('drop', preventDragDrop, true);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ExamSecurityScript;
