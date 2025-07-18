import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowLeft,
  XCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { userStorage } from '../utils/userStorage';

interface ResetPasswordPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check for pending OTP on component mount
  useEffect(() => {
    const pendingOtp = localStorage.getItem('forgotPasswordOtp');
    const pendingEmail = localStorage.getItem('forgotPasswordEmail');
    if (pendingOtp && pendingEmail) {
      setOtp(pendingOtp);
      setEmail(pendingEmail);
      setStep('otp');
    }
  }, []);

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Check if email exists
    if (!userStorage.checkEmailExists(email)) {
      setError('No account found with this email address');
      setIsLoading(false);
      return;
    }

    try {
      // Generate OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(generatedOtp);
      
      // Store OTP in localStorage for demo
      localStorage.setItem('forgotPasswordOtp', generatedOtp);
      localStorage.setItem('forgotPasswordEmail', email);
      
      setStep('otp');
      setError('');
    } catch (err) {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setError('');

    if (otpInput === otp) {
      setStep('password');
      setError('');
    } else {
      setError('Incorrect code. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError('');

    // Validate new password
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Update password
      userStorage.updateUserPasswordByEmail(email, newPassword);
      
      // Clear all reset data
      localStorage.removeItem('forgotPasswordOtp');
      localStorage.removeItem('forgotPasswordEmail');
      
      setIsSuccess(true);
      
      // Show success for 2 seconds then redirect
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Clear any stored data when going back
    localStorage.removeItem('forgotPasswordOtp');
    localStorage.removeItem('forgotPasswordEmail');
    onBack();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        
        <div className="relative w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successfully!</h2>
              <p className="text-white/70 mb-6">You can now sign in with your new password.</p>
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white/60 animate-spin mr-2" />
                <span className="text-white/60">Redirecting to login...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute -top-16 left-0 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-white/70">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'otp' && 'Enter the 6-digit code sent to your email'}
              {step === 'password' && 'Create your new password'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>
              
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Send Reset Code</span>
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Verification Code
                </label>
                <div className="text-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-32 text-center text-xl font-mono bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="------"
                    autoFocus
                  />
                  <p className="text-white/60 text-sm mt-2">
                    Demo code: <span className="font-mono text-yellow-400">{otp}</span>
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otpInput.length !== 6}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Verify Code</span>
              </button>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter new password"
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleResetPassword}
                disabled={isLoading || newPassword.length < 6 || newPassword !== confirmNewPassword}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Reset Password</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 