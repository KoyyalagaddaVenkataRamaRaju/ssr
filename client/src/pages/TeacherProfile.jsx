import { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';

import ProfileHeader from './teacherSections/ProfileHeader';
import AboutSection from './teacherSections/AboutSection';
import QualificationsSection from './teacherSections/QualificationsSection';
import ExperienceSection from './teacherSections/ExperienceSection';
import SocialLinks from './teacherSections/SocialLinks';

import {
  getTeacherProfile,
  updateTeacherProfile,
  createTeacherProfile,
  uploadTeacherImage,
} from '../services/teacherService';

import { getCurrentUserId } from '../services/authService';

export default function TeacherProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    designation: '',
    email: '',
    phone: '',
    employeeId: '',
    about: '',
    qualifications: [],
    subjects: [],
    researchInterests: [],
    publications: [],
    achievements: [],
    experienceYears: 0,
    profileImage: '',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [teacherId, setTeacherId] = useState("");

  // Step 1: Load teacher ID
  useEffect(() => {
    const id = getCurrentUserId();
    setTeacherId(id);
    console.log("Fetched Teacher ID:", id);
  }, []);

  // Step 2: Load profile only when teacherId is available
  useEffect(() => {
    if (teacherId) fetchProfile();
  }, [teacherId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getTeacherProfile(teacherId);
      setProfile(data);
      setError('');
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setProfile((prev) => ({ ...prev, [platform]: value }));
  };

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let updatedProfile = { ...profile };

      // Upload image if selected
      if (imageFile) {
        const imageData = await uploadTeacherImage(imageFile);
        updatedProfile.profileImage = imageData.url;
        setImageFile(null);
      }

      await updateTeacherProfile(teacherId, updatedProfile);
      setProfile(updatedProfile);

      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Profile</h1>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Profile Sections */}
        <div className="mb-6">
          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            onImageChange={handleImageChange}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <AboutSection
            profile={profile}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <ExperienceSection
            profile={profile}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <QualificationsSection
            profile={profile}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onArrayChange={handleArrayChange}
          />
        </div>

        <div className="mb-6">
          <SocialLinks
            links={{
              linkedin: profile.linkedin,
              github: profile.github,
              twitter: profile.twitter,
              website: profile.website,
            }}
            isEditing={isEditing}
            onChange={handleSocialLinkChange}
          />
        </div>

      </div>
    </div>
  );
}
