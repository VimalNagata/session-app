import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Header from "./components/Header";
import ProfileHandler from "./components/ProfileHandler"; // Import ProfileHandler
import "./styles.css";

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.error) {
      console.error("Authentication Error:", auth.error);
    }

    if (auth.isAuthenticated) {
      ConsoleLogger.log("updating profile....")
      // On successful authentication, fetch or create the user profile
      fetch("https://15fvg1d1mg.execute-api.us-east-1.amazonaws.com/prod/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: auth.user?.profile.sub, // Assuming `sub` is the user's unique ID
          profile_data: {
            email: auth.user?.profile.email,
            name: auth.user?.profile.name,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "User profile created/updated successfully.") {
            console.log("Profile successfully synced with DynamoDB.");
          } else {
            console.error("Error syncing profile:", data);
          }
        })
        .catch((err) => console.error("Error syncing profile:", err));
    }
  }, [auth.isAuthenticated]);



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

  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<ProfileHandler />} />
        <Route
          path="*"
          element={
            <div className="container">
              <div className="card">
                <h2 className="heading">404: Page Not Found</h2>
                <button className="button" onClick={() => auth.signinRedirect()}>
                  Go to Sign In
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;