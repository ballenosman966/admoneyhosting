import React, { useState, useEffect } from 'react';
import { notificationService } from '../utils/notifications';

interface NotificationSettingsProps {
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useState({
    newAds: true,
    rewards: true,
    vip: true,
    withdrawals: true,
    referrals: true
  });

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setPermissionGranted(notificationService.isPermissionGranted());
    
    // Load saved settings
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermissionGranted(granted);
  };

  const handleSettingChange = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleTestNotification = async () => {
    await notificationService.showNotification({
      title: 'Test Notification',
      body: 'This is a test notification to verify your settings are working!',
      tag: 'test'
    });
  };

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold text-white mb-4">Notifications Not Supported</h3>
          <p className="text-gray-300 mb-4">
            Your browser doesn't support notifications. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Notification Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!permissionGranted && (
          <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-yellow-400 font-semibold">Permission Required</p>
                <p className="text-yellow-300 text-sm">Enable notifications to receive updates about new ads and rewards.</p>
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              className="mt-3 w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
            >
              Enable Notifications
            </button>
          </div>
        )}

        {permissionGranted && (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">New Ads Available</p>
                  <p className="text-gray-400 text-sm">Get notified when new ads are posted</p>
                </div>
                <button
                  onClick={() => handleSettingChange('newAds')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.newAds ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.newAds ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Rewards Earned</p>
                  <p className="text-gray-400 text-sm">Notifications when you earn USDT</p>
                </div>
                <button
                  onClick={() => handleSettingChange('rewards')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.rewards ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.rewards ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">VIP Benefits</p>
                  <p className="text-gray-400 text-sm">VIP status updates and exclusive offers</p>
                </div>
                <button
                  onClick={() => handleSettingChange('vip')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.vip ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.vip ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Withdrawals</p>
                  <p className="text-gray-400 text-sm">Confirmations when withdrawals are processed</p>
                </div>
                <button
                  onClick={() => handleSettingChange('withdrawals')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.withdrawals ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.withdrawals ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Referral Bonuses</p>
                  <p className="text-gray-400 text-sm">When someone uses your referral code</p>
                </div>
                <button
                  onClick={() => handleSettingChange('referrals')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.referrals ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.referrals ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <button
              onClick={handleTestNotification}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mb-4"
            >
              Test Notification
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings; 