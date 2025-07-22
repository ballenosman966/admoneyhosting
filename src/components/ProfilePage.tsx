import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Save, 
  Edit3, 
  Camera,
  Mail, 
  Smartphone,
  Gift,
  CheckCircle,
  XCircle,
  Shield,
  Copy,
  Users,
  DollarSign,
  Instagram,
  Facebook,
  Youtube,
  Clock,
  X
} from 'lucide-react';
import type { User as UserType } from '../utils/userStorage';
import Aurora from './Aurora';
import AnimatedContent from './AnimatedContent';

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
  'Brazil': '+55',
  'Mexico': '+52',
  'Argentina': '+54'
};

const countries = Object.keys(countryCodes);

interface ProfilePageProps {
  user: UserType;
  onUserUpdate: (user: UserType) => void;
  navigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate, navigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage || null);
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Verification states
  const [verificationStatus, setVerificationStatus] = useState({
    emailVerified: user.isEmailVerified || false,
    phoneVerified: user.isPhoneVerified || false,
    kycVerified: user.kycData?.status === 'approved' || false,
    kycStatus: user.kycData?.status || 'not_submitted'
  });
  
  const [socialLinks, setSocialLinks] = useState({
    instagram: user.socialLinks?.instagram || '',
    facebook: user.socialLinks?.facebook || '',
    youtube: user.socialLinks?.youtube || ''
  });
  
  const [referralStats, setReferralStats] = useState({
    totalReferrals: user.referralStats?.totalReferrals || 0,
    activeReferrals: user.referralStats?.activeReferrals || 0,
    totalEarnings: user.referralStats?.totalEarnings || 0,
    pendingEarnings: user.referralStats?.pendingEarnings || 0
  });
  
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationType, setVerificationType] = useState<'email' | 'phone' | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSocialEditing, setIsSocialEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    displayName: user.displayName || user.username,
    bio: user.bio || '',
    phone: user.phone || '',
    countryCode: (user as any).countryCode || '+1',
    country: user.country || '',
    birthday: user.birthday || ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setIsEditingPicture(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: formData.displayName,
      bio: formData.bio,
      phone: formData.phone,
      countryCode: formData.countryCode,
      country: formData.country,
      birthday: formData.birthday,
      profileImage: profileImage || undefined
    } as any;
    
    onUserUpdate(updatedUser);
    setIsEditing(false);
  };

  const sendVerificationCode = (type: 'email' | 'phone') => {
    setVerificationType(type);
    setShowVerificationModal(true);
    setTimeout(() => {
      alert(`${type === 'email' ? 'Email' : 'SMS'} verification code sent! Check your ${type === 'email' ? 'email' : 'phone'}.`);
    }, 1000);
  };

  const verifyCode = () => {
    if (verificationCode.length === 6) {
      if (verificationType === 'email') {
        setVerificationStatus(prev => ({ ...prev, emailVerified: true }));
        onUserUpdate({ ...user, isEmailVerified: true });
      } else if (verificationType === 'phone') {
        setVerificationStatus(prev => ({ ...prev, phoneVerified: true }));
        onUserUpdate({ ...user, isPhoneVerified: true });
      }
      setShowVerificationModal(false);
      setVerificationCode('');
      setVerificationType(null);
      alert(`${verificationType === 'email' ? 'Email' : 'Phone'} verified successfully!`);
    } else {
      alert('Please enter a valid 6-digit verification code');
    }
  };

  const copyReferralCode = async () => {
    if (!user?.referralCode) return;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(user.referralCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = user.referralCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy referral code. Please copy it manually: ' + user.referralCode);
    }
  };

  const updateSocialLinks = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
    const updatedSocialLinks = { ...socialLinks, [platform]: value };
    onUserUpdate({ ...user, socialLinks: updatedSocialLinks });
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
        </div>
      
      <div className="relative responsive-container w-full max-w-full px-3 sm:px-4 lg:px-8">
        
        {/* Profile Header */}
        <AnimatedContent distance={50} duration={0.6} delay={0}>
          <div className="mt-8 mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
              My Profile
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Manage your account settings and information
            </p>
          </div>
        </AnimatedContent>

        {/* Profile Picture and Basic Info */}
        <AnimatedContent distance={60} duration={0.7} delay={0.1}>
          <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-white/50" />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors"
                >
                  <Camera className="w-4 h-4 text-black" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {user.displayName || user.username}
                </h2>
                <p className="text-white/60 mb-4">{user.email}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Member Since</span>
                    <p className="text-white font-semibold">
                      {new Date(user.joinDate || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">Total Earned</span>
                    <p className="text-green-400 font-semibold">
                      ${user.totalEarned?.toFixed(2) || '0.00'} USDT
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save/Edit buttons */}
            <div className="flex justify-center mt-6">
              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </AnimatedContent>

        {/* Personal Information */}
        <AnimatedContent distance={70} duration={0.8} delay={0.2}>
          <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
            
                          <div className="space-y-4 sm:space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">First Name</label>
                                  <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                    className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ 
                    color: 'white !important',
                    WebkitTextFillColor: 'white !important',
                    opacity: '1 !important'
                  }}
                  placeholder="First name"
                />
          </div>
                  <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Last Name</label>
                                  <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                    className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ 
                    color: 'white !important',
                    WebkitTextFillColor: 'white !important',
                    opacity: '1 !important'
                  }}
                  placeholder="Last name"
                />
              </div>
          </div>

              {/* Display Name */}
                  <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Display Name</label>
                                  <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ 
                    color: 'white !important',
                    WebkitTextFillColor: 'white !important',
                    opacity: '1 !important'
                  }}
                  placeholder="Display name"
                />
          </div>

              {/* Email */}
                  <div>
              <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Email</label>
                                  <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                style={{ 
                  color: 'white !important',
                  WebkitTextFillColor: 'white !important',
                  opacity: '1 !important'
                }}
                placeholder="Enter email"
              />
                  </div>

              {/* Phone */}
                  <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Phone</label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    disabled={!isEditing}
                    className={`border border-white/20 rounded-lg px-3 py-3 text-white w-full sm:w-24 ${
                      isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed opacity-60'
                    }`}
                    style={{ 
                      color: 'white !important',
                      WebkitTextFillColor: 'white !important',
                      opacity: '1 !important'
                    }}
                  >
                    {Object.entries(countryCodes).map(([country, code]) => (
                      <option key={country} value={code} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                        {code}
                      </option>
                    ))}
                  </select>
                                  <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                    className={`flex-1 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ 
                    color: 'white !important',
                    WebkitTextFillColor: 'white !important',
                    opacity: '1 !important'
                  }}
                  placeholder="Enter phone number"
                />
              </div>
              </div>
              
              {/* Country */}
                  <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Country</label>
                    <select
                      value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed opacity-60'
                  }`}
                  style={{
                    color: 'white !important',
                    WebkitTextFillColor: 'white !important',
                    opacity: '1 !important'
                  }}
                                >
                  <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
                
              {/* Birthday */}
              <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Birthday</label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ 
                    color: 'white !important',
                    WebkitTextFillColor: 'white !important',
                    opacity: '1 !important'
                  }}
                  max={new Date().toISOString().split('T')[0]}
                />
                </div>

              {/* Bio */}
          <div>
            <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Bio</label>
                              <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
                  className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none ${
                isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
              }`}
              style={{ 
                color: 'white !important',
                WebkitTextFillColor: 'white !important',
                opacity: '1 !important'
              }}
              placeholder="Tell us about yourself..."
            />
                </div>
            </div>
        </div>
        </AnimatedContent>

        {/* Verification Status Section */}
        <AnimatedContent distance={80} duration={0.9} delay={0.3}>
          <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 backdrop-blur-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6 text-center">
              Verification Status
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {/* Email Verification */}
              <div className="glass-card border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md text-center">
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <div className="relative">
                    <Mail className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-400 mx-auto" />
                    <div className="absolute -top-1 -right-1">
                {verificationStatus.emailVerified ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 bg-white rounded-full" />
                ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 bg-white rounded-full" />
                )}
              </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">Email</h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">
                    {verificationStatus.emailVerified ? 'Email verified' : 'Email not verified'}
                  </p>
              </div>
              {!verificationStatus.emailVerified && (
                <button
                  onClick={() => sendVerificationCode('email')}
                      className="w-full mt-3 sm:mt-4 px-3 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors"
                >
                  Verify Email
                </button>
              )}
                </div>
            </div>

            {/* Phone Verification */}
              <div className="glass-card border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md text-center">
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative">
                    <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-400 mx-auto" />
                  <div className="absolute -top-1 -right-1">
                {verificationStatus.phoneVerified ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 bg-white rounded-full" />
                ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 bg-white rounded-full" />
                )}
              </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">Phone</h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">
                    {verificationStatus.phoneVerified ? 'Phone verified' : 'Phone not verified'}
                  </p>
              </div>
              {!verificationStatus.phoneVerified && (
                <button
                  onClick={() => sendVerificationCode('phone')}
                      className="w-full mt-3 sm:mt-4 px-3 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-green-500 hover:to-green-700 transition-colors"
                >
                  Verify Phone
                </button>
              )}
                </div>
            </div>

            {/* KYC Verification */}
              <div className="glass-card border border-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md text-center">
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative">
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-400 mx-auto" />
                  <div className="absolute -top-1 -right-1">
                {verificationStatus.kycVerified ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 bg-white rounded-full" />
                ) : verificationStatus.kycStatus === 'pending' ? (
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 bg-white rounded-full" />
                ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 bg-white rounded-full" />
                )}
              </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">KYC</h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">
                {verificationStatus.kycVerified ? 'KYC approved' : 
                     verificationStatus.kycStatus === 'pending' ? 'Under review' :
                 verificationStatus.kycStatus === 'rejected' ? 'KYC rejected' : 'KYC not submitted'}
              </p>
              </div>
              {verificationStatus.kycStatus === 'not_submitted' && (
                <button
                  onClick={() => navigate('/kyc')}
                      className="w-full mt-3 sm:mt-4 px-3 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors"
                >
                  Submit KYC
                </button>
              )}
            </div>
          </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Referral Statistics Section */}
        <AnimatedContent distance={100} duration={1.1} delay={0.5}>
          <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 backdrop-blur-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6 text-center">
              Referral Statistics
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="glass-card border border-white/10 rounded-xl p-3 sm:p-4 lg:p-6 backdrop-blur-md text-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">{referralStats.totalReferrals}</div>
                <div className="text-white/70 text-xs sm:text-sm">Total Referrals</div>
              </div>
              
              <div className="glass-card border border-white/10 rounded-xl p-3 sm:p-4 lg:p-6 backdrop-blur-md text-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">{referralStats.activeReferrals}</div>
                <div className="text-white/70 text-xs sm:text-sm">Active Referrals</div>
              </div>
              
              <div className="glass-card border border-white/10 rounded-xl p-3 sm:p-4 lg:p-6 backdrop-blur-md text-center">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">${referralStats.totalEarnings.toFixed(2)}</div>
                <div className="text-white/70 text-xs sm:text-sm">Total Earnings</div>
              </div>
              
              <div className="glass-card border border-white/10 rounded-xl p-3 sm:p-4 lg:p-6 backdrop-blur-md text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-orange-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">${referralStats.pendingEarnings.toFixed(2)}</div>
                <div className="text-white/70 text-xs sm:text-sm">Pending Earnings</div>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Social Media Links Section */}
        <AnimatedContent distance={110} duration={1.2} delay={0.6}>
          <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-6 mb-8 backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                Social Media Links
            </h2>
            
              {!isSocialEditing && (
                <button
                  onClick={() => setIsSocialEditing(true)}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs sm:text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Edit</span>
                </button>
              )}
              </div>
              
            <div className="space-y-3 sm:space-y-4">
              {[
                { platform: 'instagram', icon: Instagram, color: 'text-pink-400', placeholder: 'Enter your Instagram username', label: 'Instagram' },
                { platform: 'facebook', icon: Facebook, color: 'text-blue-600', placeholder: 'Enter your Facebook profile URL', label: 'Facebook' },
                { platform: 'youtube', icon: Youtube, color: 'text-red-500', placeholder: 'Enter your YouTube channel URL', label: 'YouTube' },
              ].map(({ platform, icon: Icon, color, placeholder, label }) => {
                const value = socialLinks[platform as keyof typeof socialLinks];
                const hasValue = value && value.length > 0;
                
                return (
                  <div key={platform} className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`
                      relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full border-2 
                      ${hasValue ? 'border-green-400/50 bg-green-400/10' : 'border-white/20 bg-white/5'} 
                      flex items-center justify-center transition-all duration-200
                    `}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${color}`} />
                        {hasValue && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white/20 flex items-center justify-center">
                          <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <h3 className="text-white font-medium text-sm sm:text-base">
                          {label}
                        </h3>
                        {!isSocialEditing && hasValue && (
                          <span className="text-xs text-green-400 font-medium">✓ Connected</span>
                        )}
                </div>
                
                        {isSocialEditing ? (
                  <input
                    type="text"
                            value={value}
                            onChange={(e) => updateSocialLinks(platform, e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base"
                            placeholder={placeholder}
                          />
                        ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/10 rounded-lg bg-white/5 overflow-x-auto text-sm sm:text-base">
                            {hasValue ? (
                              <span className="text-white">
                              {platform === 'instagram' ? '@' + value : value}
                              </span>
                            ) : (
                              <span className="text-white/40">Not connected</span>
                            )}
                </div>
                        )}
                    </div>
                  </div>
                );
              })}
              </div>
              
            {isSocialEditing && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <button
                  onClick={() => setIsSocialEditing(false)}
                  className="px-4 sm:px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs sm:text-sm font-medium hover:from-yellow-500 hover:to-orange-500 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Save Links</span>
                </button>
              </div>
            )}
            
            <p className="text-white/60 text-xs text-center mt-3 sm:mt-4">
              {isSocialEditing 
                ? "Enter your usernames or profile URLs above" 
                : "Click 'Edit' to add your social media links"
              }
            </p>
          </div>
        </AnimatedContent>

        {/* Referral Code Section */}
        <AnimatedContent distance={90} duration={1} delay={0.4}>
          <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 backdrop-blur-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6">
              Referral Code
            </h2>
            
            <div className="glass-card border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <span className="text-white font-semibold text-sm sm:text-base">Your Referral Code</span>
                </div>
                <button
                  onClick={copyReferralCode}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-colors text-xs sm:text-sm font-medium"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              
              <div className="bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 mb-4">
                <code className="text-lg sm:text-xl lg:text-2xl font-mono text-white font-bold tracking-wider break-all">
                  {user.referralCode}
                </code>
              </div>
              
              <p className="text-white/70 text-xs sm:text-sm">
                Share this code with friends to earn rewards when they join!
              </p>
            </div>
          </div>
        </AnimatedContent>

        {/* Verification Modal */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-lg max-w-md w-full">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                Verify {verificationType === 'email' ? 'Email' : 'Phone'}
              </h3>
              <p className="text-white/70 mb-6 text-sm sm:text-base">
                Enter the 6-digit verification code sent to your {verificationType === 'email' ? 'email' : 'phone'}.
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 bg-white/10 text-center text-xl sm:text-2xl font-mono tracking-widest mb-6"
                placeholder="000000"
                maxLength={6}
              />
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    setVerificationCode('');
                    setVerificationType(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyCode}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-colors text-sm sm:text-base"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};