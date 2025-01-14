import React, { useState, useEffect } from "react";
import "../styles.css";

const ProfileForm = ({ saveUserProfile, profile }) => {
    const [role, setRole] = useState(profile?.role || "");
    const [formData, setFormData] = useState({
        name: profile?.name || "",
        year_of_birth: profile?.year_of_birth || "",
        educational_qualification: profile?.educational_qualification || "",
        learning_interests: Array.isArray(profile?.learning_interests) ? profile?.learning_interests : [],
        location: profile?.location || "",
        timezone: profile?.timezone || "IST",
        why_1_1_classes: profile?.why_1_1_classes || "",
        qualification: profile?.qualification || "",
        bio: profile?.bio || "",
        associations: profile?.associations || "",
        years_of_experience: profile?.years_of_experience || "",
        topics: Array.isArray(profile?.topics) ? profile?.topics : [],
        preferred_slots: Array.isArray(profile?.preferred_slots) ? profile?.preferred_slots : [],
        testimonials: Array.isArray(profile?.testimonials) ? profile?.testimonials : []
    });

    useEffect(() => {
        if (profile) {
            setRole(profile.role || "");
            setFormData({
                name: profile.name || "",
                year_of_birth: profile.year_of_birth || "",
                educational_qualification: profile.educational_qualification || "",
                learning_interests: Array.isArray(profile?.learning_interests) ? profile?.learning_interests : [],
                location: profile.location || "",
                timezone: profile.timezone || "IST",
                why_1_1_classes: profile.why_1_1_classes || "",
                qualification: profile.qualification || "",
                bio: profile.bio || "",
                associations: profile.associations || "",
                years_of_experience: profile.years_of_experience || "",
                topics: Array.isArray(profile?.topics) ? profile?.topics : [],
                preferred_slots: Array.isArray(profile?.preferred_slots) ? profile?.preferred_slots : [],
                testimonials: Array.isArray(profile?.testimonials) ? profile?.testimonials : []
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayInputChange = (e, fieldName) => {
        const values = e.target.value.split(",").map((item) => item.trim());
        setFormData({ ...formData, [fieldName]: values });
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

                {/* Student Specific Fields */}
                {role === "student" && (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="Full Name"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="year_of_birth"
                            value={formData.year_of_birth}
                            placeholder="Year of Birth"
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
                            name="learning_interests"
                            value={formData.learning_interests.join(", ")}
                            placeholder="Learning Interests (comma-separated)"
                            onChange={(e) => handleArrayInputChange(e, "learning_interests")}
                        />
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Location</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="New York">New York</option>
                            <option value="San Francisco">San Francisco</option>
                            <option value="Other">Other</option>
                        </select>
                        <input
                            type="text"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            placeholder="Timezone (default: IST)"
                        />
                        <textarea
                            name="why_1_1_classes"
                            value={formData.why_1_1_classes}
                            placeholder="Why do you want to get 1:1 classes?"
                            onChange={handleInputChange}
                        />
                    </>
                )}

                {/* Teacher Specific Fields */}
                {role === "teacher" && (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="Full Name"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="year_of_birth"
                            value={formData.year_of_birth}
                            placeholder="Year of Birth"
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="qualification"
                            value={formData.qualification}
                            placeholder="Qualifications"
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="bio"
                            value={formData.bio}
                            placeholder="Detailed Bio"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="associations"
                            value={formData.associations}
                            placeholder="Associations with Educational Institutions"
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="years_of_experience"
                            value={formData.years_of_experience}
                            placeholder="Years of Experience in Teaching"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="topics"
                            value={formData.topics.join(", ")}
                            placeholder="Topics for Teaching (comma-separated)"
                            onChange={(e) => handleArrayInputChange(e, "topics")}
                        />
                        <input
                            type="text"
                            name="preferred_slots"
                            value={formData.preferred_slots.join(", ")}
                            placeholder="Preferred Teaching Slots (comma-separated)"
                            onChange={(e) => handleArrayInputChange(e, "preferred_slots")}
                        />
                        <textarea
                            name="testimonials"
                            value={formData.testimonials.join(", ")}
                            placeholder="Student Testimonials (comma-separated)"
                            onChange={(e) => handleArrayInputChange(e, "testimonials")}
                        />
                    </>
                )}

                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default ProfileForm;