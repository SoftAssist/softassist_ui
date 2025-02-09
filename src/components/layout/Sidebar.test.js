import { useUser, useClerk } from "@clerk/clerk-react";
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Sidebar from './Sidebar';

// Mock the API
jest.mock('../../api/softAssistAPI', () => ({
  softAssistAPI: {
    user: {
      getCurrentUser: jest.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      })
    }
  }
}));

// Mock Clerk hooks
jest.mock('@clerk/clerk-react', () => ({
  useUser: jest.fn(),
  useClerk: jest.fn(),
  UserButton: () => <button>User Button</button>
}));

// Create a wrapper component with all required providers
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Sidebar', () => {
  const mockUser = {
    fullName: 'Test User',
    imageUrl: 'test-image-url',
    primaryEmailAddress: {
      emailAddress: 'test@example.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({ user: mockUser, isLoaded: true });
    useClerk.mockReturnValue({ 
      signOut: jest.fn().mockResolvedValue(undefined)
    });
  });

  it('renders user information correctly', async () => {
    renderWithProviders(<Sidebar />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Navigation items should be present
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders logout button', async () => {
    renderWithProviders(<Sidebar />);

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });
}); 