import React from "react";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  // Custom logout logic
  const signoutRedirect = () => {
    const clientId = "2fpemjqos4302bfaf65g06l8g0"; 
    const logoutUri = "https://sessions.red/home"; // Use your production URL here
    const cognitoDomain = "https://auth.sessions.red";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return (
      <div>
        <h2>Something went wrong!</h2>
        <p>{auth.error.message}</p>
        <button onClick={() => auth.signinRedirect()}>Try Signing In Again</button>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <h1>Welcome!</h1>
        <p>Hello: {auth.user?.profile.email}</p>

        {/* Debugging tokens */}
        {/* Uncomment tokens only for debugging */}
        {/* <pre> ID Token: {auth.user?.id_token} </pre> */}
        {/* <pre> Access Token: {auth.user?.access_token} </pre> */}
        
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signoutRedirect()}>Sign out</button>
    </div>
  );
}

export default App;