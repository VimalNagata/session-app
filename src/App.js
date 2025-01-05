import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Header from "./components/Header";
import ProfileForm from "./components/ProfileForm";
import Services from "./components/Services";
import Bookings from "./components/Bookings";
import "./styles.css";
import { render } from "@testing-library/react";

function App() {
    const auth = useAuth();

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profile, setProfile] = useState(null);

    const renderHeader = () => (
      <header className="header">
          <Link to="/" className="header-logo">
              <img src="/logo.jpeg" alt="Expert Sessions Logo" className="header-logo-image" />
              <span className="header-title">Expert Sessions</span>
          </Link>
          <nav className="header-nav">
              {!auth.isAuthenticated ? (
                  <button className="header-link" onClick={() => auth.signinRedirect()}>
                      <FaSignInAlt className="header-icon" /> Sign In
                  </button>
              ) : (
                  <>
                      <Link to="/profile" className="header-link">
                          <FaUserCircle className="header-icon" /> Profile
                      </Link>
                      <button className="header-link" onClick={signoutRedirect}>
                          <FaSignOutAlt className="header-icon" /> Sign Out
                      </button>
                  </>
              )}
          </nav>
      </header>
    );

    const renderContent = () => {
      
      // If no profile exists, prompt the user to fill the profile form
      if (!profile) {
          return (
              <div className="container">
                  <div className="card">
                      <ProfileForm saveUserProfile={saveUserProfile} />
                  </div>
              </div>
          );
      }

      // Redirect based on the user's role
      switch (profile.role) {
          case "teacher":
              return (
                  <div className="container">
                      <div className="card">
                          <Services />
                      </div>
                  </div>
              );

          case "student":
              return (
                  <div className="container">
                      <div className="card">
                          <Bookings />
                      </div>
                  </div>
              );

          default:
              return (
                  <div className="container">
                      <div className="card">
                          <p>Invalid Profile Data. Please update your profile.</p>
                      </div>
                  </div>
              );
      }
    };

    useEffect(() => {
      const fetchUserProfile = async () => {
        if (auth.isAuthenticated) {
            try {
                const userId = auth.user.profile.sub; // Ensure this exists
                const response = await fetch(
                    `https://15fvg1d1mg.execute-api.us-east-1.amazonaws.com/prod/profiles?user_id=${userId}`, 
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${auth.user.access_token}`
                        }
                    }
                );
                const data = await response.json();
                if (response.ok && data.profile) {
                    setProfile(data.profile);
                } else {
                    setProfile(null);  // No profile found, trigger profile form
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoadingProfile(false);
            }
        }
      };
      
      fetchUserProfile();

    }, [auth.isAuthenticated]);

    const saveUserProfile = async (profileData) => {
        try {
            const response = await fetch("https://15fvg1d1mg.execute-api.us-east-1.amazonaws.com/prod/profiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.user.access_token}`
                },
                body: JSON.stringify({
                    user_id: auth.user?.profile.sub,
                    role: profileData.role,
                    profile_data: profileData
                })
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Profile successfully created:", result);
                setProfile(profileData);  // Update the profile state
            } else {
                console.error("Error saving profile:", result);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    if (!auth.isAuthenticated) {
      return (
          <div className="container">
            <div className="card">
              {renderHeader()}
                <p>
                    Welcome to Expert Sessions – a platform designed to connect you with
                    experts across various domains.
                </p>
                <button className="button" onClick={() => auth.signinRedirect()}>
                    Sign In to Explore
                </button>
            </div>
          </div>
      );
    }

    if (auth.isLoading || loadingProfile) {
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

    return renderHeader() + renderContent();
}

export default App;