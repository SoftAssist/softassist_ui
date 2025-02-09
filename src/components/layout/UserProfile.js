import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from 'react';

import { softAssistAPI } from '../../api/softAssistAPI';
import useApi from '../../hooks/useApi';
import './UserProfile.css';

const UserProfile = () => {
  const { user: clerkUser } = useUser();
  const { 
    data: apiUser, 
    loading, 
    error, 
    execute: fetchUser 
  } = useApi(softAssistAPI.user.getCurrentUser);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        if (clerkUser && mounted) {
          await fetchUser();
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [clerkUser, fetchUser]);

  if (loading) {
    return (
      <div className="user-profile" data-testid="user-profile-loading">
        <div className="user-info loading">
          <div className="user-avatar-skeleton"></div>
          <div className="user-details-skeleton">
            <div className="name-skeleton"></div>
            <div className="email-skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  // Always show at least the Clerk user data
  return (
    <div className="user-profile">
      <div className="user-info">
        {clerkUser?.imageUrl && (
          <img 
            src={clerkUser.imageUrl} 
            alt="Profile" 
            className="user-avatar"
          />
        )}
        <div className="user-details">
          <div className="user-name">
            {apiUser?.name || clerkUser?.fullName || 'User'}
          </div>
          <div className="user-email">
            {apiUser?.email || clerkUser?.primaryEmailAddress?.emailAddress}
          </div>
          {apiUser?.role && (
            <div className="user-role">{apiUser.role}</div>
          )}
          {apiUser?.message && (
            <div className="user-message">{apiUser.message}</div>
          )}
          {error && (
            <div className="api-error-indicator" title={error.message}>
              ⚠️ API Error
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 