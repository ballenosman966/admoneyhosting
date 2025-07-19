import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Clock, 
  Save,
  ArrowLeft,
  Monitor,
  Smartphone,
  Shield,
  Bell,
  Users,
  Crown,
  Info,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../utils/userStorage';
import { SessionManager } from './SessionManager';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SettingsPageProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onBack: () => void;
  showSecurityAndNotifications?: boolean;
  onShowNotificationSettings?: () => void;
  onShowTwoFactorAuth?: () => void;
  onShowKYCVerification?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  user, 
  onUserUpdate, 
  onBack, 
  showSecurityAndNotifications,
  onShowNotificationSettings,
  onShowTwoFactorAuth,
  onShowKYCVerification
}) => {
  const [settings, setSettings] = useState({
    language: user.language || 'en',
    sessionTimeout: user.sessionTimeout || 30,
    autoPlayAds: user.autoPlayAds !== false,
    showEarnings: user.showEarnings !== false,
    soundEnabled: user.soundEnabled !== false
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showProfilePublicly, setShowProfilePublicly] = useState(user.showProfilePublicly || false);
  const navigate = useNavigate();
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingDeletion, setPendingDeletion] = useState(false);
  const [reactivateModal, setReactivateModal] = useState(false);
  const [reactivateSuccess, setReactivateSuccess] = useState(false);
  // Add state for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // On mount, check if user has pending deletion
  useEffect(() => {
    if (user && user.pendingDeletion) {
      setReactivateModal(true);
    }
  }, [user]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'showProfilePublicly') {
      setShowProfilePublicly(value);
      onUserUpdate({ ...user, showProfilePublicly: value });
      setFeedback(value ? 'Your profile is now public.' : 'Your profile is now private.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSaveSettings = () => {
    const updatedUser = {
      ...user,
      language: settings.language,
      sessionTimeout: settings.sessionTimeout,
      autoPlayAds: settings.autoPlayAds,
      showEarnings: settings.showEarnings,
      soundEnabled: settings.soundEnabled
    };
    onUserUpdate(updatedUser);
    alert('Settings saved successfully!');
  };

  const handleDownloadData = () => {
    try {
      const dataStr = JSON.stringify(user, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-crypto-rewards-data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setFeedback('Your data has been downloaded.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback('Failed to download data.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleRequestDataDeletion = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setFeedback('Your data deletion request has been submitted.');
    setTimeout(() => setFeedback(null), 3000);
    // Here you would trigger actual deletion logic or API call
  };

  const handleAccountDelete = () => {
    setShowAccountDeleteModal(true);
  };

  const confirmAccountDelete = () => {
    setShowAccountDeleteModal(false);
    setShowPasswordPrompt(true);
    setPasswordInput('');
    setPasswordError('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === user.password) {
      setShowPasswordPrompt(false);
      setPendingDeletion(true);
      setFeedback('Your account is scheduled for deletion in 30 days. You can cancel this request by logging in before then.');
      setAccountDeleted(true);
      // Set pendingDeletion flag in localStorage
      const users = userStorage.getAllUsers().map(u =>
        u.id === user.id ? { ...u, pendingDeletion: true } : u
      );
      localStorage.setItem('adMoneyUsers', JSON.stringify(users));
      userStorage.setCurrentUser(null);
      setTimeout(() => {
        setFeedback(null);
        navigate('/');
        window.location.reload();
      }, 2000);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  // Reactivate account logic
  const handleReactivate = () => {
    // Remove pendingDeletion flag
    const users = userStorage.getAllUsers().map(u =>
      u.id === user.id ? { ...u, pendingDeletion: false } : u
    );
    localStorage.setItem('adMoneyUsers', JSON.stringify(users));
    setReactivateModal(false);
    setReactivateSuccess(true);
    setTimeout(() => setReactivateSuccess(false), 3000);
    // Optionally update user in parent state
    onUserUpdate({ ...user, pendingDeletion: false });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      alert('Please enter both current and new passwords');
      return;
    }
    // In a real app, you'd validate the current password and update it
    // For now, we'll just show a success message
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="self-start mb-2">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white text-center w-full">Settings</h1>
        </div>

        {/* --- MAIN SETTINGS SECTIONS --- */}
        {/* Account & Security */}
        <div className="bg-white/5 dark:text-white rounded-2xl p-6 mb-12 w-full max-w-2xl mx-auto shadow-lg transition-colors duration-300">
          <h2 className="text-2xl font-bold text-white mb-6">Account & Security</h2>
          <div className="space-y-6">
            {/* Manage Sessions/Devices */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Manage Sessions & Devices</h3>
              </div>
              <p className="text-white/70 mb-2">View and log out of your active sessions and devices.</p>
              <SessionManager 
                userId={user.id} 
                onSessionTerminated={() => {
                  // Optionally refresh user data or show notification
                  console.log('Session terminated');
                }}
              />
            </div>
            {/* Security Settings */}
            <motion.div
              className="glass-card border border-white/10 rounded-3xl p-8 backdrop-blur-lg mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Security Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white/90 font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={!currentPassword || !newPassword}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold hover:from-green-500 hover:to-blue-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </motion.div>
            {/* Privacy/Data Controls */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Privacy & Data Controls</h3>
              </div>
              <p className="text-white/70 mb-2">Manage your privacy and data sharing preferences.</p>
              {/* Public Profile Toggle */}
              <div className="flex items-center space-x-2 mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showProfilePublicly}
                    onChange={e => handleSettingChange('showProfilePublicly', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 transition-all duration-300 peer-checked:bg-blue-500 flex items-center px-1">
                    <span className={`transition-all duration-300 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md ${showProfilePublicly ? 'translate-x-6' : 'translate-x-0'}`}>
                      {showProfilePublicly ? (
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      )}
                    </span>
                  </div>
                  <span className="ml-4 text-white text-base font-medium select-none">Show my profile publicly</span>
                </label>
                <span className="ml-2 text-xs text-white/50" title="If enabled, your profile will be visible to other users."><Info className="w-4 h-4" /></span>
              </div>
              {/* Download Data */}
              <button
                className="mr-2 px-4 py-2 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-400"
                onClick={handleDownloadData}
              >
                Download my data
              </button>
              {/* Request Data Deletion */}
              <button
                className="px-4 py-2 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400"
                onClick={handleRequestDataDeletion}
              >
                Request data deletion
              </button>
              {/* Feedback Message */}
              {feedback && <div className="mt-3 text-green-400">{feedback}</div>}
              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg">
                    <h4 className="text-lg font-bold mb-2 text-red-500">Confirm Data Deletion</h4>
                    <p className="mb-4 text-white/80">This will <b>permanently delete</b> your account and all associated data. Are you sure?</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Yes, delete my data
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Account Deletion */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300 mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-7 h-7 text-red-400" />
                <h3 className="text-2xl font-bold text-red-400">Account Deletion</h3>
              </div>
              <p className="text-white/80 mb-4 text-base">Permanently delete your account and all associated data. <b>This action cannot be undone.</b></p>
              <button
                className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200 border border-red-500/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 ${accountDeleted ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-white'}`}
                onClick={handleAccountDelete}
                disabled={accountDeleted}
              >
                {pendingDeletion ? 'Deletion Scheduled' : accountDeleted ? 'Account Deleted' : 'Request Account Deletion'}
              </button>
              {/* Modal for confirmation */}
              {showAccountDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md w-full shadow-xl border border-red-400">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                      <h4 className="text-lg font-bold text-red-500">Confirm Account Deletion</h4>
                    </div>
                    <p className="mb-4 text-gray-800 dark:text-white/80">This will <b>permanently delete</b> your account and all associated data. <br/>This action cannot be undone. Are you absolutely sure?</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={confirmAccountDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                      >
                        Yes, continue
                      </button>
                      <button
                        onClick={() => setShowAccountDeleteModal(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Password Prompt Modal */}
              {showPasswordPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                  <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md w-full shadow-xl border border-blue-400">
                    <h4 className="text-lg font-bold text-blue-500 mb-2">Verify Your Password</h4>
                    <p className="mb-4 text-gray-800 dark:text-white/80">For your security, please enter your password to confirm account deletion.</p>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your password"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      autoFocus
                    />
                    {passwordError && <div className="text-red-500 mb-2 text-sm">{passwordError}</div>}
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswordPrompt(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {/* Feedback Message */}
              {feedback && <div className="mt-4 text-center text-red-400 text-base font-semibold">{feedback}</div>}
            </div>
            {/* Referral/Invite */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Referral & Invite</h3>
              </div>
              <p className="text-white/70 mb-2">Share your referral code and invite friends.</p>
              <div className="bg-white/5 rounded p-3 text-white/80 text-sm">(Referral code and invite link placeholder)</div>
              <button className="mt-3 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 px-4 py-2 rounded">Copy Invite Link</button>
            </div>
          </div>
        </div>

        {/* Preferences & Appearance */}
        <div className="bg-white/5 dark:text-white rounded-2xl p-6 mb-12 w-full max-w-2xl mx-auto shadow-lg transition-colors duration-300">
          <h2 className="text-2xl font-bold text-white mb-6">Preferences & Appearance</h2>
          <div className="space-y-6">
            {/* Currency/Timezone */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Currency & Timezone</h3>
              </div>
              <p className="text-white/70 mb-2">Set your preferred currency and timezone.</p>
              <div className="space-y-2">
                <label className="block text-white/80">Currency</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  <option value="USDT">USDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <label className="block text-white/80 mt-2">Timezone</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>
            {/* Accessibility */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Monitor className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Accessibility</h3>
              </div>
              <p className="text-white/70 mb-2">Adjust accessibility options for a better experience.</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-white">Large Font Size</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-white">High Contrast Mode</span>
                </label>
              </div>
            </div>
            {/* Notification Preferences */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
              </div>
              <p className="text-white/70 mb-2">Choose which notifications you want to receive.</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-white">Email Notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-white">SMS Notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-white">Push Notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Billing & Support */}
        <div className="bg-white/5 dark:text-white rounded-2xl p-6 mb-12 w-full max-w-2xl mx-auto shadow-lg transition-colors duration-300">
          <h2 className="text-2xl font-bold text-white mb-6">Billing & Support</h2>
          <div className="space-y-6">
            {/* Subscription/Billing */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Subscription & Billing</h3>
              </div>
              <p className="text-white/70 mb-2">Manage your subscription plan and billing information.</p>
              <div className="bg-white/5 rounded p-3 text-white/80 text-sm">(Subscription and billing info placeholder)</div>
              <button className="mt-3 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 px-4 py-2 rounded">Manage Subscription</button>
            </div>
            {/* Support/Help */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Support & Help</h3>
              </div>
              <p className="text-white/70 mb-2">Need help? Visit our FAQ or contact support.</p>
              <div className="space-x-4">
                <button className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-4 py-2 rounded">FAQ</button>
                <button className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-4 py-2 rounded">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Reactivate Modal */}
      {reactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md w-full shadow-xl border border-blue-400">
            <h4 className="text-lg font-bold text-blue-500 mb-2">Reactivate Your Account?</h4>
            <p className="mb-4 text-gray-800 dark:text-white/80">Your account is scheduled for deletion in 30 days. Would you like to cancel this request and reactivate your account?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleReactivate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
              >
                Yes, Reactivate
              </button>
              <button
                onClick={() => setReactivateModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                No, Keep Scheduled
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reactivate Success Message */}
      {reactivateSuccess && <div className="mt-4 text-center text-green-400 text-base font-semibold">Your account has been reactivated!</div>}
    </div>
  );
}; 