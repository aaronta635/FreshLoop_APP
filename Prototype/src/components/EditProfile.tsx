import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Camera } from 'lucide-react';

interface EditProfileProps {
  onBack: () => void;
}

export function EditProfile({ onBack }: EditProfileProps) {
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+61 412 345 678',
    location: 'Wollongong, NSW'
  });

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="mb-4 text-gray-600 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-gray-900">Edit Profile</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-[#F7F7F5] rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 bg-[#A8E6A1] rounded-full p-2 shadow-lg">
              <Camera className="w-4 h-4 text-gray-900" />
            </button>
          </div>
          <p className="text-gray-600 mt-3">Change Profile Photo</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-900 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A8E6A1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-900 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A8E6A1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-900 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A8E6A1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-900 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A8E6A1] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#F7F7F5] rounded-2xl p-4 space-y-3">
          <h3 className="text-gray-900">Preferences</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Dietary Restrictions</span>
            <button className="text-[#A8E6A1]">Add</button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Allergen Warnings</span>
            <button className="text-[#A8E6A1]">Add</button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 bg-white border-t border-gray-100">
        <button
          onClick={onBack}
          className="w-full bg-[#A8E6A1] text-gray-900 py-4 rounded-full hover:bg-[#95d98e] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
