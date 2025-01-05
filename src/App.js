import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import ProfileForm from "./components/ProfileForm";
import Services from "./components/Services";
import Bookings from "./components/Bookings";
import "./styles.css";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaUserCircle } from "react-icons/fa"; // Import icons

function App() {
    const auth = useAuth();

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profile, setProfile] = useState(null);
    const [showProfileForm, setShowProfileForm] = useState(false); 

    const signoutRedirect = async () => {
      const clientId = "2fpemjqos4302bfaf65g06l8g0"; // Cognito App Client ID
      const logoutUri = "https://sessions.red"; // Post-logout redirect URI
      const cognitoDomain = "https://auth.sessions.red"; // Cognito domain
    
      // Construct the logout URL with the post-logout redirect URI
      const logoutURL = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&post_logout_redirect_uri=${encodeURIComponent(logoutUri)}`;
    
      console.log("Logout URL:", logoutURL); // Log for debugging
    
      try {
        // Clear local auth state
        await auth.removeUser(); // Removes the user session from oidc-context
    
        // Redirect to Cognito logout endpoint
        window.location.href = logoutURL;
      } catch (error) {
        console.error("Error during signout:", error);
      }
    };

    const renderHeader = () => (
      <header className="header">
          <div className="header-logo">
              <img src="/logo.jpeg" alt="Expert Sessions Logo" className="header-logo-image" />
              <span className="header-title">Expert Sessions</span>
          </div>
          <nav className="header-nav">
              {!auth.isAuthenticated ? (
                  <button className="header-link" onClick={() => auth.signinRedirect()}>
                      <FaSignInAlt className="header-icon" /> Sign In
                  </button>
              ) : (
                  <>
                      <button className="header-link" onClick={() => setShowProfileForm(true)}>
                          <FaUserCircle className="header-icon" /> Profile
                      </button>
                      <button className="header-link" onClick={signoutRedirect}>
                          <FaSignOutAlt className="header-icon" /> Sign Out
                      </button>
                  </>
              )}
          </nav>
      </header>
    );

    const renderContent = () => {
      if (!profile || showProfileForm) {
        return (
          <div>{renderHeader()}
            <div className="containerFlex">
                <div className="card">
                    
                    <ProfileForm saveUserProfile={saveUserProfile} profile={profile} />
                </div>
            </div>
            </div>
        );
      }

      // Redirect based on the user's role
      switch (profile.role) {
          case "teacher":
              return (
                <div>{renderHeader()}
                  <div className="containerLeft">
                      <div className="card">
                          <Services />
                      </div>
                  </div>
                  </div>
              );

          case "student":
              return (
                <div>{renderHeader()}
                  <div className="containerLeft">
                      <div className="card">
                          
                          <Bookings />
                      </div>
                  </div>
                  </div>
              );

          default:
              return (
                <div>{renderHeader()}
                  <div className="container">
                      <div className="card">
                          
                          <p>Invalid Profile Data. Please update your profile.</p>
                      </div>
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
                setShowProfileForm(false);
            } else {
                console.error("Error saving profile:", result);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    if (!auth.isAuthenticated) {
      return (
          <div>{renderHeader()}
          <div className="containerFlex" >
            
            <div className="card" >
              
                <p>
                    Welcome to Expert Sessions – a platform designed to connect you with
                    experts across various domains.
                </p>
                <button className="button" onClick={() => auth.signinRedirect()}>
                    Sign In to Explore
                </button>
            </div>
            
          </div>
          </div>
      );
    }

    if (auth.isLoading || loadingProfile) {
        return (
            <div className="containerFlex">
                <div className="card">
                    <h2 className="heading">Loading...</h2>
                </div>
            </div>
        );
    }

    if (auth.error) {
        return (
            <div className="containerFlex">
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

    return renderContent();
}

export default App;