import React, { useState, useEffect, useRef } from 'react';
import { Eye, Calendar, Users, TrendingUp, Play, Gift, Coins, Crown, Star, ChevronRight, DollarSign } from 'lucide-react';
import { User, userStorage } from '../utils/userStorage';
import { Page } from '../App';
import Aurora from './Aurora';
import { VIPRewardNotification } from './VIPRewardNotification';
import AnimatedContent from './AnimatedContent';
import BlurText from './BlurText';
// Framer Motion removed

interface DashboardProps {
  onNavigate: (page: Page) => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, onUserUpdate }) => {
  const [showVIPNotification, setShowVIPNotification] = useState(false);
  const [vipRewardAmount, setVipRewardAmount] = useState(0);
  const [vipTierName, setVipTierName] = useState('');
  // Removed showHistory state

  // Process VIP rewards on component mount (only once)
  useEffect(() => {
    const processRewards = () => {
      const beforeBalance = user.balance;
      userStorage.processVIPRewards();
      
      // Check if balance increased (VIP reward was added)
      const updatedUser = userStorage.getCurrentUser();
      if (updatedUser && updatedUser.balance > beforeBalance) {
        const rewardAmount = updatedUser.balance - beforeBalance;
        const vipTier = userStorage.getVIPTier(updatedUser.vipTier!);
        if (vipTier) {
          setVipRewardAmount(rewardAmount);
          setVipTierName(vipTier.name);
          setShowVIPNotification(true);
          onUserUpdate(updatedUser);
        }
      }
    };

    // Only process rewards once when component mounts
    processRewards();
  }, []); // Empty dependency array to run only once

  // Debug: Log user info for admin
  if (user.username === 'mhamad') {
    console.log('Admin user in Dashboard:', user.username);
  }

  // Debug: Log welcome text rendering
  console.log('Dashboard rendering for user:', user.username);
  console.log('Welcome text should show:', `Welcome back, ${user.displayName || user.username}! 👋`);

  // Memoize calculated stats to prevent unnecessary recalculations
  const stats = React.useMemo(() => {
  const adsWatched = Math.floor(user.totalEarned / 0.25); // Assuming $0.25 per ad
  const currentStreak = user.currentStreak || 0; // Use user's actual streak
  const referrals = user.referralCount || 0; // Use user's actual referral count
  const vipTier = user.vipTier ? userStorage.getVIPTier(user.vipTier) : null;

    return { adsWatched, currentStreak, referrals, vipTier };
  }, [user.totalEarned, user.currentStreak, user.referralCount, user.vipTier]);

  // Memoize navigation handlers
  const handleNavigate = React.useCallback((page: Page) => {
    onNavigate(page);
  }, [onNavigate]);

  // Memoize VIP notification close handler
  const handleCloseVIPNotification = React.useCallback(() => {
    setShowVIPNotification(false);
  }, []);

  // Removed conditional rendering for showHistory

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Aurora Animated Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
      </div>
      <div className="relative responsive-container w-full max-w-full px-3 sm:px-4 lg:px-8">
        {/* VIP Reward Notification */}
        {showVIPNotification && (
          <VIPRewardNotification
            amount={vipRewardAmount}
            tierName={vipTierName}
            onClose={handleCloseVIPNotification}
          />
        )}

        {/* Welcome Section */}
        <AnimatedContent distance={50} duration={0.6} delay={0}>
          <div
            className="mt-8 sm:mt-6 lg:mt-8 xl:mt-10 2xl:mt-12 mb-6 sm:mb-8 lg:mb-12 xl:mb-16 2xl:mb-20 text-center sm:text-left"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 lg:mb-4 xl:mb-6 drop-shadow-lg">
              {`Welcome back, ${user.displayName || user.username}!`}
            </h1>
            <p className="text-white/80 text-base sm:text-lg lg:text-xl xl:text-2xl">
              Ready to earn more USDT today?
            </p>
          </div>
        </AnimatedContent>

        {/* Balance Card */}
        <AnimatedContent distance={60} duration={0.7} delay={0.1}>
          <div
            className="glass-card border border-yellow-400/30 shadow-2xl rounded-2xl p-4 sm:p-6 mb-6 w-full max-w-full backdrop-blur-xl"
          >
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex-1">
                <p className="text-white/70 text-xs sm:text-sm mb-1">Current Balance</p>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-xl block">
                  ${user.balance.toFixed(2)}
                </span>
                <p className="text-white/60 text-xs mt-1">USDT</p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-white/70 text-xs sm:text-sm mb-1">Total Earned</p>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg block">
                  ${user.totalEarned.toFixed(2)}
                </span>
                <p className="text-white/60 text-xs">Lifetime</p>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Stats Grid */}
        <AnimatedContent distance={70} duration={0.8} delay={0.2}>
          <div
            className="grid grid-cols-4 gap-2 sm:gap-4 mb-8"
          >
            {[
              {
                icon: <Eye className="text-yellow-400 drop-shadow-lg shadow-yellow-400/30" />,
                value: stats.adsWatched,
                label: 'Ads Watched',
              },
              {
                icon: <Calendar className="text-green-400 drop-shadow-lg shadow-green-400/30" />,
                value: stats.currentStreak,
                label: 'Day Streak',
              },
              {
                icon: <Users className="text-purple-400 drop-shadow-lg shadow-purple-400/30" />,
                value: stats.referrals,
                label: 'Referrals',
              },
              {
                icon: <TrendingUp className="text-pink-400 drop-shadow-lg shadow-pink-400/30" />,
                value: `$${user.referralEarnings.toFixed(2)}`,
                label: 'Referral Earnings',
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                onClick={() => {
                  if (stat.label === 'Ads Watched') {
                    onNavigate('ads');
                  } else if (stat.label === 'Referrals' || stat.label === 'Referral Earnings') {
                    onNavigate('referrals');
                  }
                }}
                className="glass-card border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-lg shadow-xl shadow-black/20 bg-white/5"
              >
                <div className="w-6 h-6 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-yellow-400 drop-shadow-lg shadow-yellow-400/30">
                  {React.cloneElement(stat.icon, { className: 'w-full h-full' })}
                </div>
                <span className="text-sm sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-xl shadow-black/50 block">
                  {stat.value}
                </span>
                <p className="text-white/90 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedContent>

        {/* VIP Status */}
        {stats.vipTier && (
          <AnimatedContent distance={80} duration={0.9} delay={0.3}>
            <div
              className="glass-card border border-purple-400/30 shadow-2xl rounded-3xl p-8 mb-8 w-full max-w-full backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center space-x-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg">
                  <Crown className="w-12 h-12 text-white drop-shadow-glow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                    {stats.vipTier.name}
                  </h3>
                  <p className="text-white/70 text-base">Daily reward: ${stats.vipTier.dailyReward} USDT</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('vip')}
                className="mt-6 sm:mt-0 px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold text-lg hover:bg-yellow-300 transition-colors min-w-[44px] min-h-[44px] shadow-lg"
              >
                View VIP
              </button>
            </div>
          </AnimatedContent>
        )}

        {/* Recent Activity */}
        <AnimatedContent distance={90} duration={1} delay={0.4}>
          <div
            className="glass-card border border-white/10 rounded-3xl p-4 sm:p-6 w-full max-w-full mb-0 sm:mb-2 backdrop-blur-lg"
          >
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-3 sm:mb-4 drop-shadow-lg">
              Recent Activity
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {(user.activityLog && user.activityLog.length > 0) ? (
                user.activityLog.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 bg-white/10 border border-white/10 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-200"
                  >
                    <div className={`p-2 sm:p-3 rounded-full shadow-lg ${
                      activity.type === 'ad' ? 'bg-yellow-400/20' :
                      activity.type === 'referral' ? 'bg-green-500/20' :
                      activity.type === 'withdrawal' ? 'bg-red-500/20' :
                      activity.type === 'deposit' ? 'bg-blue-500/20' :
                      activity.type === 'vip' ? 'bg-purple-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {activity.type === 'ad' && <Play className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />}
                      {activity.type === 'referral' && <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />}
                      {activity.type === 'withdrawal' && <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />}
                      {activity.type === 'deposit' && <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />}
                      {activity.type === 'vip' && <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0 ml-3 sm:ml-4">
                      <p className="text-white text-sm sm:text-base truncate">{activity.message}</p>
                      <p className="text-white/60 text-xs">{activity.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-sm sm:text-base">No recent activity.</p>
              )}
            </div>
          </div>
        </AnimatedContent>


      </div>
    </div>
  );
};