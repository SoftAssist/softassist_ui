import { useClerk } from '@clerk/clerk-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button 
      className="logout-button" 
      onClick={handleLogout}
    >
      <span className="logout-icon">⇥</span>
      <span className="logout-text">Logout</span>
    </button>
  );
};

export default Logout;
