import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Header from "./components/Header";
import ProfileForm from "./components/ProfileForm";
import Services from "./components/Services";
import Bookings from "./components/Bookings";
import "./styles.css";




function App() {
    const auth = useAuth();

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profile, setProfile] = useState(null);

    const renderContent = () => {
      // If no profile exists, prompt the user to fill the profile form
      if (!profile) {
          return (
              <div className="container">
                  <div className="card">
                      <Header />
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
                          <Header />
                          <Services />
                      </div>
                  </div>
              );

          case "student":
              return (
                  <div className="container">
                      <div className="card">
                          <Header />
                          <Bookings />
                      </div>
                  </div>
              );

          default:
              return (
                  <div className="container">
                      <div className="card">
                          <Header />
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
              <Header />
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

    return renderContent();
}

export default App;