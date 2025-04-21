import { ClerkProvider, SignIn, SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useCurrentUser } from './contexts/UserContext.js';
import { softAssistAPI } from './api/softAssistAPI.js';

import Sidebar from './components/layout/Sidebar.js';
import Dashboard from './components/Dashboard.jsx';
import Projects from './components/projects/Projects.js';
import SingleProject from './components/projects/singleProject.jsx';
import Settings from './components/settings/Settings.js';
import Repositories from "./components/repositories/repositories.js";
import JitsiMeet from './components/jitsi/JitsiMeet.js';
import Meetings from './components/meetings/Meetings.jsx';
import './App.css';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Add environment indicator for debugging
const currentEnv = process.env.NODE_ENV || 'development';
console.log(`Running in ${currentEnv} environment`);

// Layout wrapper component
function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

// Protected route wrapper component
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        <Layout>{children}</Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Modify the ClerkUserProvider to fetch user data from our API
function ClerkUserProvider({ children }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { updateUser } = useCurrentUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && clerkUser) {
        try {
          const response = await softAssistAPI.user.getCurrentUser({
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName
          });
          
          // Update the user context with the API response data
          if (response.data) {
            updateUser(response.data);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    fetchUserData();
  }, [clerkUser, isLoaded, updateUser]);

  return children;
}

ClerkUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  React.useEffect(() => {
    // Add dark mode class to html element
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <UserProvider>
        <ClerkUserProvider>
          <BrowserRouter>
            <Routes>
              <Route 
                path="/sign-in" 
                element={
                  <SignedOut>
                    <SignIn routing="path" signUpUrl="/sign-up" />
                  </SignedOut>
                } 
              />
              
              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <>
                    <SignedIn>
                      <div className="flex min-h-screen">
                        <Sidebar />
                        <main className="flex-1 p-6">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:id" element={<SingleProject />} />
                            <Route path="/projects/:projectId/meetings" element={<Meetings />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/meet" element={<JitsiMeet />} />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/repositories" element={<Repositories />} />
                          </Routes>
                        </main>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </ClerkUserProvider>
      </UserProvider>
    </ClerkProvider>
  );
}

export default App;
