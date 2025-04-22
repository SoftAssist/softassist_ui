import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar.jsx";
import { Skeleton } from "../ui/skeleton.jsx";

import { softAssistAPI } from '../../api/softAssistAPI.js';
import useApi from '../../hooks/useApi.js';
import { useCurrentUser } from '../../contexts/UserContext.js';

const UserProfile = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { currentUser, updateUser } = useCurrentUser();
  
  const getUserData = useCallback(() => {
    if (!clerkUser) return Promise.reject('No user data available');
    
    return softAssistAPI.user.getCurrentUser({
      clerkId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    });
  }, [clerkUser]);

  const { 
    data: apiResponse, 
    loading, 
    error, 
    execute: fetchUser 
  } = useApi(getUserData, {
    onSuccess: (response) => {
      console.log(response.data);
      // Store the user data from the response
      updateUser(response.data);
    }
  });

  useEffect(() => {
    if (isClerkLoaded && clerkUser && !currentUser) {
      fetchUser();
    }
  }, [isClerkLoaded, clerkUser, currentUser, fetchUser]);

  if (loading) {
    return (
      <div className="p-4 border-b" data-testid="user-profile-loading">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      </div>
    );
  }

  const user = currentUser || (apiResponse?.data);

  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={clerkUser?.imageUrl} alt="Profile" />
          <AvatarFallback>
            {(user?.firstName || clerkUser?.firstName || '?').charAt(0)}
            {(user?.lastName || clerkUser?.lastName || '?').charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <div className="font-medium truncate">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {user?.email || clerkUser?.primaryEmailAddress?.emailAddress}
          </div>
          {user?.role && (
            <div className="text-xs text-primary mt-1">{user.role}</div>
          )}
          {user?._id && (
            <div className="text-xs text-muted-foreground mt-1">
              DB ID: {user._id}
            </div>
          )}
          {error && (
            <div className="text-destructive text-sm mt-1" title={error.message}>
              ⚠️ API Error
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 