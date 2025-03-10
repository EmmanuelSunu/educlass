
import { useState, useCallback } from 'react';

export interface ApiError {
  message: string;
  statusCode?: number;
  isVisible: boolean;
}

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError({
        message: err.message,
        isVisible: true
      });
    } else if (typeof err === 'string') {
      setError({
        message: err,
        isVisible: true
      });
    } else {
      setError({
        message: 'An unknown error occurred',
        isVisible: true
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hideError = useCallback(() => {
    if (error) {
      setError({
        ...error,
        isVisible: false
      });
    }
  }, [error]);

  return {
    error,
    handleError,
    clearError,
    hideError
  };
}
