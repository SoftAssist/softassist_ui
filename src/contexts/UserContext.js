import React, { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Use useCallback to prevent recreation of this function on every render
  const updateUser = useCallback((userData) => {
    // Only update if the data is different
    setCurrentUser(prev => {
      if (JSON.stringify(prev) === JSON.stringify(userData)) {
        return prev;
      }
      return userData;
    });
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
} 