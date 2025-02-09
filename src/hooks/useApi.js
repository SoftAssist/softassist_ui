import { useState, useCallback } from 'react';

const useApi = (apiFunction) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...params) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...params);
      setState(prev => ({ ...prev, data: result, loading: false }));
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, error, loading: false }));
      throw error;
    }
  }, [apiFunction]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
  };
};

export default useApi;