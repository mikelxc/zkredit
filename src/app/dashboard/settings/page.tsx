'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    proofExpiryAlerts: true,
    securityAlerts: true,
    marketingUpdates: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    enhancedPrivacy: true,
    dataSharing: false,
    activityTracking: true,
  });
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    compactView: false,
    highContrast: false,
  });

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setAppearanceSettings(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings to a backend
    console.log('Saving settings:', {
      notificationSettings,
      privacySettings,
      appearanceSettings,
    });
    
    // Show a success message or toast notification
    alert('Settings saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-lg font-medium text-blue-800">Notification Settings</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                <p className="text-gray-500">Receive email notifications for important account updates and activities.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="proofExpiryAlerts"
                  name="proofExpiryAlerts"
                  type="checkbox"
                  checked={notificationSettings.proofExpiryAlerts}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="proofExpiryAlerts" className="font-medium text-gray-700">Proof Expiry Alerts</label>
                <p className="text-gray-500">Get notified before your ZK proofs expire.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="securityAlerts"
                  name="securityAlerts"
                  type="checkbox"
                  checked={notificationSettings.securityAlerts}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="securityAlerts" className="font-medium text-gray-700">Security Alerts</label>
                <p className="text-gray-500">Receive notifications about security-related events.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketingUpdates"
                  name="marketingUpdates"
                  type="checkbox"
                  checked={notificationSettings.marketingUpdates}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketingUpdates" className="font-medium text-gray-700">Marketing Updates</label>
                <p className="text-gray-500">Receive updates about new features and promotions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-lg font-medium text-blue-800">Privacy Settings</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="enhancedPrivacy"
                  name="enhancedPrivacy"
                  type="checkbox"
                  checked={privacySettings.enhancedPrivacy}
                  onChange={handlePrivacyChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="enhancedPrivacy" className="font-medium text-gray-700">Enhanced Privacy Mode</label>
                <p className="text-gray-500">Enable additional privacy features for your account.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="dataSharing"
                  name="dataSharing"
                  type="checkbox"
                  checked={privacySettings.dataSharing}
                  onChange={handlePrivacyChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="dataSharing" className="font-medium text-gray-700">Data Sharing</label>
                <p className="text-gray-500">Allow anonymous data sharing to improve our services.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="activityTracking"
                  name="activityTracking"
                  type="checkbox"
                  checked={privacySettings.activityTracking}
                  onChange={handlePrivacyChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="activityTracking" className="font-medium text-gray-700">Activity Tracking</label>
                <p className="text-gray-500">Track your activity for better security and personalization.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-lg font-medium text-blue-800">Appearance Settings</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
              <select
                id="theme"
                name="theme"
                value={appearanceSettings.theme}
                onChange={handleAppearanceChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="compactView"
                  name="compactView"
                  type="checkbox"
                  checked={appearanceSettings.compactView}
                  onChange={handleAppearanceChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="compactView" className="font-medium text-gray-700">Compact View</label>
                <p className="text-gray-500">Use a more compact layout for dashboard elements.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="highContrast"
                  name="highContrast"
                  type="checkbox"
                  checked={appearanceSettings.highContrast}
                  onChange={handleAppearanceChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="highContrast" className="font-medium text-gray-700">High Contrast Mode</label>
                <p className="text-gray-500">Increase contrast for better accessibility.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-lg font-medium text-blue-800">Security Settings</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Connected Wallet</h3>
              <div className="mt-2 flex items-center">
                <div className="bg-gray-100 rounded-md px-3 py-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-gray-900">{user?.walletAddress ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}` : 'No wallet connected'}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </button>
            </div>
            
            <div className="pt-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
            
            <div className="pt-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Link back to dashboard */}
      <div className="flex justify-end">
        <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
