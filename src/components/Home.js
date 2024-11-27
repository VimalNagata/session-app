import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Services from "./Services";
import Bookings from "./Bookings";
import ProfileForm from "./ProfileForm";
import "../styles.css"; // Import global CSS

const Home = () => {
  const auth = useAuth();
  const [role, setRole] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (auth.user) {
      const userRole = auth.user.profile["custom:role"];
      setRole(userRole);

      // Show ProfileForm if role is not set
      if (!userRole) {
        setShowProfileForm(true);
      }
    }
  }, [auth.user]);

  const signoutRedirect = () => {
    const clientId = "2fpemjqos4302bfaf65g06l8g0";
    const logoutUri = "https://sessions.red/home";
    const cognitoDomain = "https://auth.sessions.red";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (!auth.isAuthenticated) {
    // Pre-authenticated home page
    return (
      <div className="container">
        <div className="card">
          <img
            src="/logo.jpeg" // Replace with your logo path
            alt="Expert Sessions Logo"
            className="logo"
          />
          <h1 className="heading">Expert Sessions</h1>
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

  // Authenticated home page
  return (
    <div className="container">
      <div className="card">
        <img
          src="/logo.svg" // Replace with your logo path
          alt="Expert Sessions Logo"
          className="logo"
        />
        <h1 className="heading">Welcome to Expert Sessions</h1>
        <p className="sub-heading">Hello, {auth.user?.profile.email}</p>

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