import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <header className="border-b">
      <nav className="h-16 flex items-center px-4">
        <div className="font-semibold text-lg">Your App</div>
        <div className="ml-auto">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <Button variant="ghost" asChild>
              <a href="/sign-in">Sign In</a>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; 