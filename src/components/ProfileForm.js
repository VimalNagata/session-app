import React, { useState } from "react";

const ProfileForm = ({ saveUserProfile }) => {
    const [role, setRole] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        saveUserProfile({ role, ...formData });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Complete Your Profile</h2>
            <label>Role</label>
            <select name="role" onChange={(e) => setRole(e.target.value)} required>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>

            {role === "student" && (
                <>
                    <input type="number" name="age" placeholder="Age" onChange={handleInputChange} required />
                    <input type="text" name="educational_qualification" placeholder="Educational Qualification" onChange={handleInputChange} required />
                    <input type="text" name="area_of_interest" placeholder="Area of Interest" onChange={handleInputChange} required />
                </>
            )}

            {role === "teacher" && (
                <>
                    <input type="text" name="qualification" placeholder="Qualification" onChange={handleInputChange} required />
                    <input type="text" name="expertise" placeholder="Expertise" onChange={handleInputChange} required />
                    <input type="number" name="years_of_experience" placeholder="Years of Experience" onChange={handleInputChange} required />
                </>
            )}
            <button type="submit">Save Profile</button>
        </form>
    );
};

export default ProfileForm;