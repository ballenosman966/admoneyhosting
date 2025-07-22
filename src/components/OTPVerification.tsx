import React, { useState, useRef, useEffect } from 'react';
import { Mail, Smartphone, Shield, Clock, CheckCircle } from 'lucide-react';

interface OTPVerificationProps {
  onVerified: () => void;
  userEmail?: string;
  userPhone?: string;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  onVerified, 
  userEmail, 
  userPhone, 
  onBack 
}) => {
  const [otpMethod, setOtpMethod] = useState<'email' | 'sms' | 'totp'>('email');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Simple email OTP using EmailJS (FREE)
  const sendEmailOTP = async () => {
    if (!userEmail) return;
    
    setIsLoading(true);
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in localStorage (in production, use secure server-side storage)
      localStorage.setItem('email_otp', otp);
      localStorage.setItem('otp_expires', (Date.now() + 10 * 60 * 1000).toString());
      
      // In production, use actual EmailJS here
      console.log('Email OTP would be sent:', otp);
      
      // For demo, just show success
      setMessage('✅ OTP sent to your email!');
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      setMessage('❌ Failed to send email OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple SMS OTP using TextBee (FREE 300/month)
  const sendSMSOTP = async () => {
    if (!userPhone) return;
    
    setIsLoading(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP
      localStorage.setItem('sms_otp', otp);
      localStorage.setItem('otp_expires', (Date.now() + 10 * 60 * 1000).toString());
      
      // In production, use actual TextBee API here
      console.log('SMS OTP would be sent:', otp);
      
      setMessage('✅ OTP sent to your phone!');
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      setMessage('❌ Failed to send SMS OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-verify when all 6 digits entered
    if (newOtpCode.every(digit => digit !== '') && newOtpCode.join('').length === 6) {
      verifyOTP(newOtpCode.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOTP = (code: string) => {
    const storedOTP = localStorage.getItem(otpMethod === 'email' ? 'email_otp' : 'sms_otp');
    const expires = localStorage.getItem('otp_expires');
    
    if (!storedOTP || !expires) {
      setMessage('❌ No OTP found. Please request a new one.');
      return;
    }
    
    if (Date.now() > parseInt(expires)) {
      setMessage('❌ OTP has expired. Please request a new one.');
      localStorage.removeItem('email_otp');
      localStorage.removeItem('sms_otp');
      localStorage.removeItem('otp_expires');
      return;
    }
    
    if (code === storedOTP) {
      setMessage('✅ Verification successful!');
      localStorage.removeItem('email_otp');
      localStorage.removeItem('sms_otp');
      localStorage.removeItem('otp_expires');
      setTimeout(() => onVerified(), 1000);
    } else {
      setMessage('❌ Invalid OTP. Please try again.');
      setOtpCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const sendOTP = () => {
    if (otpMethod === 'email') {
      sendEmailOTP();
    } else if (otpMethod === 'sms') {
      sendSMSOTP();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Identity</h2>
          <p className="text-white/70">Enter the verification code we sent to you</p>
        </div>

        {/* Method Selection */}
        <div className="flex mb-6 p-1 bg-white/10 rounded-lg">
          <button
            onClick={() => setOtpMethod('email')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
              otpMethod === 'email'
                ? 'bg-yellow-400 text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </button>
          <button
            onClick={() => setOtpMethod('sms')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
              otpMethod === 'sms'
                ? 'bg-yellow-400 text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            SMS
          </button>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex space-x-3 justify-center mb-4">
            {otpCode.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          
          {message && (
            <p className={`text-center text-sm ${
              message.includes('✅') ? 'text-green-400' : 'text-red-400'
            }`}>
              {message}
            </p>
          )}
        </div>

        {/* Send/Resend Button */}
        <button
          onClick={sendOTP}
          disabled={isLoading || !canResend}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? 'Sending...' : canResend ? 'Send OTP' : `Resend in ${timeLeft}s`}
        </button>

        {/* Info */}
        <div className="text-center text-white/60 text-sm mb-4">
          <Clock className="w-4 h-4 inline mr-1" />
          Code expires in 10 minutes
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full text-white/70 hover:text-white text-sm py-2"
        >
          ← Back to signup
        </button>
      </div>
    </div>
  );
}; 