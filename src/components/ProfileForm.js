import React, { useState } from "react";
import "../styles.css";

const ProfileForm = () => {
  const [role, setRole] = useState(""); // Role: student/teacher
  const [formData, setFormData] = useState({
    age: "",
    educational_qualification: "",
    area_of_interest: "",
    qualification: "",
    expertise: "",
    years_of_experience: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save the profile data
    fetch("https://your-api-endpoint/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "auth-user-id", // Replace with the actual user ID from auth context
        role,
        ...formData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile saved:", data);
        // Redirect to dashboard or other components
        window.location.href = "/";
      })
      .catch((err) => console.error("Error saving profile:", err));
  };

  return (
    <div className="profile-form">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <<div className="form-group">
          <label>Role:</label>
          <select name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {role === "student" && (
          <>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Educational Qualification:</label>
              <input
                type="text"
                name="educational_qualification"
                value={formData.educational_qualification}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Area of Interest:</label>
              <input
                type="text"
                name="area_of_interest"
                value={formData.area_of_interest}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        {role === "teacher" && (
          <>
            <div className="form-group">
              <label>Qualification:</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Expertise:</label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Years of Experience:</label>
              <input
                type="number"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;