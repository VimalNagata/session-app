import React, { useState, useEffect } from "react";
import "../styles.css";

const ProfileForm = ({ saveUserProfile, profile }) => {
    const [role, setRole] = useState(profile?.role || "");
    const [formData, setFormData] = useState({
        age: profile?.age || "",
        educational_qualification: profile?.educational_qualification || "",
        area_of_interest: profile?.area_of_interest || "",
        qualification: profile?.qualification || "",
        expertise: profile?.expertise || "",
        years_of_experience: profile?.years_of_experience || "",
    });

    useEffect(() => {
        if (profile) {
            setRole(profile.role || "");
            setFormData({
                age: profile.age || "",
                educational_qualification: profile.educational_qualification || "",
                area_of_interest: profile.area_of_interest || "",
                qualification: profile.qualification || "",
                expertise: profile.expertise || "",
                years_of_experience: profile.years_of_experience || "",
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        saveUserProfile({ role, ...formData });
    };

    return (
        <div className="profile-form">
            <form onSubmit={handleSubmit}>
                <h2>Complete Your Profile</h2>
                <label>Role</label>
                <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                {role === "student" && (
                    <>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            placeholder="Age"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="educational_qualification"
                            value={formData.educational_qualification}
                            placeholder="Educational Qualification"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="area_of_interest"
                            value={formData.area_of_interest}
                            placeholder="Area of Interest"
                            onChange={handleInputChange}
                            required
                        />
                    </>
                )}

                {role === "teacher" && (
                    <>
                        <input
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            placeholder="Qualification"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="expertise"
                            value={formData.expertise}
                            placeholder="Expertise"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="years_of_experience"
                            value={formData.years_of_experience}
                            placeholder="Years of Experience"
                            onChange={handleInputChange}
                            required
                        />
                    </>
                )}

                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default ProfileForm;