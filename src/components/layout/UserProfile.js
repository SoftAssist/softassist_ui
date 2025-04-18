import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar.jsx";
import { Skeleton } from "../ui/skeleton.jsx";

import { softAssistAPI } from '../../api/softAssistAPI.js';
import useApi from '../../hooks/useApi.js';


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

  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={clerkUser?.imageUrl} alt="Profile" />
          <AvatarFallback>
            {(apiUser?.name || clerkUser?.fullName || 'User').charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <div className="font-medium truncate">
            {apiUser?.name || clerkUser?.fullName || 'User'}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {apiUser?.email || clerkUser?.primaryEmailAddress?.emailAddress}
          </div>
          {apiUser?.role && (
            <div className="text-xs text-primary mt-1">{apiUser.role}</div>
          )}
          {apiUser?.message && (
            <div className="text-sm mt-1">{apiUser.message}</div>
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