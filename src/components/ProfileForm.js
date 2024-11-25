import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

const ProfileForm = () => {
  const auth = useAuth();
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user) {
      const userAttributes = auth.user.profile;
      const userRole = userAttributes["custom:role"];
      if (userRole) {
        setRole(userRole); // Set the role if it exists
      }
      setFormData(userAttributes); // Pre-fill existing attributes
      setLoading(false);
    }
  }, [auth.user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (role) {
      try {
        const attributes = { "custom:role": role };
        await axios.post("https://sessions.red/update-profile", {
          access_token: auth.user.access_token,
          attributes,
        });
        alert("Role updated successfully! Please complete the profile.");
      } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role. Please try again.");
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://sessions.red/update-profile", {
        access_token: auth.user.access_token,
        attributes: formData,
      });
  
      if (response.status === 200) {
        const { message, details } = response.data;
        console.log("Profile update details:", details);
        alert(`${message}\nDetails: ${JSON.stringify(details, null, 2)}`);
      } else {
        alert("Profile updated but response indicates a possible issue.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  const teacherFields = [
    { name: "custom:availability", label: "Availability" },
    { name: "custom:bio", label: "Bio" },
    { name: "custom:experience", label: "Experience" },
    { name: "custom:qualification", label: "Qualification" },
    { name: "custom:specialization", label: "Specialization" },
    { name: "custom:subject", label: "Subject" },
  ];

  const studentFields = [
    { name: "custom:grade", label: "Grade" },
    { name: "custom:guardian_email", label: "Guardian Email" },
    { name: "custom:language", label: "Language" },
    { name: "custom:learning_goal", label: "Learning Goal" },
  ];

  if (!role) {
    return (
      <form onSubmit={handleRoleSubmit}>
        <h1>Select Your Role</h1>
        <label>
          <input
            type="radio"
            name="role"
            value="Teacher"
            onChange={(e) => setRole(e.target.value)}
          />
          Teacher
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="Student"
            onChange={(e) => setRole(e.target.value)}
          />
          Student
        </label>
        <button type="submit">Save Role</button>
      </form>
    );
  }

  const fieldsToRender = role === "Teacher" ? teacherFields : studentFields;

  return (
    <form onSubmit={handleProfileSubmit}>
      <h1>{role} Profile</h1>
      {fieldsToRender.map((field) => (
        <div key={field.name}>
          <label>{field.label}:</label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default ProfileForm;