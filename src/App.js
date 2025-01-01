import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Home from "./components/Home"; // Import the Home component
import ProfileForm from "./components/ProfileForm"; // Import the ProfileForm component
import Header from "./components/Header";
import "./styles.css";

function App() {
  const auth = useAuth();

  useEffect(() => {
    // Debugging authentication
    if (auth.error) {
      console.error("Authentication Error:", auth.error);
    }
  }, [auth.error]);

  const signoutRedirect = () => {
    const clientId = "2fpemjqos4302bfaf65g06l8g0";
    const logoutUri = "https://sessions.red";
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

  if (!auth.isAuthenticated) {
    return (
      <div className="container">
        <div className="card">
          <Header />
          <p>
            Welcome to Expert Sessions – a platform designed to connect you with
            experts across various domains. Whether you're a student looking for
            teachers to guide you or a patient seeking consultations with
            specialized doctors, we've got you covered.
          </p>
          <p>
            Our platform allows you to book experts based on their availability
            and expertise, ensuring you get the right guidance when you need it.
          </p>
          <button className="button" onClick={() => auth.signinRedirect()}>
            Sign In to Explore
          </button>
        </div>
      </div>
    );
  }

  // Check for profile completion
  const isProfileComplete = !!auth.user?.profile["custom:role"]; // Check for a required field, e.g., `custom:role`

  return (
    <Router>
      <Header />
      <Routes>
        {/* Redirect to profile completion if profile is incomplete */}
        {!isProfileComplete && (
          <Route path="*" element={<Navigate to="/profile" replace />} />
        )}

        {/* Profile Form Route */}
        <Route path="/profile" element={<ProfileForm />} />

        {/* Home Route */}
        <Route path="/home" element={<Home signoutRedirect={signoutRedirect} />} />

        {/* Catch-all for unmatched routes */}
        <Route
          path="*"
          element={<div className="container"><h2>404: Page Not Found</h2></div>}
        />
      </Routes>
    </Router>
  );
}

export default App;