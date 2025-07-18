import React, { useState, useRef } from 'react';
import { 
  User, 
  Eye, 
  EyeOff, 
  Save, 
  Edit3, 
  Camera,
  Download,
  Trash2,
  Mail, 
  Smartphone,
  Globe,
  Upload,
  X,
  Gift
} from 'lucide-react';
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
const timezoneDisplayNames: { [key: string]: string } = {
  'UTC': 'UTC (Coordinated Universal Time)',
  'Asia/Kabul': 'Afghanistan Time (AFT)',
  'Europe/Tirane': 'Central European Time (CET)',
  'Africa/Algiers': 'Central European Time (CET)',
  'Europe/Andorra': 'Central European Time (CET)',
  'Africa/Luanda': 'West Africa Time (WAT)',
  'America/Antigua': 'Atlantic Standard Time (AST)',
  'America/Argentina/Buenos_Aires': 'Argentina Time (ART)',
  'Asia/Yerevan': 'Armenia Time (AMT)',
  'Australia/Sydney': 'Australian Eastern Time (AET)',
  'Europe/Vienna': 'Central European Time (CET)',
  'Asia/Baku': 'Azerbaijan Time (AZT)',
  'America/Nassau': 'Eastern Standard Time (EST)',
  'Asia/Bahrain': 'Arabia Standard Time (AST)',
  'Asia/Dhaka': 'Bangladesh Time (BST)',
  'America/Barbados': 'Atlantic Standard Time (AST)',
  'Europe/Minsk': 'Moscow Time (MSK)',
  'Europe/Brussels': 'Central European Time (CET)',
  'America/Belize': 'Central Standard Time (CST)',
  'Africa/Porto-Novo': 'West Africa Time (WAT)',
  'Asia/Thimphu': 'Bhutan Time (BTT)',
  'America/La_Paz': 'Bolivia Time (BOT)',
  'Europe/Sarajevo': 'Central European Time (CET)',
  'Africa/Gaborone': 'Central Africa Time (CAT)',
  'America/Sao_Paulo': 'Brasilia Time (BRT)',
  'Asia/Brunei': 'Brunei Time (BNT)',
  'Europe/Sofia': 'Eastern European Time (EET)',
  'Africa/Ouagadougou': 'Greenwich Mean Time (GMT)',
  'Africa/Bujumbura': 'Central Africa Time (CAT)',
  'Atlantic/Cape_Verde': 'Cape Verde Time (CVT)',
  'Asia/Phnom_Penh': 'Indochina Time (ICT)',
  'Africa/Douala': 'West Africa Time (WAT)',
  'America/Toronto': 'Eastern Standard Time (EST)',
  'Africa/Bangui': 'West Africa Time (WAT)',
  'Africa/Ndjamena': 'West Africa Time (WAT)',
  'America/Santiago': 'Chile Time (CLT)',
  'Asia/Shanghai': 'China Standard Time (CST)',
  'America/Bogota': 'Colombia Time (COT)',
  'Indian/Comoro': 'East Africa Time (EAT)',
  'Africa/Brazzaville': 'West Africa Time (WAT)',
  'America/Costa_Rica': 'Central Standard Time (CST)',
  'Europe/Zagreb': 'Central European Time (CET)',
  'America/Havana': 'Cuba Standard Time (CST)',
  'Asia/Nicosia': 'Eastern European Time (EET)',
  'Europe/Prague': 'Central European Time (CET)',
  'Africa/Kinshasa': 'West Africa Time (WAT)',
  'Europe/Copenhagen': 'Central European Time (CET)',
  'Africa/Djibouti': 'East Africa Time (EAT)',
  'America/Dominica': 'Atlantic Standard Time (AST)',
  'America/Santo_Domingo': 'Atlantic Standard Time (AST)',
  'Asia/Dili': 'East Timor Time (TLT)',
  'America/Guayaquil': 'Ecuador Time (ECT)',
  'Africa/Cairo': 'Eastern European Time (EET)',
  'America/El_Salvador': 'Central Standard Time (CST)',
  'Africa/Malabo': 'West Africa Time (WAT)',
  'Africa/Asmara': 'East Africa Time (EAT)',
  'Europe/Tallinn': 'Eastern European Time (EET)',
  'Africa/Mbabane': 'South Africa Standard Time (SAST)',
  'Africa/Addis_Ababa': 'East Africa Time (EAT)',
  'Pacific/Fiji': 'Fiji Time (FJT)',
  'Europe/Helsinki': 'Eastern European Time (EET)',
  'Europe/Paris': 'Central European Time (CET)',
  'Africa/Libreville': 'West Africa Time (WAT)',
  'Africa/Banjul': 'Greenwich Mean Time (GMT)',
  'Asia/Tbilisi': 'Georgia Time (GET)',
  'Europe/Berlin': 'Central European Time (CET)',
  'Africa/Accra': 'Greenwich Mean Time (GMT)',
  'Europe/Athens': 'Eastern European Time (EET)',
  'America/Grenada': 'Atlantic Standard Time (AST)',
  'America/Guatemala': 'Central Standard Time (CST)',
  'Africa/Conakry': 'Greenwich Mean Time (GMT)',
  'Africa/Bissau': 'Greenwich Mean Time (GMT)',
  'America/Guyana': 'Guyana Time (GYT)',
  'America/Port-au-Prince': 'Eastern Standard Time (EST)',
  'America/Tegucigalpa': 'Central Standard Time (CST)',
  'Europe/Budapest': 'Central European Time (CET)',
  'Atlantic/Reykjavik': 'Greenwich Mean Time (GMT)',
  'Asia/Kolkata': 'India Standard Time (IST)',
  'Asia/Jakarta': 'Western Indonesian Time (WIB)',
  'Asia/Tehran': 'Iran Standard Time (IRST)',
  'Asia/Baghdad': 'Arabia Standard Time (AST)',
  'Europe/Dublin': 'Greenwich Mean Time (GMT)',
  'Asia/Jerusalem': 'Israel Standard Time (IST)',
  'Europe/Rome': 'Central European Time (CET)',
  'Africa/Abidjan': 'Greenwich Mean Time (GMT)',
  'America/Jamaica': 'Eastern Standard Time (EST)',
  'Asia/Tokyo': 'Japan Standard Time (JST)',
  'Asia/Amman': 'Eastern European Time (EET)',
  'Asia/Almaty': 'Kazakhstan Time (ALMT)',
  'Africa/Nairobi': 'East Africa Time (EAT)',
  'Pacific/Tarawa': 'Gilbert Islands Time (GILT)',
  'Asia/Kuwait': 'Arabia Standard Time (AST)',
  'Asia/Bishkek': 'Kyrgyzstan Time (KGT)',
  'Asia/Vientiane': 'Indochina Time (ICT)',
  'Europe/Riga': 'Eastern European Time (EET)',
  'Asia/Beirut': 'Eastern European Time (EET)',
  'Africa/Maseru': 'South Africa Standard Time (SAST)',
  'Africa/Monrovia': 'Greenwich Mean Time (GMT)',
  'Africa/Tripoli': 'Eastern European Time (EET)',
  'Europe/Vaduz': 'Central European Time (CET)',
  'Europe/Vilnius': 'Eastern European Time (EET)',
  'Europe/Luxembourg': 'Central European Time (CET)',
  'Indian/Antananarivo': 'East Africa Time (EAT)',
  'Africa/Blantyre': 'Central Africa Time (CAT)',
  'Asia/Kuala_Lumpur': 'Malaysia Time (MYT)',
  'Indian/Maldives': 'Maldives Time (MVT)',
  'Africa/Bamako': 'Greenwich Mean Time (GMT)',
  'Europe/Malta': 'Central European Time (CET)',
  'Pacific/Majuro': 'Marshall Islands Time (MHT)',
  'Africa/Nouakchott': 'Greenwich Mean Time (GMT)',
  'Indian/Mauritius': 'Mauritius Time (MUT)',
  'America/Mexico_City': 'Central Standard Time (CST)',
  'Pacific/Pohnpei': 'Ponape Time (PONT)',
  'Europe/Chisinau': 'Eastern European Time (EET)',
  'Europe/Monaco': 'Central European Time (CET)',
  'Asia/Ulaanbaatar': 'Ulaanbaatar Time (ULAT)',
  'Europe/Podgorica': 'Central European Time (CET)',
  'Africa/Casablanca': 'Western European Time (WET)',
  'Africa/Maputo': 'Central Africa Time (CAT)',
  'Asia/Yangon': 'Myanmar Time (MMT)',
  'Africa/Windhoek': 'Central Africa Time (CAT)',
  'Pacific/Nauru': 'Nauru Time (NRT)',
  'Asia/Kathmandu': 'Nepal Time (NPT)',
  'Europe/Amsterdam': 'Central European Time (CET)',
  'Pacific/Auckland': 'New Zealand Standard Time (NZST)',
  'America/Managua': 'Central Standard Time (CST)',
  'Africa/Niamey': 'West Africa Time (WAT)',
  'Africa/Lagos': 'West Africa Time (WAT)',
  'Asia/Pyongyang': 'Korea Standard Time (KST)',
  'Europe/Skopje': 'Central European Time (CET)',
  'Europe/Oslo': 'Central European Time (CET)',
  'Asia/Muscat': 'Gulf Standard Time (GST)',
  'Asia/Karachi': 'Pakistan Standard Time (PKT)',
  'Pacific/Palau': 'Palau Time (PWT)',
  'Asia/Gaza': 'Eastern European Time (EET)',
  'America/Panama': 'Eastern Standard Time (EST)',
  'Pacific/Port_Moresby': 'Papua New Guinea Time (PGT)',
  'America/Asuncion': 'Paraguay Time (PYT)',
  'America/Lima': 'Peru Time (PET)',
  'Asia/Manila': 'Philippine Time (PHT)',
  'Europe/Warsaw': 'Central European Time (CET)',
  'Europe/Lisbon': 'Western European Time (WET)',
  'Asia/Qatar': 'Arabia Standard Time (AST)',
  'Europe/Bucharest': 'Eastern European Time (EET)',
  'Europe/Moscow': 'Moscow Time (MSK)',
  'Africa/Kigali': 'Central Africa Time (CAT)',
  'America/St_Kitts': 'Atlantic Standard Time (AST)',
  'America/St_Lucia': 'Atlantic Standard Time (AST)',
  'America/St_Vincent': 'Atlantic Standard Time (AST)',
  'Pacific/Apia': 'Samoa Standard Time (SST)',
  'Europe/San_Marino': 'Central European Time (CET)',
  'Africa/Sao_Tome': 'Greenwich Mean Time (GMT)',
  'Asia/Riyadh': 'Arabia Standard Time (AST)',
  'Africa/Dakar': 'Greenwich Mean Time (GMT)',
  'Europe/Belgrade': 'Central European Time (CET)',
  'Indian/Mahe': 'Seychelles Time (SCT)',
  'Africa/Freetown': 'Greenwich Mean Time (GMT)',
  'Asia/Singapore': 'Singapore Time (SGT)',
  'Europe/Bratislava': 'Central European Time (CET)',
  'Europe/Ljubljana': 'Central European Time (CET)',
  'Pacific/Guadalcanal': 'Solomon Islands Time (SBT)',
  'Africa/Mogadishu': 'East Africa Time (EAT)',
  'Africa/Johannesburg': 'South Africa Standard Time (SAST)',
  'Asia/Seoul': 'Korea Standard Time (KST)',
  'Africa/Juba': 'East Africa Time (EAT)',
  'Europe/Madrid': 'Central European Time (CET)',
  'Asia/Colombo': 'Sri Lanka Time (SLT)',
  'Africa/Khartoum': 'Central Africa Time (CAT)',
  'America/Paramaribo': 'Suriname Time (SRT)',
  'Europe/Stockholm': 'Central European Time (CET)',
  'Europe/Zurich': 'Central European Time (CET)',
  'Asia/Damascus': 'Eastern European Time (EET)',
  'Asia/Taipei': 'Taiwan Time (TWT)',
  'Asia/Dushanbe': 'Tajikistan Time (TJT)',
  'Africa/Dar_es_Salaam': 'East Africa Time (EAT)',
  'Asia/Bangkok': 'Indochina Time (ICT)',
  'Africa/Lome': 'Greenwich Mean Time (GMT)',
  'Pacific/Tongatapu': 'Tonga Time (TOT)',
  'America/Port_of_Spain': 'Atlantic Standard Time (AST)',
  'Africa/Tunis': 'Central European Time (CET)',
  'Europe/Istanbul': 'Eastern European Time (EET)',
  'Asia/Ashgabat': 'Turkmenistan Time (TMT)',
  'Pacific/Funafuti': 'Tuvalu Time (TVT)',
  'Africa/Kampala': 'East Africa Time (EAT)',
  'Europe/Kiev': 'Eastern European Time (EET)',
  'Asia/Dubai': 'Gulf Standard Time (GST)',
  'Europe/London': 'Greenwich Mean Time (GMT)',
  'America/New_York': 'Eastern Standard Time (EST)',
  'America/Montevideo': 'Uruguay Time (UYT)',
  'Asia/Tashkent': 'Uzbekistan Time (UZT)',
  'Pacific/Efate': 'Vanuatu Time (VUT)',
  'Europe/Vatican': 'Central European Time (CET)',
  'America/Caracas': 'Venezuela Time (VET)',
  'Asia/Ho_Chi_Minh': 'Indochina Time (ICT)',
  'Asia/Aden': 'Arabia Standard Time (AST)',
  'Africa/Lusaka': 'Central Africa Time (CAT)',
  'Africa/Harare': 'Central Africa Time (CAT)'
};

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
    language: user.language || 'en'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Automatically set timezone when country is selected
    if (field === 'country' && value && countryTimezones[value]) {
      const timezone = countryTimezones[value];
      console.log('Setting timezone for country:', value, 'to:', timezone);
      setFormData(prev => ({ ...prev, timezone }));
    }
  };

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

  const handleRemoveImage = () => {
    setProfileImage(null);
    setShowImageUpload(false);
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
      profileImage: profileImage || undefined
    };
    
    onUserUpdate(updatedUser);
    setIsEditing(false);
  };

  const exportUserData = () => {
    const dataStr = JSON.stringify(user, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ad-money-data-${user.username}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, you'd call backend API
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  const handleReferralClick = () => {
    navigate('/referrals');
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

  const currentTimeInTimezone = getCurrentTimeInTimezone();

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
      </div>
    </div>
  );
};