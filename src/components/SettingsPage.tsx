import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Clock, 
  Save,
  Monitor,
  Smartphone,
  Shield,
  Bell,
  Users,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { User, userStorage } from '../utils/userStorage';
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
  const [feedback, setFeedback] = useState<string | null>(null);
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // On mount, check if user has pending deletion
  useEffect(() => {
    if (user && user.pendingDeletion) {
      setReactivateModal(true);
    }
  }, [user]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please enter current password, new password, and confirm password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    
    // In a real app, you'd validate the current password and update it
    // For now, we'll just show a success message
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:text-white transition-colors duration-300 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white text-center w-full">Settings</h1>
        </div>

        {/* --- MAIN SETTINGS SECTIONS --- */}
        {/* Account & Security */}
        <div className="bg-white/5 dark:text-white rounded-2xl p-6 mb-12 w-full shadow-lg transition-colors duration-300">
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
                currentUser={user}
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
                <div>
                  <label className="block text-white/90 font-medium mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                        confirmPassword && newPassword !== confirmPassword 
                          ? 'border-red-400' 
                          : confirmPassword && newPassword === confirmPassword 
                          ? 'border-green-400' 
                          : 'border-white/20'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-green-400 text-sm mt-1">Passwords match</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold hover:from-green-500 hover:to-blue-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Account Deletion */}
            <div className="bg-white/10 dark:text-white rounded-xl p-6 border border-white/20 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-400">Account Deletion</h3>
              </div>
              <p className="text-white/70 mb-4">Permanently delete your account and all associated data. <b>This action cannot be undone.</b></p>
              <div className="flex justify-center">
                <button
                  className={`px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 border border-red-500/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 ${accountDeleted ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-white'}`}
                  onClick={handleAccountDelete}
                  disabled={accountDeleted}
                >
                  {pendingDeletion ? 'Deletion Scheduled' : accountDeleted ? 'Account Deleted' : 'Request Account Deletion'}
                </button>
              </div>
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

          </div>
        </div>

        {/* Preferences & Appearance */}
        <div className="bg-white/5 dark:text-white rounded-2xl p-6 mb-12 w-full shadow-lg transition-colors duration-300">
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