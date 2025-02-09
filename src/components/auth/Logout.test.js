import { useClerk } from '@clerk/clerk-react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Logout from './Logout';

// Mock the required hooks
jest.mock('@clerk/clerk-react', () => ({
  useClerk: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('Logout', () => {
  const mockSignOut = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useClerk.mockReturnValue({ signOut: mockSignOut });
    useNavigate.mockReturnValue(mockNavigate);
    mockSignOut.mockResolvedValue(undefined);
  });

  it('renders logout button', () => {
    render(<Logout />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout click correctly', async () => {
    render(<Logout />);
    
    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
    });
  });

  it('handles logout error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockRejectedValueOnce(new Error('Logout failed'));
    
    render(<Logout />);
    
    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });
    
    consoleError.mockRestore();
  });
});