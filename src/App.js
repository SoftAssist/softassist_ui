import { ClerkProvider, SignIn, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from './components/layout/Sidebar';
import Projects from './components/projects/Projects';
import Settings from './components/settings/Settings';
import './App.css';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

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

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to Dashboard</h1>
    </div>
  );
}

function App() {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error("Missing Clerk Publishable Key");
    return <div>Missing Clerk Publishable Key</div>;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route 
              path="/sign-in" 
              element={
                <SignedOut>
                  <SignIn routing="path" signUpUrl="/sign-up" />
                </SignedOut>
              } 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
