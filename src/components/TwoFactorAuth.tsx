import React, { useState, useEffect } from 'react';

interface TwoFactorAuthProps {
  onClose: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onClose }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');

  useEffect(() => {
    // Load 2FA status from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsEnabled(user.twoFactorEnabled || false);
  }, []);

  const generateSecret = () => {
    // Generate a random secret (in production, this would be done server-side)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateQRCode = (secret: string, email: string) => {
    // Generate QR code URL for authenticator apps
    const issuer = 'USDT Rewards';
    const account = email;
    const url = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
    
    // For demo purposes, we'll create a simple QR code representation
    // In production, you'd use a QR code library
    return url;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const handleEnable2FA = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newSecret = generateSecret();
    setSecret(newSecret);
    setQrCode(generateQRCode(newSecret, user.email || 'user@example.com'));
    setShowSetup(true);
    setStep('setup');
  };

  const handleVerifyCode = () => {
    // In production, this would verify the code server-side
    // For demo purposes, we'll accept any 6-digit code
    if (verificationCode.length === 6) {
      setStep('backup');
      setBackupCodes(generateBackupCodes());
    } else {
      alert('Please enter a valid 6-digit code');
    }
  };

  const handleCompleteSetup = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.twoFactorEnabled = true;
    user.twoFactorSecret = secret;
    user.backupCodes = backupCodes;
    localStorage.setItem('user', JSON.stringify(user));
    
    setIsEnabled(true);
    setShowSetup(false);
    setStep('setup');
    setVerificationCode('');
    setBackupCodes([]);
    onClose();
  };

  const handleDisable2FA = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.twoFactorEnabled = false;
    delete user.twoFactorSecret;
    delete user.backupCodes;
    localStorage.setItem('user', JSON.stringify(user));
    setIsEnabled(false);
  };

  if (showSetup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Two-Factor Authentication</h3>
            <button
              onClick={() => {
                setShowSetup(false);
                setStep('setup');
                setVerificationCode('');
                setBackupCodes([]);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {step === 'setup' && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-medium text-white mb-2">Step 1: Scan QR Code</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code:
                </p>
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs">QR Code Placeholder</p>
                      <p className="text-xs mt-1">Secret: {secret}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">
                  Can't scan? Enter this code manually: <code className="bg-gray-700 px-2 py-1 rounded">{secret}</code>
                </p>
              </div>
              <button
                onClick={() => setStep('verify')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Next: Verify Code
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Step 2: Verify Code</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Enter the 6-digit code from your authenticator app:
                </p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setStep('setup')}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyCode}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {step === 'backup' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Step 3: Backup Codes</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device:
                </p>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="bg-gray-600 px-3 py-2 rounded text-center font-mono text-white">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-yellow-400 text-xs mt-2">
                  ⚠️ Store these codes securely. Each code can only be used once.
                </p>
              </div>
              <button
                onClick={handleCompleteSetup}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Two-Factor Authentication</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-white">
              {isEnabled ? 'Two-Factor Authentication is enabled' : 'Two-Factor Authentication is disabled'}
            </span>
          </div>

          <p className="text-gray-300 text-sm">
            Two-factor authentication adds an extra layer of security to your account by requiring a code from your authenticator app in addition to your password.
          </p>

          {isEnabled ? (
            <div className="space-y-3">
              <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-green-400 font-semibold">Security Enhanced</p>
                    <p className="text-green-300 text-sm">Your account is protected with 2FA</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDisable2FA}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnable2FA}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Enable 2FA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth; 