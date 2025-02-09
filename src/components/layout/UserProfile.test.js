import { useUser } from "@clerk/clerk-react";
import { render, screen, act } from '@testing-library/react';
import React from 'react';

import UserProfile from './UserProfile';
import { softAssistAPI } from '../../api/softAssistAPI';

// Mock the API
jest.mock('../../api/softAssistAPI', () => ({
  softAssistAPI: {
    user: {
      getCurrentUser: jest.fn()
    }
  }
}));

// Mock Clerk hooks
jest.mock('@clerk/clerk-react', () => ({
  useUser: jest.fn()
}));

const renderUserProfile = async () => {
  let renderResult;
  await act(async () => {
    renderResult = render(<UserProfile />);
  });
  return renderResult;
};

describe('UserProfile', () => {
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
  });

  it('renders loading state initially', async () => {
    // Create a promise that we can control
    let resolveApi;
    const apiPromise = new Promise(resolve => {
      resolveApi = resolve;
    });
    
    softAssistAPI.user.getCurrentUser.mockImplementation(() => apiPromise);

    // Render component but don't resolve API call yet
    await renderUserProfile();

    // Check loading state
    expect(screen.getByTestId('user-profile-loading')).toBeInTheDocument();

    // Resolve the API call
    await act(async () => {
      resolveApi({ name: 'Test User', email: 'test@example.com', role: 'user' });
      await apiPromise;
    });
  });

  it('renders user information after loading', async () => {
    const mockApiResponse = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };
    
    softAssistAPI.user.getCurrentUser.mockResolvedValue(mockApiResponse);

    await renderUserProfile();

    await act(async () => {
      await screen.findByText('Test User');
    });
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    softAssistAPI.user.getCurrentUser.mockRejectedValue(new Error('API Error'));

    await renderUserProfile();

    await act(async () => {
      await screen.findByText('Test User');
    });
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('⚠️ API Error')).toBeInTheDocument();

    consoleError.mockRestore();
  });
}); 