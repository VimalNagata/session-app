import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

const ProfileHandler = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      // Extract user information from the auth context
      const userProfile = {
        user_id: auth.user.profile.sub, // Cognito user ID or another unique identifier
        profile_data: {
          email: auth.user.profile.email,
          name: auth.user.profile.name || "N/A",
          role: auth.user.profile["custom:role"] || "N/A", // Custom role attribute
          created_at: new Date().toISOString(),
        },
      };

      // Call Lambda to create a profile
      const createProfile = async () => {
        try {
          const response = await axios.post(
            "https://15fvg1d1mg.execute-api.us-east-1.amazonaws.com/prod/profiles", // API Gateway endpoint
            userProfile,
            {
              headers: {
                Authorization: `Bearer ${auth.user.access_token}`, // Optional if Lambda requires JWT authentication
              },
            }
          );
          console.log("Profile created/updated successfully:", response.data);
        } catch (error) {
          console.error("Error creating/updating profile:", error.response?.data || error.message);
        }
      };

      createProfile();
    }
  }, [auth.isAuthenticated, auth.user]);

  return null; // This component doesn't render anything visible
};

export default ProfileHandler;