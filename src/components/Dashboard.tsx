import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  DollarSign, 
  Play, 
  Calendar, 
  TrendingUp,
  Eye,
  Users,
  Gift,
  Zap,
  ArrowRight,
  Crown
} from 'lucide-react';
import { Page } from '../App';
import { User } from '../utils/userStorage';
import { userStorage } from '../utils/userStorage';
import { VIPRewardNotification } from './VIPRewardNotification';
import TransactionHistory from './TransactionHistory';
import Aurora from './Aurora';
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
  const stats = useMemo(() => {
  const adsWatched = Math.floor(user.totalEarned / 0.25); // Assuming $0.25 per ad
  const currentStreak = user.currentStreak || 0; // Use user's actual streak
  const referrals = user.referralCount || 0; // Use user's actual referral count
  const vipTier = user.vipTier ? userStorage.getVIPTier(user.vipTier) : null;

    return { adsWatched, currentStreak, referrals, vipTier };
  }, [user.totalEarned, user.currentStreak, user.referralCount, user.vipTier]);

  // Memoize navigation handlers
  const handleNavigate = useCallback((page: Page) => {
    onNavigate(page);
  }, [onNavigate]);

  // Memoize VIP notification close handler
  const handleCloseVIPNotification = useCallback(() => {
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
        <div
          className="mt-4 sm:mt-6 lg:mt-8 xl:mt-10 2xl:mt-12 mb-6 sm:mb-8 lg:mb-12 xl:mb-16 2xl:mb-20"
        >
          <BlurText
            text={`Welcome back, ${user.displayName || user.username}! 👋`}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 lg:mb-4 xl:mb-6 drop-shadow-lg"
            animateBy="words"
            direction="top"
            delay={80}
            animationFrom={undefined}
            animationTo={undefined}
            onAnimationComplete={undefined}
          />
          <p className="text-white/80 text-base sm:text-lg lg:text-xl xl:text-2xl">
            Ready to earn more USDT today?
          </p>
        </div>

        {/* Balance Card */}
        <div
          className="glass-card border border-yellow-400/30 shadow-2xl rounded-3xl p-6 sm:p-10 mb-8 w-full max-w-full backdrop-blur-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 w-full">
            <div>
              <p className="text-white/70 text-sm sm:text-base mb-1">Current Balance</p>
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-xl">
                ${user.balance.toFixed(2)}
              </span>
              <p className="text-white/60 text-sm mt-1">USDT</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-white/70 text-sm mb-1">Total Earned</p>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                ${user.totalEarned.toFixed(2)}
              </span>
              <p className="text-white/60 text-sm">Lifetime</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: <Eye className="w-10 h-10 mx-auto mb-2 text-yellow-400 drop-shadow-glow" />,
              value: stats.adsWatched,
              label: 'Ads Watched',
            },
            {
              icon: <Calendar className="w-10 h-10 mx-auto mb-2 text-green-400 drop-shadow-glow" />,
              value: stats.currentStreak,
              label: 'Day Streak',
            },
            {
              icon: <Users className="w-10 h-10 mx-auto mb-2 text-purple-400 drop-shadow-glow" />,
              value: stats.referrals,
              label: 'Referrals',
            },
            {
              icon: <TrendingUp className="w-10 h-10 mx-auto mb-2 text-pink-400 drop-shadow-glow" />,
              value: `$${user.referralEarnings.toFixed(2)}`,
              label: 'Referral Earnings',
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card border border-white/10 rounded-2xl p-6 text-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer backdrop-blur-lg"
            >
              {stat.icon}
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                {stat.value}
              </span>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* VIP Status */}
        {stats.vipTier && (
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
        )}

        {/* Recent Activity */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 w-full max-w-full mb-8 backdrop-blur-lg"
        >
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {(user.activityLog && user.activityLog.length > 0) ? (
              user.activityLog.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/10 border border-white/10 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className={`p-3 rounded-full shadow-lg ${
                    activity.type === 'ad' ? 'bg-yellow-400/20' :
                    activity.type === 'referral' ? 'bg-green-500/20' :
                    activity.type === 'withdrawal' ? 'bg-red-500/20' :
                    activity.type === 'deposit' ? 'bg-blue-500/20' :
                    activity.type === 'vip' ? 'bg-purple-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    {activity.type === 'ad' && <Play className="w-6 h-6 text-yellow-400" />}
                    {activity.type === 'referral' && <Gift className="w-6 h-6 text-green-400" />}
                    {activity.type === 'withdrawal' && <DollarSign className="w-6 h-6 text-red-400" />}
                    {activity.type === 'deposit' && <DollarSign className="w-6 h-6 text-blue-400" />}
                    {activity.type === 'vip' && <Crown className="w-6 h-6 text-purple-400" />}
                  </div>
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-white text-base truncate">{activity.message}</p>
                    <p className="text-white/60 text-xs">{activity.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-base">No recent activity.</p>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 w-full max-w-full mb-8 backdrop-blur-lg"
        >
          <TransactionHistory user={user} />
        </div>
      </div>
    </div>
  );
};