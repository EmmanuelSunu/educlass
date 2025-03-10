
import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';

interface ApiErrorAlertProps {
  message: string;
}

const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ message }) => {
  return (
    <div className="p-4 bg-red-50 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <RiErrorWarningLine className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiErrorAlert;
