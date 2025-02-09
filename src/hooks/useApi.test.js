import { renderHook, act } from '@testing-library/react';

import useApi from './useApi';

describe('useApi', () => {
  const mockApiFunction = jest.fn();

  beforeEach(() => {
    mockApiFunction.mockReset();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useApi(mockApiFunction));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('handles successful API calls', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('handles API errors', async () => {
    const mockError = new Error('API Error');
    mockApiFunction.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBe(mockError);
  });
}); 