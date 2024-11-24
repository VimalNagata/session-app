import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Home from "./components/Home"; // Import the Home component

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

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={
            auth.isAuthenticated ? (
              <Home signoutRedirect={signoutRedirect} />
            ) : (
              <div>
                <h2>Please Sign In</h2>
                <button onClick={() => auth.signinRedirect()}>Sign in</button>
              </div>
            )
          }
        />
        <Route
          path="/"
          element={
            <div>
              <h2>Welcome to Sessions Platform</h2>
              <button onClick={() => auth.signinRedirect()}>Sign in</button>
              <button onClick={signoutRedirect}>Sign out</button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;