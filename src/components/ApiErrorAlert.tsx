
import React from 'react';
import { ApiError } from '../hooks/useApiError';

interface ApiErrorAlertProps {
  error: ApiError | null;
  onDismiss: () => void;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error || !error.isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-start" role="alert">
      <div className="flex-grow mr-2">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline ml-1">{error.message}</span>
      </div>
      <button 
        onClick={onDismiss}
        className="bg-transparent text-red-700 hover:text-red-900"
      >
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );
};

export default ApiErrorAlert;
