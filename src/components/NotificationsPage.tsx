import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { User } from '../utils/userStorage';

interface NotificationsPageProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onBack: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ user, onUserUpdate, onBack }) => {
  const [notifications, setNotifications] = useState({
    emailNotifications: user.emailNotifications !== false,
    pushNotifications: user.pushNotifications !== false,
    newAds: user.newAds !== false,
    earnings: user.earnings !== false,
    streak: user.streak !== false,
    withdrawals: user.withdrawals !== false,
    referrals: user.referrals !== false,
    promotions: user.promotions !== false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveNotifications = () => {
    const updatedUser = {
      ...user,
      emailNotifications: notifications.emailNotifications,
      pushNotifications: notifications.pushNotifications,
      newAds: notifications.newAds,
      earnings: notifications.earnings,
      streak: notifications.streak,
      withdrawals: notifications.withdrawals,
      referrals: notifications.referrals,
      promotions: notifications.promotions
    };
    
    onUserUpdate(updatedUser);
    alert('Notification settings saved successfully!');
  };

  const NotificationToggle = ({ 
    id, 
    label, 
    description, 
    checked, 
    onChange 
  }: {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-white/20 bg-white/10 text-yellow-400 focus:ring-yellow-400/50"
      />
      <div className="flex-1">
        <p className="text-white font-medium">{label}</p>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
      {checked ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400" />
      )}
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Email Notifications</h2>
            </div>
            
            <div className="space-y-3">
              <NotificationToggle
                id="emailNotifications"
                label="Email Notifications"
                description="Receive notifications via email"
                checked={notifications.emailNotifications}
                onChange={(checked) => handleNotificationChange('emailNotifications', checked)}
              />
              
              {notifications.emailNotifications && (
                <div className="ml-6 space-y-3">
                  <NotificationToggle
                    id="newAds"
                    label="New Ads Available"
                    description="Get notified when new ads are available to watch"
                    checked={notifications.newAds}
                    onChange={(checked) => handleNotificationChange('newAds', checked)}
                  />
                  
                  <NotificationToggle
                    id="earnings"
                    label="Earnings Updates"
                    description="Receive updates about your earnings and balance"
                    checked={notifications.earnings}
                    onChange={(checked) => handleNotificationChange('earnings', checked)}
                  />
                  
                  <NotificationToggle
                    id="streak"
                    label="Streak Reminders"
                    description="Get reminded to maintain your daily streak"
                    checked={notifications.streak}
                    onChange={(checked) => handleNotificationChange('streak', checked)}
                  />
                  
                  <NotificationToggle
                    id="withdrawals"
                    label="Withdrawal Status"
                    description="Get notified about withdrawal processing and completion"
                    checked={notifications.withdrawals}
                    onChange={(checked) => handleNotificationChange('withdrawals', checked)}
                  />
                  
                  <NotificationToggle
                    id="referrals"
                    label="Referral Bonuses"
                    description="Get notified when you earn referral bonuses"
                    checked={notifications.referrals}
                    onChange={(checked) => handleNotificationChange('referrals', checked)}
                  />
                  
                  <NotificationToggle
                    id="promotions"
                    label="Promotions & Offers"
                    description="Receive special offers and promotional content"
                    checked={notifications.promotions}
                    onChange={(checked) => handleNotificationChange('promotions', checked)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Push Notifications</h2>
            </div>
            
            <div className="space-y-3">
              <NotificationToggle
                id="pushNotifications"
                label="Push Notifications"
                description="Receive instant notifications on your device"
                checked={notifications.pushNotifications}
                onChange={(checked) => handleNotificationChange('pushNotifications', checked)}
              />
              
              {notifications.pushNotifications && (
                <div className="ml-6 space-y-3">
                  <NotificationToggle
                    id="newAds"
                    label="New Ads Available"
                    description="Get notified when new ads are available to watch"
                    checked={notifications.newAds}
                    onChange={(checked) => handleNotificationChange('newAds', checked)}
                  />
                  
                  <NotificationToggle
                    id="earnings"
                    label="Earnings Updates"
                    description="Receive updates about your earnings and balance"
                    checked={notifications.earnings}
                    onChange={(checked) => handleNotificationChange('earnings', checked)}
                  />
                  
                  <NotificationToggle
                    id="streak"
                    label="Streak Reminders"
                    description="Get reminded to maintain your daily streak"
                    checked={notifications.streak}
                    onChange={(checked) => handleNotificationChange('streak', checked)}
                  />
                  
                  <NotificationToggle
                    id="withdrawals"
                    label="Withdrawal Status"
                    description="Get notified about withdrawal processing and completion"
                    checked={notifications.withdrawals}
                    onChange={(checked) => handleNotificationChange('withdrawals', checked)}
                  />
                  
                  <NotificationToggle
                    id="referrals"
                    label="Referral Bonuses"
                    description="Get notified when you earn referral bonuses"
                    checked={notifications.referrals}
                    onChange={(checked) => handleNotificationChange('referrals', checked)}
                  />
                  
                  <NotificationToggle
                    id="promotions"
                    label="Promotions & Offers"
                    description="Receive special offers and promotional content"
                    checked={notifications.promotions}
                    onChange={(checked) => handleNotificationChange('promotions', checked)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-3 text-white/80">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>You can customize which notifications you receive and how you receive them</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Email notifications are sent to your registered email address</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Push notifications appear on your device even when the app is closed</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>You can change these settings at any time</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveNotifications}
              className="flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
            >
              <Save className="w-5 h-5" />
              <span>Save Notifications</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 