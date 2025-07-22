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
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Clock} from 'lucide-react';
import type { User as UserType } from '../utils/userStorage';
import Aurora from './Aurora';
// Framer Motion removed

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
  'Nepal': '+977',
  'Thailand': '+66',
  'Vietnam': '+84',
  'Malaysia': '+60',
  'Singapore': '+65',
  'Indonesia': '+62',
  'Philippines': '+63',
  'Cambodia': '+855',
  'Myanmar': '+95',
  'Laos': '+856',
  'Brunei': '+673'
};

// Country to timezone mapping
const countryTimezones: { [key: string]: string } = {
  'Afghanistan': 'Asia/Kabul',
  'Albania': 'Europe/Tirane',
  'Algeria': 'Africa/Algiers',
  'Andorra': 'Europe/Andorra',
  'Angola': 'Africa/Luanda',
  'Antigua and Barbuda': 'America/Antigua',
  'Argentina': 'America/Argentina/Buenos_Aires',
  'Armenia': 'Asia/Yerevan',
  'Australia': 'Australia/Sydney',
  'Austria': 'Europe/Vienna',
  'Azerbaijan': 'Asia/Baku',
  'Bahamas': 'America/Nassau',
  'Bahrain': 'Asia/Bahrain',
  'Bangladesh': 'Asia/Dhaka',
  'Barbados': 'America/Barbados',
  'Belarus': 'Europe/Minsk',
  'Belgium': 'Europe/Brussels',
  'Belize': 'America/Belize',
  'Benin': 'Africa/Porto-Novo',
  'Bhutan': 'Asia/Thimphu',
  'Bolivia': 'America/La_Paz',
  'Bosnia and Herzegovina': 'Europe/Sarajevo',
  'Botswana': 'Africa/Gaborone',
  'Brazil': 'America/Sao_Paulo',
  'Brunei': 'Asia/Brunei',
  'Bulgaria': 'Europe/Sofia',
  'Burkina Faso': 'Africa/Ouagadougou',
  'Burundi': 'Africa/Bujumbura',
  'Cabo Verde': 'Atlantic/Cape_Verde',
  'Cambodia': 'Asia/Phnom_Penh',
  'Cameroon': 'Africa/Douala',
  'Canada': 'America/Toronto',
  'Central African Republic': 'Africa/Bangui',
  'Chad': 'Africa/Ndjamena',
  'Chile': 'America/Santiago',
  'China': 'Asia/Shanghai',
  'Colombia': 'America/Bogota',
  'Comoros': 'Indian/Comoro',
  'Congo': 'Africa/Brazzaville',
  'Costa Rica': 'America/Costa_Rica',
  'Croatia': 'Europe/Zagreb',
  'Cuba': 'America/Havana',
  'Cyprus': 'Asia/Nicosia',
  'Czech Republic': 'Europe/Prague',
  'Democratic Republic of the Congo': 'Africa/Kinshasa',
  'Denmark': 'Europe/Copenhagen',
  'Djibouti': 'Africa/Djibouti',
  'Dominica': 'America/Dominica',
  'Dominican Republic': 'America/Santo_Domingo',
  'East Timor': 'Asia/Dili',
  'Ecuador': 'America/Guayaquil',
  'Egypt': 'Africa/Cairo',
  'El Salvador': 'America/El_Salvador',
  'Equatorial Guinea': 'Africa/Malabo',
  'Eritrea': 'Africa/Asmara',
  'Estonia': 'Europe/Tallinn',
  'Eswatini': 'Africa/Mbabane',
  'Ethiopia': 'Africa/Addis_Ababa',
  'Fiji': 'Pacific/Fiji',
  'Finland': 'Europe/Helsinki',
  'France': 'Europe/Paris',
  'Gabon': 'Africa/Libreville',
  'Gambia': 'Africa/Banjul',
  'Georgia': 'Asia/Tbilisi',
  'Germany': 'Europe/Berlin',
  'Ghana': 'Africa/Accra',
  'Greece': 'Europe/Athens',
  'Grenada': 'America/Grenada',
  'Guatemala': 'America/Guatemala',
  'Guinea': 'Africa/Conakry',
  'Guinea-Bissau': 'Africa/Bissau',
  'Guyana': 'America/Guyana',
  'Haiti': 'America/Port-au-Prince',
  'Honduras': 'America/Tegucigalpa',
  'Hungary': 'Europe/Budapest',
  'Iceland': 'Atlantic/Reykjavik',
  'India': 'Asia/Kolkata',
  'Indonesia': 'Asia/Jakarta',
  'Iran': 'Asia/Tehran',
  'Iraq': 'Asia/Baghdad',
  'Ireland': 'Europe/Dublin',
  'Israel': 'Asia/Jerusalem',
  'Italy': 'Europe/Rome',
  'Ivory Coast': 'Africa/Abidjan',
  'Jamaica': 'America/Jamaica',
  'Japan': 'Asia/Tokyo',
  'Jordan': 'Asia/Amman',
  'Kazakhstan': 'Asia/Almaty',
  'Kenya': 'Africa/Nairobi',
  'Kiribati': 'Pacific/Tarawa',
  'Kuwait': 'Asia/Kuwait',
  'Kyrgyzstan': 'Asia/Bishkek',
  'Laos': 'Asia/Vientiane',
  'Latvia': 'Europe/Riga',
  'Lebanon': 'Asia/Beirut',
  'Lesotho': 'Africa/Maseru',
  'Liberia': 'Africa/Monrovia',
  'Libya': 'Africa/Tripoli',
  'Liechtenstein': 'Europe/Vaduz',
  'Lithuania': 'Europe/Vilnius',
  'Luxembourg': 'Europe/Luxembourg',
  'Madagascar': 'Indian/Antananarivo',
  'Malawi': 'Africa/Blantyre',
  'Malaysia': 'Asia/Kuala_Lumpur',
  'Maldives': 'Indian/Maldives',
  'Mali': 'Africa/Bamako',
  'Malta': 'Europe/Malta',
  'Marshall Islands': 'Pacific/Majuro',
  'Mauritania': 'Africa/Nouakchott',
  'Mauritius': 'Indian/Mauritius',
  'Mexico': 'America/Mexico_City',
  'Micronesia': 'Pacific/Pohnpei',
  'Moldova': 'Europe/Chisinau',
  'Monaco': 'Europe/Monaco',
  'Mongolia': 'Asia/Ulaanbaatar',
  'Montenegro': 'Europe/Podgorica',
  'Morocco': 'Africa/Casablanca',
  'Mozambique': 'Africa/Maputo',
  'Myanmar': 'Asia/Yangon',
  'Namibia': 'Africa/Windhoek',
  'Nauru': 'Pacific/Nauru',
  'Nepal': 'Asia/Kathmandu',
  'Netherlands': 'Europe/Amsterdam',
  'New Zealand': 'Pacific/Auckland',
  'Nicaragua': 'America/Managua',
  'Niger': 'Africa/Niamey',
  'Nigeria': 'Africa/Lagos',
  'North Korea': 'Asia/Pyongyang',
  'North Macedonia': 'Europe/Skopje',
  'Norway': 'Europe/Oslo',
  'Oman': 'Asia/Muscat',
  'Pakistan': 'Asia/Karachi',
  'Palau': 'Pacific/Palau',
  'Palestine': 'Asia/Gaza',
  'Panama': 'America/Panama',
  'Papua New Guinea': 'Pacific/Port_Moresby',
  'Paraguay': 'America/Asuncion',
  'Peru': 'America/Lima',
  'Philippines': 'Asia/Manila',
  'Poland': 'Europe/Warsaw',
  'Portugal': 'Europe/Lisbon',
  'Qatar': 'Asia/Qatar',
  'Romania': 'Europe/Bucharest',
  'Russia': 'Europe/Moscow',
  'Rwanda': 'Africa/Kigali',
  'Saint Kitts and Nevis': 'America/St_Kitts',
  'Saint Lucia': 'America/St_Lucia',
  'Saint Vincent and the Grenadines': 'America/St_Vincent',
  'Samoa': 'Pacific/Apia',
  'San Marino': 'Europe/San_Marino',
  'Sao Tome and Principe': 'Africa/Sao_Tome',
  'Saudi Arabia': 'Asia/Riyadh',
  'Senegal': 'Africa/Dakar',
  'Serbia': 'Europe/Belgrade',
  'Seychelles': 'Indian/Mahe',
  'Sierra Leone': 'Africa/Freetown',
  'Singapore': 'Asia/Singapore',
  'Slovakia': 'Europe/Bratislava',
  'Slovenia': 'Europe/Ljubljana',
  'Solomon Islands': 'Pacific/Guadalcanal',
  'Somalia': 'Africa/Mogadishu',
  'South Africa': 'Africa/Johannesburg',
  'South Korea': 'Asia/Seoul',
  'South Sudan': 'Africa/Juba',
  'Spain': 'Europe/Madrid',
  'Sri Lanka': 'Asia/Colombo',
  'Sudan': 'Africa/Khartoum',
  'Suriname': 'America/Paramaribo',
  'Sweden': 'Europe/Stockholm',
  'Switzerland': 'Europe/Zurich',
  'Syria': 'Asia/Damascus',
  'Taiwan': 'Asia/Taipei',
  'Tajikistan': 'Asia/Dushanbe',
  'Tanzania': 'Africa/Dar_es_Salaam',
  'Thailand': 'Asia/Bangkok',
  'Togo': 'Africa/Lome',
  'Tonga': 'Pacific/Tongatapu',
  'Trinidad and Tobago': 'America/Port_of_Spain',
  'Tunisia': 'Africa/Tunis',
  'Turkey': 'Europe/Istanbul',
  'Turkmenistan': 'Asia/Ashgabat',
  'Tuvalu': 'Pacific/Funafuti',
  'Uganda': 'Africa/Kampala',
  'Ukraine': 'Europe/Kiev',
  'United Arab Emirates': 'Asia/Dubai',
  'United Kingdom': 'Europe/London',
  'United States': 'America/New_York',
  'Uruguay': 'America/Montevideo',
  'Uzbekistan': 'Asia/Tashkent',
  'Vanuatu': 'Pacific/Efate',
  'Vatican City': 'Europe/Vatican',
  'Venezuela': 'America/Caracas',
  'Vietnam': 'Asia/Ho_Chi_Minh',
  'Yemen': 'Asia/Aden',
  'Zambia': 'Africa/Lusaka',
  'Zimbabwe': 'Africa/Harare'
};

// Timezone display names

interface ProfilePageProps {
  user: UserType;
  onUserUpdate: (user: UserType) => void;
  navigate: (path: string) => void; // Make navigate required
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate, navigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage || null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New state for verification and settings
  const [verificationStatus, setVerificationStatus] = useState({
    emailVerified: user.isEmailVerified || false,
    phoneVerified: user.isPhoneVerified || false,
    kycVerified: user.kycData?.status === 'approved' || false,
    kycStatus: user.kycData?.status || 'not_submitted' // not_submitted, pending, approved, rejected
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: user.profileVisibility || 'public', // public, private, friends
    showEmail: user.showEmail || false,
    showPhone: user.showPhone || false,
    showReferralStats: user.showReferralStats || true
  });
  
  const [socialLinks, setSocialLinks] = useState({
    instagram: user.socialLinks?.instagram || '',
    twitter: user.socialLinks?.twitter || '',
    facebook: user.socialLinks?.facebook || '',
    linkedin: user.socialLinks?.linkedin || '',
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
  const [locationDetected, setLocationDetected] = useState(false);
  const [isSocialEditing, setIsSocialEditing] = useState(false);
  
  // Form states
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
    timezone: user.timezone || 'UTC',
    language: user.language || 'en',
    birthday: user.birthday || ''
  });

    // Auto-detect location using timezone only (no external APIs)
  const detectUserLocation = () => {
    if (locationDetected || formData.country) return; // Don't override existing data
    
    try {
      // Use browser timezone to detect country
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Detected timezone:', timezone);
       
      const timezoneToCountry: { [key: string]: string } = {
        'America/New_York': 'United States',
        'America/Los_Angeles': 'United States', 
        'America/Chicago': 'United States',
        'America/Denver': 'United States',
        'America/Toronto': 'Canada',
        'America/Vancouver': 'Canada',
        'Europe/London': 'United Kingdom',
        'Europe/Berlin': 'Germany',
        'Europe/Paris': 'France',
        'Europe/Rome': 'Italy',
        'Europe/Madrid': 'Spain',
        'Europe/Amsterdam': 'Netherlands',
        'Europe/Brussels': 'Belgium',
        'Europe/Zurich': 'Switzerland',
        'Europe/Vienna': 'Austria',
        'Europe/Stockholm': 'Sweden',
        'Europe/Oslo': 'Norway',
        'Europe/Copenhagen': 'Denmark',
        'Europe/Helsinki': 'Finland',
        'Asia/Tokyo': 'Japan',
        'Asia/Shanghai': 'China',
        'Asia/Seoul': 'South Korea',
        'Asia/Kolkata': 'India',
        'Asia/Baghdad': 'Iraq',
        'Asia/Kuwait': 'Kuwait',
        'Asia/Riyadh': 'Saudi Arabia',
        'Asia/Dubai': 'United Arab Emirates',
        'Australia/Sydney': 'Australia',
        'Australia/Melbourne': 'Australia'
      };
       
      const countryFromTimezone = timezoneToCountry[timezone];
      if (countryFromTimezone && countryCodes[countryFromTimezone]) {
        console.log(`Timezone detection found: ${countryFromTimezone} with code: ${countryCodes[countryFromTimezone]}`);
        setFormData(prev => ({
          ...prev,
          country: countryFromTimezone,
          countryCode: countryCodes[countryFromTimezone]
        }));
        setLocationDetected(true);
      } else {
        console.log('Timezone not found in mapping:', timezone);
      }
       
    } catch (error) {
      console.log('Timezone location detection failed:', error);
    }
  };

  // Manual country override for development/testing
  const setManualLocation = (country: string) => {
    if (countryCodes[country]) {
      setFormData(prev => ({
        ...prev,
        country: country,
        countryCode: countryCodes[country]
      }));
      setLocationDetected(true);
    }
  };

  // Run location detection on component mount
  useEffect(() => {
    detectUserLocation();
  }, []); // Empty dependency array to run only once

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setShowImageUpload(false);
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
      timezone: formData.timezone,
      language: formData.language,
      birthday: formData.birthday,
      profileImage: profileImage || undefined
    } as any;
    
    onUserUpdate(updatedUser);
    setIsEditing(false);
  };




  // Verification functions
  const sendVerificationCode = (type: 'email' | 'phone') => {
    setVerificationType(type);
    setShowVerificationModal(true);
    // Simulate sending verification code
    setTimeout(() => {
      alert(`${type === 'email' ? 'Email' : 'SMS'} verification code sent! Check your ${type === 'email' ? 'email' : 'phone'}.`);
    }, 1000);
  };

  const verifyCode = () => {
    if (verificationCode.length === 6) {
      // Simulate verification
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
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(user.referralCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = user.referralCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
          // Show error message to user
          alert('Failed to copy referral code. Please copy it manually: ' + user.referralCode);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Show error message to user
      alert('Failed to copy referral code. Please copy it manually: ' + user.referralCode);
    }
  };

  const updatePrivacySettings = (setting: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    onUserUpdate({ ...user, [setting]: value });
  };

  const updateSocialLinks = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
    const updatedSocialLinks = { ...socialLinks, [platform]: value };
    onUserUpdate({ ...user, socialLinks: updatedSocialLinks });
  };

  // Get current time in user's timezone


  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Aurora Animated Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
        </div>
      <div className="relative responsive-container w-full max-w-full px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div
          className="mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            Profile Settings
          </h1>
          <p className="text-white/80 text-base sm:text-lg">
            Manage your account information
          </p>
        </div>

        {/* Profile Picture */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg"
        >
                <div className="text-center">
                  <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-white/50" />
                      )}
                    </div>
                  </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-500 transition-colors"
                      >
                <Camera className="w-4 h-4 text-black" />
                      </button>
            </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
        </div>
              
              {/* Profile Form */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg relative"
        >
          {/* Edit/Save/Cancel Button Group - Top Right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-medium hover:from-yellow-500 hover:to-orange-500 transition-colors shadow-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </>
            )}
              </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Personal Information
          </h2>
              
          <div className="space-y-6">
            {/* First Name and Last Name Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">First Name</label>
                                  <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ color: 'white' }}
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
                  className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ color: 'white' }}
                  placeholder="Last name"
                />
              </div>
          </div>

            {/* Username and Display Name Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Username</label>
                                  <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ color: 'white' }}
                  placeholder="Username"
                />
          </div>

                  <div>
                <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Display Name</label>
                                  <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ color: 'white' }}
                  placeholder="Display name"
                />
              </div>
          </div>

            {/* Email Field */}
                  <div>
              <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Email</label>
                                  <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                style={{ color: 'white' }}
                placeholder="Enter email"
              />
                  </div>

            {/* Birthday Field */}
                  <div>
              <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Birthday</label>
                                  <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                style={{ color: 'white' }}
                max={new Date().toISOString().split('T')[0]}
              />
                  </div>

            {/* Phone Field */}
                  <div>
              <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">
                Phone
              </label>
              <div className="flex space-x-2">
                {/* Country Code Selector */}
                <div className="relative">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    disabled={!isEditing}
                    className={`border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                      isEditing ? 'bg-white/10 hover:bg-white/20 cursor-pointer active:bg-white/30' : 'bg-white/5 cursor-not-allowed opacity-60'
                    } w-16 sm:w-20 z-[100] relative`}
                    style={{ 
                      WebkitAppearance: 'menulist',
                      MozAppearance: 'menulist',
                      appearance: 'menulist',
                      minHeight: '44px',
                      fontSize: '16px',
                      color: 'white'
                    }}
                  >
                    {Object.entries(countryCodes).map(([country, code]) => (
                      <option key={country} value={code} style={{ backgroundColor: 'white', color: 'black' }}>
                        {code}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow - hidden on mobile to avoid conflicts */}
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none hidden sm:flex">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Phone Number Input */}
                                  <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={`flex-1 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base ${
                    isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                  }`}
                  style={{ color: 'white' }}
                  placeholder="Enter phone number"
                />
              </div>
              </div>
              
            {/* Country Field */}
                  <div>
              <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">
                Country
              </label>
              
              <div className="relative">
                    <select
                      value={formData.country}
                  onChange={(e) => {
                    const selectedCountry = e.target.value;
                    setFormData({ 
                      ...formData, 
                      country: selectedCountry,
                      countryCode: countryCodes[selectedCountry] || formData.countryCode
                    });
                  }}
                      disabled={!isEditing}
                  className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base relative z-[100] ${
                    isEditing ? 'bg-white/10 hover:bg-white/20 cursor-pointer active:bg-white/30' : 'bg-white/5 cursor-not-allowed opacity-60'
                  }`}
                  style={{
                    WebkitAppearance: 'menulist',
                    MozAppearance: 'menulist',
                    appearance: 'menulist',
                    minHeight: '44px',
                    fontSize: '16px',
                    color: 'white'
                  }}
                                >
                  <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Select country</option>
                  {Object.keys(countryTimezones).map(country => (
                    <option key={country} value={country} style={{ backgroundColor: 'white', color: 'black' }}>
                      {country}
                    </option>
                  ))}
                </select>
                
                {/* Custom dropdown arrow - hidden on mobile to avoid conflicts */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none hidden sm:flex">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
                  </div>
                </div>

          {/* Bio Field */}
          <div>
            <label className="block text-white/90 font-medium mb-2 text-sm sm:text-base">Bio</label>
                              <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className={`w-full border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all resize-none text-sm sm:text-base ${
                isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
              }`}
              style={{ color: 'white' }}
              placeholder="Tell us about yourself..."
            />
                </div>
          {/* Remove the old button group from the bottom of the form */}
        </div>

        {/* Verification Status Section */}
        <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-8 mb-8 backdrop-blur-lg">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6 text-center">
            Verification Status
          </h2>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {/* Email Verification */}
            <div className="glass-card border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 backdrop-blur-md text-center">
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative">
                  <Mail className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 mx-auto" />
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
              </div>
              {!verificationStatus.emailVerified && (
                <button
                  onClick={() => sendVerificationCode('email')}
                  className="w-full mt-3 sm:mt-4 px-2 sm:px-3 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors"
                >
                  Verify Email
                </button>
              )}
            </div>

            {/* Phone Verification */}
            <div className="glass-card border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 backdrop-blur-md text-center">
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative">
                  <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-400 mx-auto" />
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
              </div>
              {!verificationStatus.phoneVerified && (
                <button
                  onClick={() => sendVerificationCode('phone')}
                  className="w-full mt-3 sm:mt-4 px-2 sm:px-3 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-green-500 hover:to-green-700 transition-colors"
                >
                  Verify Phone
                </button>
              )}
            </div>

            {/* KYC Verification */}
            <div className="glass-card border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 backdrop-blur-md text-center">
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-400 mx-auto" />
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
              </div>
              {verificationStatus.kycStatus === 'not_submitted' && (
                <button
                  onClick={() => navigate('/kyc')}
                  className="w-full mt-3 sm:mt-4 px-2 sm:px-3 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors"
                >
                  Submit KYC
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Referral Code
          </h2>
          
          <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Gift className="w-6 h-6 text-yellow-400" />
                <span className="text-white font-semibold">Your Referral Code</span>
              </div>
              <button
                onClick={copyReferralCode}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
              <code className="text-2xl font-mono text-white font-bold tracking-wider">
                {user.referralCode}
              </code>
            </div>
            
            <p className="text-white/70 text-sm">
              Share this code with friends to earn rewards when they join!
            </p>
          </div>
        </div>

        {/* Referral Statistics Section */}
        <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-8 mb-8 backdrop-blur-lg">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6 text-center">
            Referral Statistics
          </h2>
          
          <div className="grid grid-cols-4 gap-1 sm:gap-3 md:gap-4 lg:gap-6">
            <div className="glass-card border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6 backdrop-blur-md text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-400 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">{referralStats.totalReferrals}</div>
              <div className="text-white/70 text-xs sm:text-sm">Total Referrals</div>
            </div>
            
            <div className="glass-card border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6 backdrop-blur-md text-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-400 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">{referralStats.activeReferrals}</div>
              <div className="text-white/70 text-xs sm:text-sm">Active Referrals</div>
            </div>
            
            <div className="glass-card border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6 backdrop-blur-md text-center">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">${referralStats.totalEarnings.toFixed(2)}</div>
              <div className="text-white/70 text-xs sm:text-sm">Total Earnings</div>
            </div>
            
            <div className="glass-card border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6 backdrop-blur-md text-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-400 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">${referralStats.pendingEarnings.toFixed(2)}</div>
              <div className="text-white/70 text-xs sm:text-sm">Pending Earnings</div>
            </div>
          </div>
        </div>


        {/* Social Media Links Section - Redesigned */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Social Media Links
          </h2>
          
            {/* Edit Button */}
            {!isSocialEditing && (
              <button
                onClick={() => setIsSocialEditing(true)}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            </div>
            
          {/* Social Media Links - Full Width Rows */}
          <div className="space-y-4">
            {[
              { platform: 'instagram', icon: Instagram, color: 'text-pink-400', placeholder: 'Enter your Instagram username', label: 'Instagram' },
              { platform: 'facebook', icon: Facebook, color: 'text-blue-600', placeholder: 'Enter your Facebook profile URL', label: 'Facebook' },
              { platform: 'youtube', icon: Youtube, color: 'text-red-500', placeholder: 'Enter your YouTube channel URL', label: 'YouTube' },
            ].map(({ platform, icon: Icon, color, placeholder, label }) => {
              const value = socialLinks[platform as keyof typeof socialLinks];
              const hasValue = value && value.length > 0;
              
              return (
                <div key={platform} className="flex items-center space-x-4">
                  {/* Social Icon */}
                  <div className={`
                    relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full border-2 
                    ${hasValue 
                      ? 'border-green-400/50 bg-green-400/10' 
                      : 'border-white/20 bg-white/5'
                    } 
                    flex items-center justify-center transition-all duration-200
                  `}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
                    
                    {/* Status Indicator */}
                    {hasValue && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
                    )}
        </div>

                  {/* Platform Info and Input */}
                  <div className="flex-1 min-w-0">
                    {/* Platform Label */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium text-sm sm:text-base">
                        {label}
                      </h3>
                      {!isSocialEditing && hasValue && (
                        <span className="text-xs text-green-400 font-medium">✓ Connected</span>
                      )}
            </div>
            
                    {/* Input Field or Display */}
                    {isSocialEditing ? (
              <input
                type="text"
                        value={value}
                        onChange={(e) => updateSocialLinks(platform, e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-sm sm:text-base"
                        placeholder={placeholder}
                      />
                    ) : (
                      <div className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-sm sm:text-base">
                        {hasValue ? (
                          <span className="text-white">
                            {platform === 'instagram' ? `@${value}` : value}
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
            
          {/* Save Button */}
          {isSocialEditing && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  // Save social links - they're already updated in real-time via updateSocialLinks
                  setIsSocialEditing(false);
                }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-medium hover:from-yellow-500 hover:to-orange-500 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Links</span>
              </button>
            </div>
          )}
          
          {/* Instructions */}
          <p className="text-white/60 text-xs text-center mt-4">
            {isSocialEditing 
              ? "Enter your usernames or profile URLs above" 
              : "Click 'Edit' to add your social media links"
            }
          </p>
        </div>

        {/* Verification Modal */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card border border-white/10 rounded-3xl p-8 backdrop-blur-lg max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">
                Verify {verificationType === 'email' ? 'Email' : 'Phone'}
              </h3>
              <p className="text-white/70 mb-6">
                Enter the 6-digit verification code sent to your {verificationType === 'email' ? 'email' : 'phone'}.
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all bg-white/10 text-center text-2xl font-mono tracking-widest mb-6"
                placeholder="000000"
                maxLength={6}
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    setVerificationCode('');
                    setVerificationType(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyCode}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-colors"
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