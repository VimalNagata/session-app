import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import "../styles.css"; // Import global CSS

const ProfileForm = () => {
  const auth = useAuth();
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (auth.user) {
      const userAttributes = auth.user.profile;
      const userRole = userAttributes["custom:role"];
      if (userRole) {
        setRole(userRole);
      }
      setFormData(userAttributes);
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
        setErrors(null);
        alert("Role updated successfully! Please complete the profile.");
      } catch (error) {
        console.error("Error updating role:", error);
        setErrors("Failed to update role. Please try again.");
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
        const { message } = response.data;
        setErrors(null);
        alert(`${message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        const formattedError = errorMessage
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line, index) => <p key={index}>{line}</p>);
        setErrors(formattedError);
      } else {
        setErrors(<p>Failed to update profile. Please try again.</p>);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

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
      <div className="container">
        <div className="card">
          <h1 className="heading">Select Your Role</h1>
          <form onSubmit={handleRoleSubmit} className="form">
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="Teacher"
                onChange={(e) => setRole(e.target.value)}
                className="radio"
              />
              Teacher
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="Student"
                onChange={(e) => setRole(e.target.value)}
                className="radio"
              />
              Student
            </label>
            <button className="button" type="submit">
              Save Role
            </button>
            {errors && <div className="error-message">{errors}</div>}
          </form>
        </div>
      </div>
    );
  }

  const fieldsToRender = role === "Teacher" ? teacherFields : studentFields;

  return (
    <div className="container">
      <div className="card">
        <img src="/logo.png" alt="Expert Sessions" className="logo" />
        <h1 className="heading">Welcome to Sessions Platform</h1>
        <p className="sub-heading">Hello, {auth.user?.profile.email}</p>

        <form onSubmit={handleProfileSubmit} className="form">
          <h2 className="form-heading">{role} Profile</h2>
          {fieldsToRender.map((field) => (
            <div className="form-group" key={field.name}>
              <label className="label">{field.label}:</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          ))}
          <button type="submit" className="button">
            Save Profile
          </button>
        </form>
        {errors && <div className="error-message">{errors}</div>}
      </div>
    </div>
  );
};

export default ProfileForm;