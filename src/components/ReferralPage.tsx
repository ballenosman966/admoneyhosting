import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Copy, 
  Share2, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Gift,
  Star,
  Check
} from 'lucide-react';
import { userStorage, User, ReferralRecord } from '../utils/userStorage';
import Aurora from './Aurora';
// Framer Motion removed

interface ReferralPageProps {
  onBack: () => void;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ onBack }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [referralHistory, setReferralHistory] = useState<ReferralRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'rewards'>('overview');

  useEffect(() => {
    const user = userStorage.getCurrentUser();
    console.log('ReferralPage - Current user:', user);
    if (user) {
      setCurrentUser(user);
      setReferralHistory(user.referralHistory || []);
    }
  }, []);

  const copyReferralCode = async () => {
    if (currentUser?.referralCode) {
      try {
        const referralLink = getReferralLink();
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const shareReferralCode = () => {
    const referralLink = `${window.location.origin}?ref=${currentUser?.referralCode}`;
    const shareText = `Join AdMoney and start earning USDT! Use my referral link: ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join AdMoney',
        text: shareText,
        url: referralLink
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getReferralLink = () => {
    return `${window.location.origin}?ref=${currentUser?.referralCode}`;
  };

  const getStatusIcon = (status: 'active' | 'inactive') => {
    return status === 'active' ? 
      <CheckCircle className="w-4 h-4 text-green-400" /> : 
      <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusText = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading Referral Page...</div>
          <div className="text-white/60">Please wait while we load your referral data</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
            Referral Program
          </h1>
          <p className="text-white/80 text-base sm:text-lg">
            Invite friends and earn rewards together
          </p>
        </div>

        {/* Stats Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              icon: <Users className="w-8 h-8 text-purple-400 drop-shadow-glow" />,
              value: currentUser?.referralCount || 0,
              label: 'Total Referrals',
              color: 'from-purple-400 to-pink-400'
            },
            {
              icon: <DollarSign className="w-8 h-8 text-green-400 drop-shadow-glow" />,
              value: `$${(currentUser?.referralEarnings || 0).toFixed(2)}`,
              label: 'Total Earnings',
              color: 'from-green-400 to-blue-400'
            },
            {
              icon: <Gift className="w-8 h-8 text-yellow-400 drop-shadow-glow" />,
              value: '$2.00',
              label: 'Per Referral',
              color: 'from-yellow-400 to-orange-400'
            }
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card border border-white/10 rounded-2xl p-6 text-center backdrop-blur-lg"
            >
              {stat.icon}
              <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent drop-shadow-lg block mt-2`}>
                {stat.value}
              </span>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div
          className="glass-card border border-yellow-400/30 shadow-2xl rounded-3xl p-8 mb-8 backdrop-blur-xl"
        >
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Your Referral Link
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={getReferralLink()}
                readOnly
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none"
              />
          <button
                onClick={copyReferralCode}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </button>
            </div>

            <div className="flex space-x-4">
                  <button
                    onClick={copyReferralCode}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold hover:from-yellow-500 hover:to-orange-500 transition-colors shadow-lg"
              >
                <Copy className="w-5 h-5 inline mr-2" />
                Copy Link
                  </button>
                  <button
                    onClick={shareReferralCode}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold hover:from-green-500 hover:to-blue-500 transition-colors shadow-lg"
                  >
                <Share2 className="w-5 h-5 inline mr-2" />
                Share
                  </button>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 backdrop-blur-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Referral History
          </h2>
          
          <div className="space-y-4">
            {referralHistory.length > 0 ? (
              referralHistory.map((referral, index) => (
                <div
                  key={referral.id}
                  className="bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200"
                >
                      <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                      <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                      <p className="text-white font-semibold">{referral.referredUsername}</p>
                      <p className="text-white/60 text-sm">Joined {formatDate(referral.joinDate)}</p>
                          </div>
                        </div>
                  <div className="flex items-center space-x-2">
                          {getStatusIcon(referral.status)}
                    <span className={`text-sm font-medium ${
                            referral.status === 'active' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {getStatusText(referral.status)}
                          </span>
                        </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 text-lg">No referrals yet</p>
                <p className="text-white/40 text-sm">Share your link to start earning!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 