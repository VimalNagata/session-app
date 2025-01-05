import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import ProfileForm from "./components/ProfileForm";
import Services from "./components/Services";
import Bookings from "./components/Bookings";
import "./styles.css";
import { FaSignInAlt, FaSignOutAlt, FaUserCircle } from "react-icons/fa"; // Import icons

const App = () => {
    const auth = useAuth();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profile, setProfile] = useState(null);

    // Fetches user profile from the API Gateway
    const fetchUserProfile = async () => {
        if (auth.isAuthenticated) {
            try {
                const userId = auth.user.profile.sub;
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
                    setProfile(null);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoadingProfile(false);
            }
        }
    };

    // Saves user profile to the API Gateway
    const saveUserProfile = async (profileData) => {
        try {
            const response = await fetch(
                "https://15fvg1d1mg.execute-api.us-east-1.amazonaws.com/prod/profiles",
                {
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
                }
            );

            const result = await response.json();
            if (response.ok) {
                setProfile(profileData);
                console.log("Profile successfully created:", result);
            } else {
                console.error("Error saving profile:", result);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchUserProfile();
        }
    }, [auth.isAuthenticated]);

    const signoutRedirect = async () => {
        const clientId = "2fpemjqos4302bfaf65g06l8g0"; 
        const logoutUri = "https://sessions.red"; 
        const cognitoDomain = "https://auth.sessions.red"; 
        const logoutURL = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&post_logout_redirect_uri=${encodeURIComponent(logoutUri)}`;
        
        try {
            await auth.removeUser(); 
            window.location.href = logoutURL;
        } catch (error) {
            console.error("Error during signout:", error);
        }
    };

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
        if (!profile) {
            return (
                <div className="container">
                    <div className="card">
                        {renderHeader()}
                        <ProfileForm saveUserProfile={saveUserProfile} />
                    </div>
                </div>
            );
        }

        switch (profile.role) {
            case "teacher":
                return (
                    <div className="container">
                        <div className="card">
                            {renderHeader()}
                            <Services />
                        </div>
                    </div>
                );
            case "student":
                return (
                    <div className="container">
                        <div className="card">
                            {renderHeader()}
                            <Bookings />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="container">
                        <div className="card">
                            {renderHeader()}
                            <p>Invalid Profile Data. Please update your profile.</p>
                        </div>
                    </div>
                );
        }
    };

    if (!auth.isAuthenticated) {
        return (
            <div className="container">
                <div className="card">
                    {renderHeader()}
                    <p>Welcome to Expert Sessions! Sign in to explore.</p>
                    <button className="button" onClick={() => auth.signinRedirect()}>
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (auth.isLoading || loadingProfile) {
        return (
            <div className="container">
                <div className="card">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    if (auth.error) {
        return (
            <div className="container">
                <div className="card">
                    {renderHeader()}
                    <h2>Error Occurred!</h2>
                    <p>{auth.error.message}</p>
                    <button onClick={() => auth.signinRedirect()}>Try Signing In Again</button>
                </div>
            </div>
        );
    }

    return <Router>{renderContent()}</Router>;
};

export default App;