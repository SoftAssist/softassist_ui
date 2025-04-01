import { ClerkProvider, SignIn, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from './components/layout/Sidebar.js';
import Dashboard from './components/Dashboard.jsx';
import Projects from './components/projects/Projects.js';
import Settings from './components/settings/Settings.js';
import Repositories from "./components/repositories/repositories.js";
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

function App() {
  React.useEffect(() => {
    // Add dark mode class to html element
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
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
                        <Route path="/settings" element={<Settings />} />
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
    </ClerkProvider>
  );
}

export default App;
