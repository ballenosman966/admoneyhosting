import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft,
  CheckCircle,
  Shield,
  DollarSign,
  Loader2,
  AlertCircle,
  Info,
  Gift,
  MailCheck,
  XCircle,
  Globe
} from 'lucide-react';
import { userStorage } from '../utils/userStorage';

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
  onAuth: (userData: { email?: string; password: string; username?: string; firstName?: string; lastName?: string; country?: string; referralCode?: string; referrerId?: string }) => void;
  onBack: () => void;
  onResetPassword: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuth, onBack, onResetPassword, isLoading, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Get referral ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlReferrerId = urlParams.get('ref');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    country: '',
    referralCode: '',
    referrerId: urlReferrerId || ''
  });

  // Check if this is the first user (after admin) - make it reactive
  const [isFirstUserState, setIsFirstUserState] = useState(() => userStorage.isFirstUser());
  
  // Update first user state when form data changes
  useEffect(() => {
    setIsFirstUserState(userStorage.isFirstUser());
  }, [formData.username, formData.email]); // Re-check when user starts typing

  // Force refresh first user state when switching between login/signup
  const handleToggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', confirmPassword: '', username: '', firstName: '', lastName: '', country: '', referralCode: '', referrerId: '' });
    setUsernameValidation({ length: false, characters: false, available: true });
    setEmailValidation({ format: false, exists: false });
    // Force refresh first user state
    setIsFirstUserState(userStorage.isFirstUser());
  };

  // Username validation
  const [usernameValidation, setUsernameValidation] = useState({
    length: false,
    characters: false,
    available: true
  });

  // Email validation
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

    // Validate username in real-time
    if (name === 'username' && !isLogin) {
      validateUsername(value);
    }

    // Validate email in real-time
    if (name === 'email') {
      validateEmail(value);
    }
  };

  // Handle form submission
  const handleSubmit = (userData: { email?: string; password: string; username?: string; firstName?: string; lastName?: string; country?: string; referralCode?: string; referrerId?: string }) => {
      onAuth(userData);
  };

  // Remove admin login logic
  // const isAdminLogin = formData.username.toLowerCase() === 'mhamad';

  const benefits = [
    'Earn USDT instantly',
    'Watch ads from anywhere',
    'Secure & anonymous',
    'No personal data required'
  ];

  const usernameRequirements = [
    { label: '3-20 characters', met: usernameValidation.length },
    { label: 'Letters, numbers, and underscores only', met: usernameValidation.characters },
    { label: 'No spaces or special characters', met: usernameValidation.characters },
    { label: 'Username is available', met: usernameValidation.available }
  ];

  // Password validation for signup
  const passwordValidation = {
    length: formData.password.length >= 6,
    match: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute -top-12 sm:-top-16 left-0 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </button>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Start Earning USDT</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join CryptoRewards'}
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              {isLogin ? 'Sign in to continue earning' : 'Create your account and start earning'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                <span className="text-red-400 text-xs sm:text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={e => { e.preventDefault(); handleSubmit(formData); }} className="space-y-4 sm:space-y-6" autoComplete="off">
            {/* Hidden fields to trick password managers */}
            {!isLogin && (
              <>
                <input type="text" style={{ display: 'none' }} autoComplete="username" />
                <input type="password" style={{ display: 'none' }} autoComplete="current-password" />
              </>
            )}
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base ${
                      formData.username ? 
                        (usernameValidation.length && usernameValidation.characters && usernameValidation.available ? 
                          'border-green-400/50 focus:border-green-400' : 
                          'border-red-400/50 focus:border-red-400'
                        ) : 
                        'border-white/20 focus:border-yellow-400'
                    }`}
                    placeholder="Choose a username"
                    required={!isLogin}
                    disabled={isLoading}
                    minLength={3}
                    maxLength={20}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                </div>
                
                {/* Username Requirements */}
                {formData.username && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-xs sm:text-sm font-medium text-white/90">Username Requirements</span>
                    </div>
                    <div className="space-y-1">
                      {usernameRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {requirement.met ? (
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                          ) : (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/40" />
                          )}
                          <span className={`text-xs ${requirement.met ? 'text-green-400' : 'text-white/60'}`}>
                            {requirement.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base"
                    placeholder="First name"
                    required={!isLogin}
                    disabled={isLoading}
                    autoComplete="given-name"
                    autoCorrect="off"
                    autoCapitalize="words"
                    spellCheck="false"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base"
                    placeholder="Last name"
                    required={!isLogin}
                    disabled={isLoading}
                    autoComplete="family-name"
                    autoCorrect="off"
                    autoCapitalize="words"
                    spellCheck="false"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base appearance-none [&>option:first-child]:text-white/50"
                    required={!isLogin}
                    disabled={isLoading}
                    autoComplete="country"
                  >
                    <option value="" disabled>Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country} className="bg-white text-gray-800">
                        {country}
                      </option>
                    ))}
                  </select>
                  <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50 pointer-events-none" />
                </div>
              </div>
            )}

            {isLogin ? (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base"
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base ${
                      formData.email ? 
                        (emailValidation.format && !emailValidation.exists ? 
                          'border-green-400/50 focus:border-green-400' : 
                          'border-red-400/50 focus:border-red-400'
                        ) : 
                        'border-white/20 focus:border-yellow-400'
                    }`}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                </div>
                
                {/* Email Validation Messages */}
                {formData.email && (
                  <div className="mt-1 sm:mt-2">
                    {!emailValidation.format && (
                      <p className="text-xs text-red-400">Please enter a valid email address</p>
                    )}
                    {emailValidation.format && emailValidation.exists && !isLogin && (
                      <p className="text-xs text-red-400">An account with this email already exists</p>
                    )}
                    {emailValidation.format && !emailValidation.exists && !isLogin && (
                      <p className="text-xs text-green-400">Email is available</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Invite Code <span className="text-white/60">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base ${
                      formData.referralCode ? 
                        (userStorage.checkReferralCodeExists(formData.referralCode) ? 
                          'border-green-400/50 focus:border-green-400' : 
                          'border-red-400/50 focus:border-red-400'
                        ) : 
                        'border-white/20 focus:border-yellow-400'
                    }`}
                    placeholder="Enter invite code (optional)"
                    disabled={isLoading}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                  />
                  <Gift className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                </div>
                {formData.referralCode && (
                  <div className="mt-1 sm:mt-2">
                    {userStorage.checkReferralCodeExists(formData.referralCode) ? (
                      <p className="text-xs text-green-400">✓ Valid invite code! You'll get a $2 signup bonus</p>
                    ) : (
                      <p className="text-xs text-red-400">Invalid invite code</p>
                    )}
                  </div>
                )}
                {formData.referrerId && (
                  <div className="mt-1 sm:mt-2">
                    {userStorage.checkUserIdExists(formData.referrerId) ? (
                      <p className="text-xs text-green-400">✓ Valid invite link! You'll get a $2 signup bonus</p>
                    ) : (
                      <p className="text-xs text-red-400">Invalid invite link</p>
                    )}
                  </div>
                )}
                {!formData.referralCode && !formData.referrerId && (
                  <p className="text-xs text-white/60 mt-1 sm:mt-2">No invite code? You can still create an account!</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full bg-white/10 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all pr-10 sm:pr-12 text-sm sm:text-base ${
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
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-white/60 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all pr-10 sm:pr-12 text-sm sm:text-base ${
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && !passwordValidation.match && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-white/80">
                  <input type="checkbox" className="rounded border-white/20 bg-white/10 text-yellow-400 focus:ring-yellow-400/50" disabled={isLoading} />
                  <span className="text-xs sm:text-sm">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={onResetPassword} 
                  className="text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 transition-colors" 
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLogin && (!usernameValidation.length || !usernameValidation.characters || !usernameValidation.available || !emailValidation.format || emailValidation.exists || !passwordValidation.length || !passwordValidation.match))}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isLoading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />}
              <span>{isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-white/80 text-sm sm:text-base">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={handleToggleAuthMode}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors font-semibold"
                  disabled={isLoading}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

          {/* Benefits */}
          {!isLogin && (
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
              <h3 className="text-sm font-semibold text-white/90 mb-2 sm:mb-3">Why join CryptoRewards?</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs sm:text-sm text-white/80">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-white/80">
                  Your data is protected with bank-level security. We never share your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 