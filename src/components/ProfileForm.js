import React, { useState, useEffect } from "react";
import "../styles.css";

const ProfileForm = ({ saveUserProfile, profile }) => {
    const [role, setRole] = useState(profile?.role || "");
    const [formData, setFormData] = useState({
        full_name: profile?.full_name || "",
        year_of_birth: profile?.year_of_birth || "",
        educational_qualification: profile?.educational_qualification || "",
        learning_interests: profile?.learning_interests || "",
        location: profile?.location || "IST",
        timezone: profile?.timezone || "IST",
        reason_for_1on1_classes: profile?.reason_for_1on1_classes || "",
        qualifications: profile?.qualifications || "",
        detailed_bio: profile?.detailed_bio || "",
        associations: profile?.associations || "",
        years_of_experience: profile?.years_of_experience || "",
        topics_for_teaching: profile?.topics_for_teaching || [],
        preferred_slots: profile?.preferred_slots || [],
        testimonials: profile?.testimonials || "",
    });

    const cities = [
        "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
        "New York", "San Francisco", "Los Angeles", "Chicago", "Houston", "Other"
    ];

    const timezones = [
        "IST", "EST", "CST", "PST", "UTC", "Other"
    ];

    useEffect(() => {
        if (profile) {
            setRole(profile.role || "");
            setFormData(profile);
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMultiSelectChange = (e) => {
        const { options } = e.target;
        const selected = Array.from(options).filter(opt => opt.selected).map(opt => opt.value);
        setFormData({ ...formData, topics_for_teaching: selected });
    };

    const handleSlotChange = (e) => {
        const { value } = e.target;
        const slots = value.split(",").map(slot => slot.trim());
        setFormData({ ...formData, preferred_slots: slots });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        saveUserProfile({ role, ...formData });
    };

    return (
        <div className="profile-form">
            <form onSubmit={handleSubmit}>
                <h2>Complete Your Profile</h2>
                
                {/* Role Selection */}
                <label>Role</label>
                <select name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                {/* Common Fields */}
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
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

                {/* Student-Specific Fields */}
                {role === "student" && (
                    <>
                        <input
                            type="text"
                            name="educational_qualification"
                            value={formData.educational_qualification}
                            placeholder="Highest Educational Qualification"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="learning_interests"
                            value={formData.learning_interests}
                            placeholder="Learning Interests"
                            onChange={handleInputChange}
                            required
                        />
                        <label>Location</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        >
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                        <label>Timezone</label>
                        <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            required
                        >
                            {timezones.map((zone, index) => (
                                <option key={index} value={zone}>{zone}</option>
                            ))}
                        </select>
                        <textarea
                            name="reason_for_1on1_classes"
                            value={formData.reason_for_1on1_classes}
                            placeholder="Why do you want to get 1:1 classes?"
                            onChange={handleInputChange}
                            required
                        />
                    </>
                )}

                {/* Teacher-Specific Fields */}
                {role === "teacher" && (
                    <>
                        <input
                            type="text"
                            name="qualifications"
                            value={formData.qualifications}
                            placeholder="Qualifications"
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="detailed_bio"
                            value={formData.detailed_bio}
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
                            placeholder="Years of Experience"
                            onChange={handleInputChange}
                            required
                        />
                        <label>Topics for Teaching (Hold Ctrl to select multiple)</label>
                        <select
                            name="topics_for_teaching"
                            multiple
                            value={formData.topics_for_teaching}
                            onChange={handleMultiSelectChange}
                            required
                        >
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="Music">Music</option>
                            <option value="Language">Language</option>
                        </select>
                        <label>Preferred Slots for Teaching (Comma Separated)</label>
                        <input
                            type="text"
                            name="preferred_slots"
                            value={formData.preferred_slots.join(", ")}
                            placeholder="e.g., Monday 10am-12pm, Friday 3pm-5pm"
                            onChange={handleSlotChange}
                            required
                        />
                        <textarea
                            name="testimonials"
                            value={formData.testimonials}
                            placeholder="Testimonials from students"
                            onChange={handleInputChange}
                        />
                    </>
                )}

                {/* Submit Button */}
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default ProfileForm;