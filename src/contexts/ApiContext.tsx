
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiError } from '../hooks/useApiError';

interface ApiContextType {
  apiGet: <T>(endpoint: string) => Promise<T>;
  apiPost: <T>(endpoint: string, data: any) => Promise<T>;
  apiPut: <T>(endpoint: string, data: any) => Promise<T>;
  apiDelete: <T>(endpoint: string) => Promise<T>;
  loading: boolean;
}

const ApiContext = createContext<ApiContextType | null>(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleApiError } = useApiError();
  
  // Get the API base URL from the environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      // Handle unauthorized status by redirecting to login
      if (response.status === 401) {
        navigate('/');
        throw new Error('Unauthorized access. Please login again.');
      }
      
      // Handle other errors
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    // Handle successful responses
    try {
      return await response.json();
    } catch (error) {
      return null; // Return null for empty responses
    }
  };

  const apiGet = async <T,>(endpoint: string): Promise<T> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await handleResponse(response);
      return data as T;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const apiPost = async <T,>(endpoint: string, data: any): Promise<T> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await handleResponse(response);
      return responseData as T;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const apiPut = async <T,>(endpoint: string, data: any): Promise<T> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await handleResponse(response);
      return responseData as T;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const apiDelete = async <T,>(endpoint: string): Promise<T> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const responseData = await handleResponse(response);
      return responseData as T;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiContext.Provider value={{ apiGet, apiPost, apiPut, apiDelete, loading }}>
      {children}
    </ApiContext.Provider>
  );
};
