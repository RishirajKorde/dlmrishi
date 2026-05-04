import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, ArrowLeft } from 'lucide-react';
import { Input, Button } from '../components/FormComponents';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  });

  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    role: userData.role || '',
    branch: userData.branch || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // NOTE: Using a placeholder endpoint. Update this to your actual profile update API.
      // Example: const res = await api.put('/api/v1/auth/profile', formData);

      // For demonstration and immediate feedback, we simulate a successful API call
      // and update the local storage.

      setTimeout(() => {
        const updatedUser = {
          ...userData,
          name: formData.name,
          email: formData.email
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);

        toast.success('Profile updated successfully!');
        setIsLoading(false);

        // Optionally refresh to update Navbar/Sidebar if they don't use shared state
        // window.location.reload(); 
      }, 800);

    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Profile Settings</h2>
            <p className="text-sm text-slate-500">Manage your personal information and account settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 border border-blue-100">
              <User size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{userData.name || 'Admin User'}</h3>
            <p className="text-[11px] text-blue-600 uppercase font-bold tracking-widest bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">
              {userData.role || 'Super Admin'}
            </p>

            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-500">
                <Mail size={16} />
                <span className="text-xs truncate">{userData.email || 'admin@example.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Shield size={16} />
                <span className="text-xs capitalize">{userData.branch || 'Main Branch'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Personal Information
            </h4>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Account Role</label>
                  <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] text-slate-500 font-medium">
                    {formData.role}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Branch</label>
                  <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] text-slate-500 font-medium">
                    {formData.branch || 'Default Branch'}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-end">
                <Button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 h-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
