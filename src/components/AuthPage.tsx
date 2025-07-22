import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, User, ArrowLeft, Loader2, Mail, Globe, Gift, CheckCircle, Info, Smartphone } from 'lucide-react';
import { userStorage } from '../utils/userStorage';
import Aurora from './Aurora';

// Country codes mapping
const countryCodes: { [key: string]: string } = {
  'United States': '+1',
  'Canada': '+1',
  'United Kingdom': '+44',
  'Germany': '+49',
  'France': '+33',
  'Italy': '+39',
  'Spain': '+34',
  'Netherlands': '+31',
  'Belgium': '+32',
  'Switzerland': '+41',
  'Austria': '+43',
  'Sweden': '+46',
  'Norway': '+47',
  'Denmark': '+45',
  'Finland': '+358',
  'Poland': '+48',
  'Czech Republic': '+420',
  'Hungary': '+36',
  'Portugal': '+351',
  'Greece': '+30',
  'Turkey': '+90',
  'Russia': '+7',
  'China': '+86',
  'Japan': '+81',
  'South Korea': '+82',
  'India': '+91',
  'Australia': '+61',
  'New Zealand': '+64',
  'Brazil': '+55',
  'Mexico': '+52',
  'Argentina': '+54',
  'Chile': '+56',
  'Colombia': '+57',
  'Peru': '+51',
  'Venezuela': '+58',
  'South Africa': '+27',
  'Egypt': '+20',
  'Nigeria': '+234',
  'Kenya': '+254',
  'Morocco': '+212',
  'Algeria': '+213',
  'Tunisia': '+216',
  'Libya': '+218',
  'Israel': '+972',
  'Saudi Arabia': '+966',
  'United Arab Emirates': '+971',
  'Qatar': '+974',
  'Kuwait': '+965',
  'Bahrain': '+973',
  'Oman': '+968',
  'Jordan': '+962',
  'Lebanon': '+961',
  'Syria': '+963',
  'Iraq': '+964',
  'Iran': '+98',
  'Afghanistan': '+93',
  'Pakistan': '+92',
  'Bangladesh': '+880',
  'Sri Lanka': '+94',
  'Malaysia': '+60',
  'Singapore': '+65',
  'Thailand': '+66',
  'Vietnam': '+84',
  'Philippines': '+63',
  'Indonesia': '+62'
};

// Country list for dropdown
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort();

interface AuthPageProps {
  onAuth: (userData: { email?: string; password: string; username?: string; firstName?: string; lastName?: string; birthday?: string; phone?: string; countryCode?: string; country?: string; referralCode?: string; referrerId?: string }) => void;
  onBack: () => void;
  onResetPassword: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuth, onBack, onResetPassword, isLoading, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
  // Refs for form fields to enable keyboard navigation
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const countryCodeRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const referralCodeRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  
  // Remove automatic test user creation - new users should start with real accounts
  // useEffect(() => {
  //   userStorage.createTestBallenUser();
  // }, []);
  
  // Detect mobile keyboard opening/closing
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      const viewportHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      
      if (isMobile && viewportHeight < screenHeight * 0.8) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  // Handle Enter key navigation between fields
  const handleKeyDown = (e: React.KeyboardEvent, nextFieldRef: React.RefObject<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };
  
  // Get the next field ref based on current field and form mode
  const getNextFieldRef = (currentField: string): React.RefObject<HTMLElement> | null => {
    if (isLogin) {
      // Login form: username -> password
      if (currentField === 'username') return passwordRef;
      if (currentField === 'password') return null; // Submit form
    } else {
      // Signup form: username -> email -> firstName -> lastName -> birthday -> countryCode -> phone -> country -> referralCode -> password -> confirmPassword
      if (currentField === 'username') return emailRef;
      if (currentField === 'email') return firstNameRef;
      if (currentField === 'firstName') return lastNameRef;
      if (currentField === 'lastName') return birthdayRef;
      if (currentField === 'birthday') return countryCodeRef;
      if (currentField === 'countryCode') return phoneRef;
      if (currentField === 'phone') return countryRef;
      if (currentField === 'country') return referralCodeRef;
      if (currentField === 'referralCode') return passwordRef;
      if (currentField === 'password') return confirmPasswordRef;
      if (currentField === 'confirmPassword') return null; // Submit form
    }
    return null;
  };
  
  // Get referral code from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlReferralCode = urlParams.get('ref');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    birthday: '',
    phone: '',
    countryCode: '+1',
    country: '',
    referralCode: urlReferralCode || '',
    referrerId: ''
  });

  // Validation states
  const [usernameValidation, setUsernameValidation] = useState({
    length: false,
    characters: false,
    available: true
  });

  const [emailValidation, setEmailValidation] = useState({
    format: false,
    exists: false
  });

  const validateUsername = (username: string) => {
    const length = username.length >= 3 && username.length <= 20;
    const characters = /^[a-zA-Z0-9_]+$/.test(username);
    const available = !userStorage.checkUsernameExists(username);
    
    setUsernameValidation({
      length,
      characters,
      available
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const format = emailRegex.test(email);
    const exists = format ? userStorage.checkEmailExists(email) : false;
    
    setEmailValidation({
      format,
      exists
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate in real-time
    if (name === 'username' && !isLogin) {
      validateUsername(value);
    }
    if (name === 'email' && !isLogin) {
      validateEmail(value);
    }
    
    // Auto-update country code when country is selected
    if (name === 'country' && !isLogin && value && countryCodes[value]) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        countryCode: countryCodes[value]
      }));
      return; // Return early since we've already updated formData
    }
    
      // Debug referral code validation
  if (name === 'referralCode' && !isLogin && value) {
    console.log('Checking referral code:', value);
    
    // Ensure all users have referral codes
    userStorage.getAllUsers();
    
    const allUsers = userStorage.getAllUsers();
    console.log('All users:', allUsers.map(u => ({ username: u.username, referralCode: u.referralCode })));
    console.log('Available referral codes:', allUsers.map(u => u.referralCode));
    console.log('Is valid:', userStorage.checkReferralCodeExists(value));
    
    // Check if the entered code matches any user's referral code
    const matchingUser = allUsers.find(u => u.referralCode && u.referralCode.toLowerCase() === value.toLowerCase());
    if (matchingUser) {
      console.log('Found matching user:', matchingUser.username, 'with referral code:', matchingUser.referralCode);
    } else {
      console.log('No matching user found for referral code:', value);
    }
  }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(formData);
  };

  // Password validation for signup
  const passwordValidation = {
    length: formData.password.length >= 6,
    match: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  };

  const usernameRequirements = [
    { label: '3-20 characters', met: usernameValidation.length },
    { label: 'Letters, numbers, underscores only', met: usernameValidation.characters },
    { label: 'Username available', met: usernameValidation.available }
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative transition-all duration-300 ${
      isKeyboardOpen ? 'pt-0 pb-4' : ''
    }`}>
      {/* Background */}
      <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-50" />
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`fixed z-50 flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white font-semibold shadow hover:bg-white/20 transition-all ${
          isKeyboardOpen ? 'top-2 left-2' : 'top-6 left-6'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className={isKeyboardOpen ? 'hidden sm:inline' : ''}>Back</span>
      </button>

      {/* Login Card */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-300 ${
        isKeyboardOpen ? 'mt-8' : ''
      }`}>
        <div className={`bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6 w-full max-w-md mx-auto mt-16`}>
          
          {/* Tab Switcher */}
          <div className="flex bg-white/10 rounded-full p-1 mb-6 relative overflow-hidden">
            {/* Animated background indicator */}
            <div 
              className={`absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 ease-in-out ${
                isLogin ? 'left-1 right-1/2' : 'left-1/2 right-1'
              }`}
            />
            <button
              className={`relative flex-1 py-2 px-4 rounded-full font-bold transition-all duration-300 ease-in-out ${
                isLogin 
                  ? 'text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`relative flex-1 py-2 px-4 rounded-full font-bold transition-all duration-300 ease-in-out ${
                !isLogin 
                  ? 'text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Signup
            </button>
          </div>

          {/* Header with smooth animation */}
          <div className={`text-center transition-all duration-500 ease-in-out ${
            isKeyboardOpen ? 'mb-4' : 'mb-6'
          }`}>
            <h1 className={`font-bold text-white mb-2 transition-all duration-500 ease-in-out ${
              isKeyboardOpen ? 'text-xl' : 'text-2xl'
            }`}>
              {isLogin ? 'Welcome Back' : 'Join AdMoney'}
            </h1>
            <p className={`text-white/80 transition-all duration-500 ease-in-out ${
              isKeyboardOpen ? 'text-xs' : 'text-sm'
            }`}>
              {isLogin ? 'Sign in to continue earning' : 'Create your account and start earning'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  ref={usernameRef}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    const nextField = getNextFieldRef('username');
                    if (nextField) {
                      handleKeyDown(e, nextField);
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                      if (submitButton && !submitButton.disabled) {
                        submitButton.click();
                      }
                    }
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm"
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                  minLength={3}
                  maxLength={20}
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>
              
              {/* Username Requirements - only show for signup */}
              {!isLogin && formData.username && (
                <div className="mt-2 p-2 bg-white/5 rounded border border-white/10">
                  <div className="flex items-center space-x-2 mb-1">
                    <Info className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-medium text-white/90">Requirements</span>
                  </div>
                  <div className="space-y-1">
                    {usernameRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                          <CheckCircle className="w-2.5 h-2.5 text-green-400" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full border border-white/40" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-400' : 'text-white/60'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Email Field - only for signup */}
            {!isLogin && (
              <div className="transition-all duration-500 max-h-24 opacity-100 overflow-hidden">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      ref={emailRef}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const nextField = getNextFieldRef('email');
                        if (nextField) {
                          handleKeyDown(e, nextField);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                          if (submitButton && !submitButton.disabled) {
                            submitButton.click();
                          }
                        }
                      }}
                      className={`w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm ${
                        formData.email ? 
                          (emailValidation.format && !emailValidation.exists ? 
                            'border-green-400/50 focus:border-green-400' : 
                            'border-red-400/50 focus:border-red-400'
                          ) : 
                          'border-white/20 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your email"
                      required={!isLogin}
                      disabled={isLoading}
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                  {formData.email && !emailValidation.format && (
                    <p className="text-xs text-red-400 mt-1">Please enter a valid email</p>
                  )}
                  {formData.email && emailValidation.format && emailValidation.exists && (
                    <p className="text-xs text-red-400 mt-1">Email already exists</p>
                  )}
                </div>
              </div>
            )}

            {/* Name Fields - only for signup */}
            {!isLogin && (
              <div className="transition-all duration-500 max-h-32 opacity-100 overflow-hidden">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      First Name
                    </label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const nextField = getNextFieldRef('firstName');
                        if (nextField) {
                          handleKeyDown(e, nextField);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                          if (submitButton && !submitButton.disabled) {
                            submitButton.click();
                          }
                        }
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm"
                      placeholder="First name"
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Last Name
                    </label>
                    <input
                      ref={lastNameRef}
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const nextField = getNextFieldRef('lastName');
                        if (nextField) {
                          handleKeyDown(e, nextField);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                          if (submitButton && !submitButton.disabled) {
                            submitButton.click();
                          }
                        }
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm"
                      placeholder="Last name"
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Birthday Field - only for signup */}
            {!isLogin && (
              <div className="transition-all duration-500 opacity-100 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Birthday
                  </label>
                  <input
                    ref={birthdayRef}
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const nextField = getNextFieldRef('birthday');
                      if (nextField) {
                        handleKeyDown(e, nextField);
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                        if (submitButton && !submitButton.disabled) {
                          submitButton.click();
                        }
                      }
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm"
                    required={!isLogin}
                    disabled={isLoading}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}

            {/* Phone Field - only for signup */}
            {!isLogin && (
              <div className="transition-all duration-500 opacity-100 relative z-15">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Phone Number
                  </label>
                  <div className="flex space-x-2">
                    {/* Country Code Selector */}
                    <div className="relative">
                      <select
                        ref={countryCodeRef}
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          const nextField = getNextFieldRef('countryCode');
                          if (nextField) {
                            handleKeyDown(e, nextField);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                            if (submitButton && !submitButton.disabled) {
                              submitButton.click();
                            }
                          }
                        }}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm w-20 relative z-30"
                        style={{ 
                          WebkitAppearance: 'menulist',
                          MozAppearance: 'menulist',
                          appearance: 'menulist',
                          minHeight: '44px',
                          fontSize: '16px',
                          color: 'white'
                        }}
                        required={!isLogin}
                        disabled={isLoading}
                      >
                        {Object.entries(countryCodes).map(([country, code]) => (
                          <option key={country} value={code} style={{ backgroundColor: 'white', color: 'black' }}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Phone Number Input */}
                    <div className="relative flex-1">
                      <input
                        ref={phoneRef}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          const nextField = getNextFieldRef('phone');
                          if (nextField) {
                            handleKeyDown(e, nextField);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                            if (submitButton && !submitButton.disabled) {
                              submitButton.click();
                            }
                          }
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm pr-12"
                        placeholder="Enter phone number"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                      <Smartphone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Country Field - only for signup */}
            {!isLogin && (
              <div className="transition-all duration-500 opacity-100 relative z-20">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      ref={countryRef}
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const nextField = getNextFieldRef('country');
                        if (nextField) {
                          handleKeyDown(e, nextField);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                          if (submitButton && !submitButton.disabled) {
                            submitButton.click();
                          }
                        }
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm relative z-30"
                      style={{
                        WebkitAppearance: 'menulist',
                        MozAppearance: 'menulist',
                        appearance: 'menulist',
                        minHeight: '44px',
                        fontSize: '16px',
                        color: 'white'
                      }}
                      required={!isLogin}
                      disabled={isLoading}
                    >
                      <option value="" disabled style={{ backgroundColor: '#1f2937', color: 'white' }}>Select your country</option>
                      {countries.map((country) => (
                        <option key={country} value={country} style={{ backgroundColor: 'white', color: 'black' }}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none hidden sm:block" />
                  </div>
                </div>
              </div>
            )}

            {/* Invite Code - only for signup */}
            {!isLogin && (
              <div className="transition-all duration-500 max-h-28 opacity-100 overflow-hidden">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Invite Code <span className="text-white/60">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={referralCodeRef}
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const nextField = getNextFieldRef('referralCode');
                        if (nextField) {
                          handleKeyDown(e, nextField);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                          if (submitButton && !submitButton.disabled) {
                            submitButton.click();
                          }
                        }
                      }}
                      className={`w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm ${
                        formData.referralCode ? 
                          (userStorage.checkReferralCodeExists(formData.referralCode) ? 
                            'border-green-400/50 focus:border-green-400' : 
                            'border-red-400/50 focus:border-red-400'
                          ) : 
                          'border-white/20 focus:border-yellow-400'
                      }`}
                      placeholder="Enter invite code (optional)"
                      disabled={isLoading}
                    />
                    <Gift className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                  {formData.referralCode && (
                    <p className={`text-xs mt-1 ${userStorage.checkReferralCodeExists(formData.referralCode) ? 'text-green-400' : 'text-red-400'}`}>
                      {userStorage.checkReferralCodeExists(formData.referralCode) ? '✓ Valid invite code!' : 'Invalid invite code'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    const nextField = getNextFieldRef('password');
                    if (nextField) {
                      handleKeyDown(e, nextField);
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                      if (submitButton && !submitButton.disabled) {
                        submitButton.click();
                      }
                    }
                  }}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all pr-12 text-sm ${
                    formData.password ? 
                      (passwordValidation.length ? 
                        'border-green-400/50 focus:border-green-400' : 
                        'border-red-400/50 focus:border-red-400'
                      ) : 
                      'border-white/20 focus:border-yellow-400'
                  }`}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-white/60 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Confirm Password - only for signup */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${!isLogin ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      ref={confirmPasswordRef}
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const nextField = getNextFieldRef('confirmPassword');
                        if (nextField) {
                          handleKeyDown(e, nextField);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                          if (submitButton && !submitButton.disabled) {
                            submitButton.click();
                          }
                        }
                      }}
                      className={`w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all pr-12 text-sm ${
                        formData.confirmPassword ? 
                          (passwordValidation.match ? 
                            'border-green-400/50 focus:border-green-400' : 
                            'border-red-400/50 focus:border-red-400'
                          ) : 
                          'border-white/20 focus:border-yellow-400'
                      }`}
                      placeholder="Confirm your password"
                      required={!isLogin}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordValidation.match && (
                    <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                  )}
                </div>
              )}
            </div>

            {/* Remember me and Forgot password - only for login */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isLogin ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-white/80">
                  <input type="checkbox" className="rounded border-white/20 bg-white/10 text-yellow-400 focus:ring-yellow-400/50 w-4 h-4" disabled={isLoading} />
                  <span className="text-sm">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={onResetPassword} 
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors" 
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!isLogin && (!usernameValidation.length || !usernameValidation.characters || !usernameValidation.available || !emailValidation.format || emailValidation.exists || !passwordValidation.length || !passwordValidation.match))}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span className="transition-all duration-300 ease-in-out">
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}; 