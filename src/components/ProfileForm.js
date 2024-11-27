import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

const ProfileForm = () => {
  const auth = useAuth();
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null); // State to hold error messages

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
        setErrors(null); // Clear previous errors
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
        setErrors(null); // Clear previous errors
        alert(`${message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.error) {
        // Parse and format error message
        const errorMessage = error.response.data.error;
        const formattedError = errorMessage
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line, index) => <p key={index}>{line}</p>); // Display as paragraphs
        setErrors(formattedError);
      } else {
        setErrors(<p>Failed to update profile. Please try again.</p>);
      }
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
      <form onSubmit={handleRoleSubmit} style={styles.formContainer}>
        <h1 style={styles.heading}>Select Your Role</h1>
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
        <button style={styles.button} type="submit">
          Save Role
        </button>
        {errors && <div style={styles.errorMessage}>{errors}</div>}
      </form>
    );
  }

  const fieldsToRender = role === "Teacher" ? teacherFields : studentFields;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Sessions Platform</h1>
      <p style={styles.subHeading}>Hello, {auth.user?.profile.email}</p>

      <div style={styles.formContainer}>
        <h2 style={styles.heading}>{role} Profile</h2>
        {fieldsToRender.map((field) => (
          <div style={styles.formGroup} key={field.name}>
            <label style={styles.label}>{field.label}:</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        ))}
        <button style={styles.button} onClick={handleProfileSubmit}>
          Save Profile
        </button>
        {errors && <div style={styles.errorMessage}>{errors}</div>}
      </div>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "18px",
    marginBottom: "40px",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "left",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #cccccc",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  errorMessage: {
    color: "#ff4d4d",
    fontSize: "14px",
    marginTop: "20px",
    textAlign: "left",
  },
};

export default ProfileForm;