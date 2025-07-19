import React, { useState, useRef } from 'react';
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
  
  // Form states
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    displayName: user.displayName || user.username,
    bio: user.bio || '',
    phone: user.phone || '',
    country: user.country || '',
    timezone: user.timezone || 'UTC',
    language: user.language || 'en',
    birthday: user.birthday || ''
  });


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
      country: formData.country,
      timezone: formData.timezone,
      language: formData.language,
      birthday: formData.birthday,
      profileImage: profileImage || undefined
    };
    
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
  const getCurrentTimeInTimezone = () => {
    if (!formData.timezone) return null;
    
    try {
      const now = new Date();
      const timeInTimezone = now.toLocaleString('en-US', {
        timeZone: formData.timezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      return timeInTimezone;
    } catch (error) {
      return null;
    }
  };


  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Aurora Animated Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
        </div>
      <div className="relative responsive-container w-full max-w-full px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div
          className="mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-8"
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
          <div className="absolute top-6 right-8 z-20 flex space-x-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold hover:from-yellow-500 hover:to-orange-500 transition-colors shadow-lg flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            )}
              </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Personal Information
          </h2>
              
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
              <label className="block text-white/90 font-medium mb-2">First Name</label>
                  <input
                    type="text"
                      value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                      placeholder="Enter first name"
                    />
          </div>

                  <div>
              <label className="block text-white/90 font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                      value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                      placeholder="Enter last name"
                    />
          </div>

                  <div>
              <label className="block text-white/90 font-medium mb-2">Username</label>
                  <input
                    type="text"
                      value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                      placeholder="Enter username"
                    />
          </div>

                  <div>
              <label className="block text-white/90 font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                      value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                      placeholder="Enter display name"
                    />
          </div>

                  <div>
              <label className="block text-white/90 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
              <label className="block text-white/90 font-medium mb-2">Birthday</label>
                    <input
                      type="date"
                      value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
              <label className="block text-white/90 font-medium mb-2">Phone</label>
                  <input
                      type="tel"
                      value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
                      placeholder="Enter phone number"
                    />
              </div>
              
                  <div>
              <label className="block text-white/90 font-medium mb-2">Country</label>
                    <select
                      value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isEditing}
                className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all ${
                  isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
                }`}
              >
                <option value="">Select country</option>
                {Object.keys(countryTimezones).map(country => (
                  <option key={country} value={country} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                    {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

          <div className="mt-6">
            <label className="block text-white/90 font-medium mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
              rows={4}
              className={`w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all resize-none ${
                isEditing ? 'bg-white/10' : 'bg-white/5 cursor-not-allowed'
              }`}
                    placeholder="Tell us about yourself..."
                  />
                </div>
          {/* Remove the old button group from the bottom of the form */}
        </div>

        {/* Verification Status Section */}
        <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Verification Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Verification */}
            <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <span className="text-white font-semibold">Email</span>
                </div>
                {verificationStatus.emailVerified ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <p className="text-white/70 text-sm mb-4">
                {verificationStatus.emailVerified ? 'Email verified successfully' : 'Email not verified'}
              </p>
              {!verificationStatus.emailVerified && (
                <button
                  onClick={() => sendVerificationCode('email')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-colors"
                >
                  Verify Email
                </button>
              )}
            </div>

            {/* Phone Verification */}
            <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-6 h-6 text-green-400" />
                  <span className="text-white font-semibold">Phone</span>
                </div>
                {verificationStatus.phoneVerified ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <p className="text-white/70 text-sm mb-4">
                {verificationStatus.phoneVerified ? 'Phone verified successfully' : 'Phone not verified'}
              </p>
              {!verificationStatus.phoneVerified && (
                <button
                  onClick={() => sendVerificationCode('phone')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-lg hover:from-green-500 hover:to-teal-500 transition-colors"
                >
                  Verify Phone
                </button>
              )}
            </div>

            {/* KYC Verification */}
            <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                  <span className="text-white font-semibold">KYC</span>
                </div>
                {verificationStatus.kycVerified ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : verificationStatus.kycStatus === 'pending' ? (
                  <Clock className="w-6 h-6 text-yellow-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <p className="text-white/70 text-sm mb-4">
                {verificationStatus.kycVerified ? 'KYC approved' : 
                 verificationStatus.kycStatus === 'pending' ? 'KYC under review' :
                 verificationStatus.kycStatus === 'rejected' ? 'KYC rejected' : 'KYC not submitted'}
              </p>
              {verificationStatus.kycStatus === 'not_submitted' && (
                <button
                  onClick={() => navigate('/kyc')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
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
        <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Referral Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{referralStats.totalReferrals}</div>
              <div className="text-white/70 text-sm">Total Referrals</div>
            </div>
            
            <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{referralStats.activeReferrals}</div>
              <div className="text-white/70 text-sm">Active Referrals</div>
            </div>
            
            <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">${referralStats.totalEarnings.toFixed(2)}</div>
              <div className="text-white/70 text-sm">Total Earnings</div>
            </div>
            
            <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-md text-center">
              <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">${referralStats.pendingEarnings.toFixed(2)}</div>
              <div className="text-white/70 text-sm">Pending Earnings</div>
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Privacy Settings
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 glass-card border border-white/10 rounded-2xl backdrop-blur-md">
              <div>
                <h3 className="text-white font-semibold mb-1">Profile Visibility</h3>
                <p className="text-white/70 text-sm">Control who can see your profile</p>
              </div>
              <select
                value={privacySettings.profileVisibility}
                onChange={(e) => updatePrivacySettings('profileVisibility', e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 glass-card border border-white/10 rounded-2xl backdrop-blur-md">
              <div>
                <h3 className="text-white font-semibold mb-1">Show Email</h3>
                <p className="text-white/70 text-sm">Display email on public profile</p>
              </div>
              <button
                onClick={() => updatePrivacySettings('showEmail', !privacySettings.showEmail)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.showEmail 
                    ? 'bg-gradient-to-r from-green-400 to-teal-400' 
                    : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  privacySettings.showEmail ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 glass-card border border-white/10 rounded-2xl backdrop-blur-md">
              <div>
                <h3 className="text-white font-semibold mb-1">Show Phone</h3>
                <p className="text-white/70 text-sm">Display phone on public profile</p>
              </div>
              <button
                onClick={() => updatePrivacySettings('showPhone', !privacySettings.showPhone)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.showPhone 
                    ? 'bg-gradient-to-r from-green-400 to-teal-400' 
                    : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  privacySettings.showPhone ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 glass-card border border-white/10 rounded-2xl backdrop-blur-md">
              <div>
                <h3 className="text-white font-semibold mb-1">Show Referral Stats</h3>
                <p className="text-white/70 text-sm">Display referral statistics publicly</p>
              </div>
              <button
                onClick={() => updatePrivacySettings('showReferralStats', !privacySettings.showReferralStats)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.showReferralStats 
                    ? 'bg-gradient-to-r from-green-400 to-teal-400' 
                    : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  privacySettings.showReferralStats ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Social Media Links
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-pink-400" />
                <span>Instagram</span>
              </label>
              <input
                type="text"
                value={socialLinks.instagram}
                onChange={(e) => updateSocialLinks('instagram', e.target.value)}
                className="w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all bg-white/10"
                placeholder="Your Instagram username"
              />
            </div>
            
            <div>
              <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                <span>Twitter</span>
              </label>
              <input
                type="text"
                value={socialLinks.twitter}
                onChange={(e) => updateSocialLinks('twitter', e.target.value)}
                className="w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all bg-white/10"
                placeholder="Your Twitter username"
              />
            </div>
            
            <div>
              <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Facebook</span>
              </label>
              <input
                type="text"
                value={socialLinks.facebook}
                onChange={(e) => updateSocialLinks('facebook', e.target.value)}
                className="w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all bg-white/10"
                placeholder="Your Facebook profile URL"
              />
            </div>
            
            <div>
              <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                <Linkedin className="w-5 h-5 text-blue-500" />
                <span>LinkedIn</span>
              </label>
              <input
                type="text"
                value={socialLinks.linkedin}
                onChange={(e) => updateSocialLinks('linkedin', e.target.value)}
                className="w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all bg-white/10"
                placeholder="Your LinkedIn profile URL"
              />
            </div>
            
            <div>
              <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <span>YouTube</span>
              </label>
              <input
                type="text"
                value={socialLinks.youtube}
                onChange={(e) => updateSocialLinks('youtube', e.target.value)}
                className="w-full border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all bg-white/10"
                placeholder="Your YouTube channel URL"
              />
            </div>
          </div>
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