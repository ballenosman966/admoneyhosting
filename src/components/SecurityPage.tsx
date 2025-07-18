import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Key,
  ArrowLeft,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { User } from '../utils/userStorage';

interface SecurityPageProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onBack: () => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ user, onUserUpdate, onBack }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorAuth || false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    if (passwords.current !== user.password) {
      alert('Current password is incorrect');
      return;
    }
    
    if (passwords.new.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }

    const updatedUser = {
      ...user,
      password: passwords.new
    };
    
    onUserUpdate(updatedUser);
    setPasswords({ current: '', new: '', confirm: '' });
    alert('Password changed successfully!');
  };

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      alert('Two-factor authentication setup would be implemented here. For now, it\'s enabled.');
      setTwoFactorEnabled(true);
    } else {
      if (confirm('Are you sure you want to disable two-factor authentication?')) {
        setTwoFactorEnabled(false);
        alert('Two-factor authentication disabled');
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-white">Security</h1>
        </div>

        <div className="space-y-6">
          {/* Password Change */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Change Password</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 pr-12"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                <Save className="w-5 h-5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                {twoFactorEnabled ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                )}
                <div>
                  <p className="text-white font-medium">
                    {twoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled'}
                  </p>
                  <p className="text-white/60 text-sm">
                    {twoFactorEnabled 
                      ? 'Your account is protected with an additional security layer'
                      : 'Add an extra layer of security to your account'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  twoFactorEnabled
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-yellow-400 text-black hover:bg-yellow-300'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Security Tips</h3>
            <div className="space-y-3 text-white/80">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use a strong, unique password that you don't use elsewhere</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Enable two-factor authentication for additional security</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Never share your login credentials with anyone</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Log out from shared devices and clear browser data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 