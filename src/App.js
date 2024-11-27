import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import { useAuth } from "react-oidc-context";
import Home from "./components/Home"; // Import the Home component
import "./styles.css"; // Import the new CSS file

function App() {
  const auth = useAuth();

  // Custom logout logic
  const signoutRedirect = () => {
    const clientId = "2fpemjqos4302bfaf65g06l8g0"; 
    const logoutUri = "https://sessions.red"; // Use your production URL here
    const cognitoDomain = "https://auth.sessions.red";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="heading">Loading...</h2>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="heading">Something went wrong!</h2>
          <p className="sub-heading">{auth.error.message}</p>
          <button className="button" onClick={() => auth.signinRedirect()}>
            Try Signing In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Redirect `/` to `/home` */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Render `/home` */}
        <Route
          path="/home"
          element={<Home signoutRedirect={signoutRedirect} />}
        />

        {/* Catch-all route for unmatched paths */}
        <Route
          path="*"
          element={
            <div className="container">
              <div className="card">
                <h2 className="heading">404: Page Not Found</h2>
                <div className="form-group">
                  <button
                    className="button"
                    onClick={() => auth.signinRedirect()}
                  >
                    Sign In
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={signoutRedirect}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;