import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import Services from "./Services";
import Bookings from "./Bookings";
import ProfileForm from "./ProfileForm";
import Header from "./Header";
import "../styles.css"; // Import global CSS

const Home = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (auth.user) {
      const userRole = auth.user.profile["custom:role"];
      setRole(userRole);

      // Redirect to profile page if role is missing
      if (!userRole) {
        navigate("/profile");
      }
    }
  }, [auth.user, navigate]);

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
          <h2 className="heading">Error</h2>
          <p className="sub-heading">{auth.error.message}</p>
          <button className="button" onClick={() => auth.signinRedirect()}>
            Try Signing In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <div className="card">
        {showProfileForm ? (
          <ProfileForm
            onRoleUpdate={(updatedRole) => {
              setRole(updatedRole);
              setShowProfileForm(false);
            }}
          />
        ) : (
          <>
            {role && <p className="sub-heading">You have logged in as a {role}</p>}
            {!role && <p className="sub-heading">No role assigned. Please update your profile.</p>}
            {role === "teacher" && <Services />}
            {role === "student" && <Bookings />}
          </>
        )}

        <button className="button button-secondary" onClick={signoutRedirect}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Home;