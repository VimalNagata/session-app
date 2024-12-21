import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Services from "./Services";
import Bookings from "./Bookings";
import ProfileForm from "./ProfileForm";
import Header from "./Header";
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

  

  // Authenticated home page
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