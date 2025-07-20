import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../App';
import { User } from '../utils/userStorage';
import { Play, Crown } from 'lucide-react';
import Aurora from './Aurora';
// Framer Motion removed

interface Ad {
  id: string;
  title: string;
  description: string;
  youtubeId?: string;
  videoFile?: string; // Base64 or file URL
  duration: number; // in seconds
  reward: number; // USDT reward
  category: 'gaming' | 'tech' | 'lifestyle' | 'finance' | 'education';
  thumbnail: string;
  requiredWatchTime: number; // minimum seconds to watch
  isActive: boolean;
  views: number;
  totalEarnings: number;
}

interface AdViewerProps {
  onNavigate: (page: Page) => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export const AdViewer: React.FC<AdViewerProps> = ({ user }) => {
  const [dailyStats, setDailyStats] = useState({
    adsWatched: 0,
    totalEarned: 0,
    dailyLimit: 10 // changed from 20 to 10
  });
  const [availableAds, setAvailableAds] = useState<Ad[]>([]);
  const progressInterval = useRef<number | null>(null);
  const [vipProgress, setVipProgress] = useState<{
    adsWatched: number;
    totalAdsRequired: number;
    dailyReward: number;
    rewardPerAd: number;
  } | null>(null);

  // Check if user is VIP
  const isVIP = !!user.vipTier;

  // Load available ads from admin
  useEffect(() => {
    loadAvailableAds();
  }, []);

  // Load VIP progress
  useEffect(() => {
    if (isVIP && user.vipAdProgress) {
      setVipProgress({
        adsWatched: user.vipAdProgress.adsWatched,
        totalAdsRequired: user.vipAdProgress.totalAdsRequired,
        dailyReward: user.vipAdProgress.dailyReward,
        rewardPerAd: user.vipAdProgress.dailyReward / 10 // changed from 20 to 10
      });
    }
  }, [isVIP, user.vipAdProgress]);

  const loadAvailableAds = () => {
    const savedAds = localStorage.getItem('adminAds');
    if (savedAds) {
      const allAds = JSON.parse(savedAds);
      // Only show active ads
      const activeAds = allAds.filter((ad: Ad) => ad.isActive);
      setAvailableAds(activeAds);
    }
  };

  // Get today's ads (rotate based on date and available ads)
  const getTodaysAds = (): Ad[] => {
    if (availableAds.length === 0) {
      // No ads available
      return [];
    }
    const today = new Date().getDate();
    const startIndex = (today - 1) % availableAds.length;
    const rotatedAds = [...availableAds.slice(startIndex), ...availableAds.slice(0, startIndex)];
    return rotatedAds.slice(0, 3); // Show 3 ads per day
  };

  // Fallback demo ads if no admin ads


  // Load daily stats from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedStats = localStorage.getItem(`adStats_${user.id}_${today}`);
    if (savedStats) {
      setDailyStats(JSON.parse(savedStats));
    }
  }, [user.id]);

  // Save daily stats to localStorage

  // Update ad analytics (views and earnings)

  // Check if user can watch more ads



  // Save watched ads to localStorage

  // Start watching an ad

  // Complete watching an ad

  // Pause/Resume ad

  // Skip ad (with penalty)

  // Reset daily stats (for testing)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);



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
            Watch Ads & Earn USDT
          </h1>
          <p className="text-white/80 text-base sm:text-lg">
            Complete ads to earn instant rewards
          </p>
        </div>

        {/* Daily Stats */}
        <div
          className="glass-card border border-yellow-400/30 shadow-2xl rounded-3xl p-6 mb-8 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">Today's Earnings</p>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                ${dailyStats.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">Ads Watched</p>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                {dailyStats.adsWatched}/{dailyStats.dailyLimit}
              </span>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">Current Balance</p>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                ${user.balance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* VIP Progress */}
        {vipProgress && (
          <div
            className="glass-card border border-purple-400/30 shadow-2xl rounded-3xl p-6 mb-8 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-purple-400 drop-shadow-glow" />
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    VIP Progress
                  </h3>
                  <p className="text-white/70 text-sm">Daily reward: ${vipProgress.dailyReward} USDT</p>
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {vipProgress.adsWatched}/{vipProgress.totalAdsRequired}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              />
            </div>
          </div>
        )}



        {/* Available Ads */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 backdrop-blur-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Available Ads
          </h2>
          {getTodaysAds().length === 0 ? (
            <div className="text-white/60 text-center py-8">No ads available right now.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTodaysAds().map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white/10 border border-white/10 rounded-2xl p-4 hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  <div className="text-center">
                    <Play className="w-8 h-8 text-yellow-400 mx-auto mb-2 drop-shadow-glow" />
                    <h3 className="text-white font-semibold mb-1">{ad.title}</h3>
                    <p className="text-white/70 text-sm mb-2">{ad.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-xs">{ad.duration}s</span>
                      <span className="text-green-400 font-bold">${ad.reward.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};