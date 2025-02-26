import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Button } from '../ui/button.jsx';

function Logout() {
  const { signOut } = useClerk();

  return (
    <Button 
      variant="ghost" 
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
}

export default Logout;
