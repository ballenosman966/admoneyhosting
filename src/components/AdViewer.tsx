import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../App';
import { User, userStorage } from '../utils/userStorage';
import { Play, Pause, SkipForward, Clock, DollarSign, CheckCircle, AlertCircle, RefreshCw, Eye, Users, TrendingUp, Crown } from 'lucide-react';
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

export const AdViewer: React.FC<AdViewerProps> = ({ onNavigate, user, onUserUpdate }) => {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dailyStats, setDailyStats] = useState({
    adsWatched: 0,
    totalEarned: 0,
    dailyLimit: 10 // changed from 20 to 10
  });
  const [showReward, setShowReward] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableAds, setAvailableAds] = useState<Ad[]>([]);
  const progressInterval = useRef<number | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [watchedAds, setWatchedAds] = useState<string[]>([]);
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
  const getDemoAds = (): Ad[] => [
    {
      id: 'demo_1',
      title: 'Latest Gaming Trends 2024',
      description: 'Discover the hottest gaming trends and earn while you learn!',
      youtubeId: 'dQw4w9WgXcQ',
      duration: 30,
      reward: 0.05,
      category: 'gaming',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      requiredWatchTime: 25,
      isActive: true,
      views: 0,
      totalEarnings: 0
    },
    {
      id: 'demo_2',
      title: 'Crypto Investment Guide',
      description: 'Learn about cryptocurrency investments and trading strategies',
      youtubeId: '9bZkp7q19f0',
      duration: 45,
      reward: 0.08,
      category: 'finance',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      requiredWatchTime: 35,
      isActive: true,
      views: 0,
      totalEarnings: 0
    },
    {
      id: 'demo_3',
      title: 'Tech Gadgets Review',
      description: 'Review of the latest tech gadgets and innovations',
      youtubeId: 'kJQP7kiw5Fk',
      duration: 60,
      reward: 0.12,
      category: 'tech',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      requiredWatchTime: 45,
      isActive: true,
      views: 0,
      totalEarnings: 0
    }
  ];

  const todaysAds = getTodaysAds();

  // Load daily stats from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedStats = localStorage.getItem(`adStats_${user.id}_${today}`);
    if (savedStats) {
      setDailyStats(JSON.parse(savedStats));
    }
  }, [user.id]);

  // Save daily stats to localStorage
  const saveDailyStats = (stats: typeof dailyStats) => {
    const today = new Date().toDateString();
    localStorage.setItem(`adStats_${user.id}_${today}`, JSON.stringify(stats));
    setDailyStats(stats);
  };

  // Update ad analytics (views and earnings)
  const updateAdAnalytics = (adId: string, reward: number) => {
    const savedAds = localStorage.getItem('adminAds');
    if (savedAds) {
      const allAds = JSON.parse(savedAds);
      const updatedAds = allAds.map((ad: Ad) => {
        if (ad.id === adId) {
          return {
            ...ad,
            views: ad.views + 1,
            totalEarnings: ad.totalEarnings + reward
          };
        }
        return ad;
      });
      localStorage.setItem('adminAds', JSON.stringify(updatedAds));
      loadAvailableAds(); // Reload to update the display
    }
  };

  // Check if user can watch more ads
  const canWatchMore = dailyStats.adsWatched < dailyStats.dailyLimit;

  // Load watched ads from localStorage on mount or user change
  useEffect(() => {
    const saved = localStorage.getItem(`watchedAds_${user.id}`);
    setWatchedAds(saved ? JSON.parse(saved) : []);
  }, [user.id]);

  // Save watched ads to localStorage
  const saveWatchedAds = (adIds: string[]) => {
    localStorage.setItem(`watchedAds_${user.id}`, JSON.stringify(adIds));
    setWatchedAds(adIds);
  };

  // Start watching an ad
  const startWatching = (ad: Ad) => {
    if (!canWatchMore) {
      setError('Daily ad limit reached. Come back tomorrow!');
      return;
    }

    setCurrentAd(ad);
    setIsWatching(true);
    setIsCompleted(false);
    setWatchProgress(0);
    setWatchTime(0);
    setIsPaused(false);
    setError(null);

    // Start progress tracking for YouTube videos only
    if (ad.youtubeId) {
      progressInterval.current = setInterval(() => {
        setWatchTime(prev => {
          const newTime = prev + 1;
          const progress = (newTime / ad.requiredWatchTime) * 100;
          setWatchProgress(Math.min(progress, 100));
          
          if (newTime >= ad.requiredWatchTime) {
            completeAd(ad);
          }
          return newTime;
        });
      }, 1000);
    }
    // For uploaded videos, progress is tracked via onTimeUpdate
  };

  // Complete watching an ad
  const completeAd = (ad: Ad) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    setIsCompleted(true);
    setIsWatching(false);
    
    let totalReward = ad.reward;
    let vipRewardInfo: { reward: number; isComplete: boolean; progress: number } | null = null;
    
    // Check if user is VIP and process VIP ad reward
    if (isVIP) {
      vipRewardInfo = userStorage.processVIPAdReward(user.id);
      if (vipRewardInfo) {
        totalReward += vipRewardInfo.reward;
        // Update VIP progress state
        setVipProgress(prev => prev ? {
          ...prev,
          adsWatched: vipRewardInfo!.progress,
          rewardPerAd: vipRewardInfo!.reward
        } : null);
      }
    }
    
    // Update user balance with total reward (including VIP bonus)
    const updatedUser = userStorage.addEarnings(user.id, totalReward);
    onUserUpdate(updatedUser);

    // Update daily stats
    const newStats = {
      ...dailyStats,
      adsWatched: dailyStats.adsWatched + 1,
      totalEarned: dailyStats.totalEarned + totalReward
    };
    saveDailyStats(newStats);

    // Update ad analytics
    updateAdAnalytics(ad.id, ad.reward);

    // Show reward animation
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);

    // Update watched ads
    if (!watchedAds.includes(ad.id)) {
      saveWatchedAds([...watchedAds, ad.id]);
    }
  };

  // Pause/Resume ad
  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      // Resume progress tracking for YouTube videos only
      if (currentAd && currentAd.youtubeId) {
        progressInterval.current = setInterval(() => {
          setWatchTime(prev => {
            const newTime = prev + 1;
            const progress = (newTime / currentAd.requiredWatchTime) * 100;
            setWatchProgress(Math.min(progress, 100));
            
            if (newTime >= currentAd.requiredWatchTime) {
              completeAd(currentAd);
            }
            return newTime;
          });
        }, 1000);
      }
      // For uploaded videos, resume is handled by video controls
    } else {
      setIsPaused(true);
      // Pause progress tracking for YouTube videos only
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      // For uploaded videos, pause is handled by video controls
    }
  };

  // Skip ad (with penalty)
  const skipAd = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setIsWatching(false);
    setCurrentAd(null);
    setError('Ad skipped. You must watch the full ad to earn rewards.');
  };

  // Reset daily stats (for testing)
  const resetDailyStats = () => {
    const newStats = {
      adsWatched: 0,
      totalEarned: 0,
      dailyLimit: 20
    };
    saveDailyStats(newStats);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: Ad['category']) => {
    switch (category) {
      case 'gaming': return 'bg-purple-500';
      case 'tech': return 'bg-blue-500';
      case 'lifestyle': return 'bg-green-500';
      case 'finance': return 'bg-yellow-500';
      case 'education': return 'bg-red-500';
      default: return 'bg-gray-500';
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

        {/* Current Ad */}
        {currentAd && (
          <div
            className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-2">
                {currentAd.title}
              </h2>
              <p className="text-white/70 text-base">{currentAd.description}</p>
            </div>

            {/* Video Player */}
            <div className="relative bg-black/20 rounded-2xl overflow-hidden mb-6">
              {currentAd.youtubeId ? (
                <iframe
                  ref={videoRef}
                  src={`https://www.youtube.com/embed/${currentAd.youtubeId}?autoplay=${isWatching ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
                  className="w-full h-64 sm:h-80 lg:h-96"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/50" />
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-white/70 text-sm mb-2">
                <span>{Math.floor(watchTime)}s</span>
                <span>{currentAd.duration}s</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setWatchTime(currentAd.duration)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold hover:from-yellow-500 hover:to-orange-500 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Reward Info */}
            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm mb-2">Reward for completing this ad:</p>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                ${currentAd.reward.toFixed(2)} USDT
              </span>
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
              {getTodaysAds().map((ad, index) => (
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