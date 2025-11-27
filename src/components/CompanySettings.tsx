import React, { useState, useEffect } from 'react';
import { CompanyProfile } from '../types/index';
import { companyApi } from '../services/api';
import toast from 'react-hot-toast';

interface CompanySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (profile: CompanyProfile) => void;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ isOpen, onClose, onSave }) => {
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: '',
    companyLogo: undefined,
    address: undefined,
    phone: undefined,
    email: undefined,
    gstNumber: undefined,
    bankAccountNumber: undefined,
    bankName: undefined,
    ifscCode: undefined,
    branchName: undefined,
  });

  const [loading, setLoading] = useState(false);

  // Load from database on mount
  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await companyApi.get();
      if (response.data.success && response.data.data) {
        setProfile(response.data.data);
      }
    } catch (err) {
      console.error('Error loading company profile:', err);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem('companyProfile');
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing localStorage:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    if (!profile.companyName.trim()) {
      toast.error('Company name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await companyApi.save(profile);
      
      if (response.data.success) {
        // Also save to localStorage as fallback
        localStorage.setItem('companyProfile', JSON.stringify(profile));
        toast.success('Company profile saved to database!');
        
        // Call callback if provided
        if (onSave) {
          onSave(response.data.data || profile);
        }
        
        onClose();
      }
    } catch (err: any) {
      console.error('Error saving company profile:', err);
      toast.error(err.response?.data?.error || 'Failed to save company profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-screen w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary-900">Company Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {loading && <div className="mb-4 text-center text-sm text-neutral-600">Loading...</div>}

        <div className="space-y-6">
          {/* Company Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700">Company Logo</label>
            <p className="mb-3 text-xs text-neutral-500">Upload your company logo (PNG, JPG, max 2MB)</p>
            <div className="flex items-center gap-4">
              {profile.companyLogo && (
                <img
                  src={profile.companyLogo}
                  alt="Company Logo"
                  className="h-20 w-20 object-contain rounded border border-neutral-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={loading}
                className="block w-full text-sm text-neutral-500
                  file:mr-4 file:rounded file:border-0
                  file:bg-primary-600 file:px-4 file:py-2
                  file:text-white file:cursor-pointer
                  hover:file:bg-primary-700 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleInputChange}
              disabled={loading}
              placeholder=""
              className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                disabled:opacity-50"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700">Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              disabled={loading}
              placeholder=""
              rows={3}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                disabled:opacity-50"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={loading}
                placeholder=""
                className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                  focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                  disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={loading}
                placeholder=""
                className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                  focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                  disabled:opacity-50"
              />
            </div>
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={profile.gstNumber}
              onChange={handleInputChange}
              disabled={loading}
              placeholder=""
              className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                disabled:opacity-50"
            />
          </div>

          {/* Bank Details */}
          <div>
            <h3 className="mb-4 font-semibold text-neutral-700">Bank Details</h3>
            <div className="space-y-4 rounded-lg bg-neutral-50 p-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={profile.bankName}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder=""
                  className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                    focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                    disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700">Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={profile.bankAccountNumber}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder=""
                  className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                    focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                    disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={profile.ifscCode}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder=""
                    className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                      focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                      disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Branch Name</label>
                  <input
                    type="text"
                    name="branchName"
                    value={profile.branchName}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder=""
                    className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900
                      focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                      disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 border-t border-neutral-200 pt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 font-semibold text-neutral-700
                hover:bg-neutral-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white
                hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
