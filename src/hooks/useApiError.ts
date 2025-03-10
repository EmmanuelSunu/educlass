import { useState, useCallback } from 'react';

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleApiError = useCallback((error: any) => {
    console.error('API Error:', error);
    const errorMessage = error?.message || 'An unexpected error occurred';
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 5000);
    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hideError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleApiError, clearError, hideError };
};