import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  ArrowLeft,
  Shield,
  Loader2,
  AlertCircle,
  Crown
} from 'lucide-react';
import { userStorage } from '../utils/userStorage';

interface AdminLoginPageProps {
  onAdminLogin: (user: any) => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onAdminLogin, onBack, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return;
    }

    try {
      const user = userStorage.authenticateUser(formData.username, formData.password);
      if (user.username === 'mhamad') {
        onAdminLogin(user);
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } catch (error) {
      // Error will be handled by parent component
      throw error;
    }
  };

  const adminFeatures = [
    'User management & analytics',
    'Deposit & withdrawal oversight',
    'System configuration',
    'Security monitoring',
    'Real-time statistics'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute -top-16 left-0 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        {/* Admin Login Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-purple-400/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Crown className="w-4 h-4" />
              <span>Admin Access</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-white/80">
              Access the admin control panel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all"
                  placeholder="Enter admin username"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all pr-12"
                  placeholder="Enter admin password"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.username || !formData.password}
              className="w-full bg-gradient-to-r from-purple-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{isLoading ? 'Authenticating...' : 'Access Admin Panel'}</span>
            </button>
          </form>

          {/* Admin Features */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-sm font-semibold text-white/90 mb-3">Admin Panel Features</h3>
            <div className="space-y-2">
              {adminFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-white/80">
                  <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/80">
                  This is a secure admin area. All actions are logged and monitored for security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 