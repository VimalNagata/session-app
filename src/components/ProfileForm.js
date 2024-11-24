import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const ProfileForm = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const userRole = user.attributes["custom:role"];
        if (userRole) {
          setRole(userRole); // Set the role if it exists
        }
        setFormData(user.attributes); // Pre-fill existing attributes
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (role) {
      try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, { "custom:role": role }); // Save the selected role
        alert("Role updated successfully! Please complete the profile.");
      } catch (error) {
        console.error("Error updating role:", error);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, formData); // Update user attributes
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
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