import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="auth-container">
      <SignIn 
        routing="path" 
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
      />
    </div>
  );
};

export default SignInPage;
