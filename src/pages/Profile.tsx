import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Briefcase, Globe, Save, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    skills: user?.profile?.skills?.join(', ') || '',
    experience: user?.profile?.experience || '',
    company: user?.profile?.company || '',
    bio: user?.profile?.bio || '',
    website: user?.profile?.website || ''
  });

  const handleSave = () => {
    const updatedProfile = {
      ...profileData,
      skills: profileData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
    };
    
    updateProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      skills: user?.profile?.skills?.join(', ') || '',
      experience: user?.profile?.experience || '',
      company: user?.profile?.company || '',
      bio: user?.profile?.bio || '',
      website: user?.profile?.website || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-blue-100 capitalize">
                    {user.role === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your phone number"
                        />
                      ) : (
                        <p className="text-gray-900">{user.profile?.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your location"
                        />
                      ) : (
                        <p className="text-gray-900">{user.profile?.location || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {user.role === 'employer' && (
                    <>
                      <div className="flex items-start space-x-3">
                        <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-500">Company</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.company}
                              onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Company name"
                            />
                          ) : (
                            <p className="text-gray-900">{user.profile?.company || 'Not provided'}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Globe className="h-5 w-5 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-500">Website</label>
                          {isEditing ? (
                            <input
                              type="url"
                              value={profileData.website}
                              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="https://your-website.com"
                            />
                          ) : (
                            <p className="text-gray-900">
                              {user.profile?.website ? (
                                <a 
                                  href={user.profile.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  {user.profile.website}
                                </a>
                              ) : (
                                'Not provided'
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Professional Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      {user.role === 'jobseeker' ? 'Skills' : 'Industries'}
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.skills}
                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={user.role === 'jobseeker' ? 'React, TypeScript, Node.js...' : 'Technology, Healthcare, Finance...'}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.profile?.skills?.length ? (
                          user.profile.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-900">Not provided</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      {user.role === 'jobseeker' ? 'Experience' : 'Company Description'}
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.experience}
                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={user.role === 'jobseeker' ? 'Describe your work experience...' : 'Tell us about your company...'}
                      />
                    ) : (
                      <p className="text-gray-900 whitespace-pre-line">
                        {user.profile?.experience || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900 whitespace-pre-line">
                        {user.profile?.bio || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="mt-8 flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}