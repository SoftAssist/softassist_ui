import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx';
import { Button } from '../ui/button.jsx';
import Logout from '../auth/Logout.js';

function Sidebar() {
  const { user } = useUser();
  
  return (
    <div className="sidebar">
      <div className="user-profile">
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="user-info">
          <p className="user-name">{user?.fullName}</p>
          <p className="user-email">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
      
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <Logout />
      </div>
    </div>
  );
}

export default Sidebar; 