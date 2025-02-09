import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

const Header = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <header className="header">
      <nav>
        <div className="logo">Your App</div>
        <div className="auth-section">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <a href="/sign-in">Sign In</a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; 