
import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white rounded-lg w-full max-w-lg p-6 mx-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <RiCloseLine size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
