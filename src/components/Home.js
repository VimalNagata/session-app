import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Services from "./Services";
import Bookings from "./Bookings";
import ProfileForm from "./ProfileForm";

const Home = () => {
  const auth = useAuth();
  const [role, setRole] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (auth.user) {
      // Extract the role from Cognito user claims
      const userRole = auth.user.profile["custom:role"];
      setRole(userRole);

      // Show ProfileForm if the role is not set
      if (!userRole) {
        setShowProfileForm(true);
      }
    }
  }, [auth.user]);

  const signoutRedirect = () => {
    const clientId = "2fpemjqos4302bfaf65g06l8g0"; // Your Cognito App Client ID
    const logoutUri = "https://sessions.red/home"; // Redirect URI
    const cognitoDomain = "https://auth.sessions.red";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (!auth.isAuthenticated) {
    return <div>Please sign in.</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Expert Sessions</h1>
      <p>Hello, {auth.user?.profile.email}</p>
      
      {/* Show ProfileForm if role is not set */}
      {showProfileForm ? (
        <ProfileForm
          onRoleUpdate={(updatedRole) => {
            setRole(updatedRole);
            setShowProfileForm(false); // Hide the form once the role is updated
          }}
        />
      ) : (
        <>
          {role && <p>You have logged in as a {role}</p>}
          {role === "teacher" && <Services />}
          {role === "student" && <Bookings />}
        </>
      )}

      <button style={styles.signoutButton} onClick={signoutRedirect}>
        Sign Out
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  signoutButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Home;