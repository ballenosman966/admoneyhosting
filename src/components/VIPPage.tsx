import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Star, 
  DollarSign, 
  Calendar,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Zap,
  Users,
  Gift,
  TrendingUp,
  Shield,
  Sparkles,
  Trophy,
  PartyPopper
} from 'lucide-react';
import { User } from '../utils/userStorage';
import { userStorage } from '../utils/userStorage';
import Aurora from './Aurora';
// Remove: import { motion } from 'framer-motion';

interface VIPPageProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onBack: () => void;
}

interface VIPTier {
  id: number;
  name: string;
  price: number;
  dailyReward: number;
  monthlyReward: number;
  yearlyReward: number;
  features: string[];
  color: string;
  popular?: boolean;
}

const vipTiers: VIPTier[] = [
  {
    id: 1,
    name: "VIP 1",
    price: 50,
    dailyReward: 0.60,
    monthlyReward: 18.00,
    yearlyReward: 219.00,
    features: [
      "Daily $0.60 reward (20 ads)",
      "Priority support",
      "Exclusive ads",
      "No withdrawal limits"
    ],
    color: "from-gray-400 to-gray-600"
  },
  {
    id: 2,
    name: "VIP 2",
    price: 125,
    dailyReward: 2.16,
    monthlyReward: 64.80,
    yearlyReward: 788.40,
    features: [
      "Daily $2.16 reward (20 ads)",
      "Priority support",
      "Exclusive ads",
      "No withdrawal limits",
      "Faster withdrawals"
    ],
    color: "from-green-400 to-green-600"
  },
  {
    id: 3,
    name: "VIP 3",
    price: 250,
    dailyReward: 5.16,
    monthlyReward: 154.80,
    yearlyReward: 1883.40,
    features: [
      "Daily $5.16 reward (20 ads)",
      "Priority support",
      "Exclusive ads",
      "No withdrawal limits",
      "Faster withdrawals",
      "VIP chat support"
    ],
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 4,
    name: "VIP 4",
    price: 500,
    dailyReward: 7.16,
    monthlyReward: 214.80,
    yearlyReward: 2613.40,
    features: [
      "Daily $7.16 reward (20 ads)",
      "Priority support",
      "Exclusive ads",
      "No withdrawal limits",
      "Faster withdrawals",
      "VIP chat support",
      "Personal account manager"
    ],
    color: "from-purple-400 to-purple-600"
  },
  {
    id: 5,
    name: "VIP 5",
    price: 1025,
    dailyReward: 11.19,
    monthlyReward: 335.70,
    yearlyReward: 4084.35,
    features: [
      "Daily $11.19 reward (20 ads)",
      "Priority support",
      "Exclusive ads",
      "No withdrawal limits",
      "Faster withdrawals",
      "VIP chat support",
      "Personal account manager",
      "Custom withdrawal times"
    ],
    color: "from-yellow-400 to-orange-500"
  },
  {
    id: 6,
    name: "VIP 6",
    price: 2550,
    dailyReward: 21.22,
    monthlyReward: 636.60,
    yearlyReward: 7745.30,
    features: [
      "Daily $21.22 reward (20 ads)",
      "Priority support",
      "Exclusive ads",
      "No withdrawal limits",
      "Faster withdrawals",
      "VIP chat support",
      "Personal account manager",
      "Custom withdrawal times",
      "Exclusive investment opportunities"
    ],
    color: "from-red-400 to-red-600"
  },
  {
    id: 7,
    name: "VIP 7",
    price: 5250,
    dailyReward: 47.52,
    monthlyReward: 1425.60,
    yearlyReward: 17344.80,
    features: [
      "Daily $47.52 reward (20 ads)",
      "Priority support",
      "Exclusive ads",
      "No withdrawal limits",
      "Faster withdrawals",
      "VIP chat support",
      "Personal account manager",
      "Custom withdrawal times",
      "Exclusive investment opportunities",
      "Premium referral bonuses"
    ],
    color: "from-pink-400 to-pink-600",
    popular: true
  }
];

export const VIPPage: React.FC<VIPPageProps> = ({ user, onUserUpdate, onBack }) => {
  const [selectedTier, setSelectedTier] = useState<VIPTier | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [purchasedTier, setPurchasedTier] = useState<VIPTier | null>(null);
  const [showUpgradeWarning, setShowUpgradeWarning] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeToTier, setUpgradeToTier] = useState<VIPTier | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const userVIPTier = vipTiers.find(tier => tier.id === user.vipTier);
  // Find the latest active VIP subscription record for the current user:
  const latestVIPSub = user.subscriptionHistory?.filter(sub => sub.type === 'vip' && sub.status === 'active').slice(-1)[0];

  const handleSubscribe = (tier: VIPTier) => {
    // Check if user has an active subscription
    if (userStorage.hasActiveSubscription(user.id)) {
      const subscriptionInfo = userStorage.getActiveSubscriptionInfo(user.id);
      alert(`You already have an active ${subscriptionInfo?.type} subscription that expires in ${subscriptionInfo?.daysRemaining} days. You cannot purchase another plan until your current subscription expires.`);
      return;
    }
    
    // Check if user already has a VIP plan
    if (userVIPTier && userVIPTier.id !== tier.id) {
      setSelectedTier(tier);
      setShowUpgradeWarning(true);
    } else {
    setSelectedTier(tier);
      setShowConfirmation(true);
    }
  };

  const handleUpgradeConfirm = () => {
    setShowUpgradeWarning(false);
    setShowConfirmation(true);
  };

  const handleUpgradeCancel = () => {
    setShowUpgradeWarning(false);
    setSelectedTier(null);
  };

  const handleConfirmSubscription = () => {
    if (!selectedTier) return;

    try {
      // Use userStorage to add subscription and deduct balance
      const updatedUser = userStorage.addSubscription(user.id, {
        type: 'vip',
        amount: selectedTier.price,
        duration: 365, // 1 year subscription
        paymentMethod: 'wallet_balance',
        transactionId: `VIP_${Date.now()}`,
        notes: `VIP ${selectedTier.name} subscription purchased with wallet balance`,
        vipTierId: selectedTier.id // Pass the correct VIP tier ID
      });

      // Update the user state
      onUserUpdate(updatedUser);
      setShowConfirmation(false);
      setSelectedTier(null);
      
      // Show congratulations modal
      setPurchasedTier(selectedTier);
      setShowCongratulations(true);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to process subscription'}`);
      setShowConfirmation(false);
      setSelectedTier(null);
    }
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
    setPurchasedTier(null);
  };

  const handleCancelSubscription = () => {
    setShowCancellationModal(true);
  };

  const handleConfirmCancellation = () => {
    try {
      const updatedUser = userStorage.cancelSubscription(user.id, cancellationReason);
      onUserUpdate(updatedUser);
      setShowCancellationModal(false);
      setCancellationReason('');
      alert('Your subscription has been cancelled successfully.');
    } catch (error) {
      alert(`Error cancelling subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpgradeSubscription = (tier: VIPTier) => {
    if (!latestVIPSub) {
      alert('No active subscription to upgrade');
      return;
    }
    
    setUpgradeToTier(tier);
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = () => {
    if (!upgradeToTier) return;

    try {
      // Calculate the price difference
      const currentTier = vipTiers.find(t => t.id === user.vipTier);
      const priceDifference = upgradeToTier.price - (currentTier?.price || 0);
      
      if (priceDifference > 0 && user.balance < priceDifference) {
        alert('Insufficient balance to upgrade. You need additional $' + priceDifference.toFixed(2));
        return;
      }

      // Renew subscription with new tier
      const updatedUser = userStorage.renewSubscription(user.id, {
        type: 'vip',
        amount: upgradeToTier.price,
        duration: 365, // 1 year subscription
        paymentMethod: 'wallet_balance',
        transactionId: `VIP_UPGRADE_${Date.now()}`,
        notes: `Upgraded to ${upgradeToTier.name} subscription`,
        vipTierId: upgradeToTier.id
      });

    onUserUpdate(updatedUser);
      setShowUpgradeModal(false);
      setUpgradeToTier(null);
      alert(`Successfully upgraded to ${upgradeToTier.name}!`);
    } catch (error) {
      alert(`Error upgrading subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getDaysUntilBreakEven = (tier: VIPTier) => {
    return Math.ceil(tier.price / tier.dailyReward);
  };

  // Confetti effect component
  const Confetti = () => {
    const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string, delay: number}>>([]);

    useEffect(() => {
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    }, []);

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    );
  };

  const renderVIPTier = (tier: VIPTier) => (
    <div
      key={tier.id}
      className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 flex flex-col p-6 sm:p-8 ${
        userVIPTier?.id === tier.id ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20' : 'hover:shadow-xl hover:shadow-white/10'
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg`}>
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{tier.name}</h3>
        <div className="text-4xl font-bold text-yellow-400 mb-2">${tier.price}</div>
        <p className="text-white/60 text-sm">One-time payment</p>
      </div>

      {/* Daily Reward */}
      <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
        <p className="text-3xl font-bold text-green-400 mb-1">${tier.dailyReward}</p>
        <p className="text-white/90 text-sm font-semibold">Daily Reward</p>
        <p className="text-white/60 text-xs mt-2">
          ${tier.monthlyReward}/month • ${tier.yearlyReward}/year
        </p>
      </div>

      {/* Break-even Info */}
      <div className="mb-6 p-3 bg-white/5 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm">Break-even:</span>
          <span className="text-yellow-400 font-bold text-sm">{getDaysUntilBreakEven(tier)} days</span>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6 flex-1">
        <h4 className="text-white font-bold mb-3 text-base">Features:</h4>
        <div className="space-y-2">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Button */}
      <div className="mt-auto">
        <button
          onClick={() => handleSubscribe(tier)}
          disabled={userVIPTier?.id === tier.id || user.balance < tier.price || userStorage.hasActiveSubscription(user.id)}
          className={`w-full py-4 rounded-xl font-bold transition-all duration-300 text-base ${
            userVIPTier?.id === tier.id
              ? 'bg-green-500 text-white cursor-not-allowed shadow-lg'
              : user.balance < tier.price
              ? 'bg-red-500 text-white cursor-not-allowed shadow-lg'
              : userStorage.hasActiveSubscription(user.id)
              ? 'bg-gray-500 text-white cursor-not-allowed shadow-lg'
              : `bg-gradient-to-r ${tier.color} text-white hover:scale-105 hover:shadow-xl shadow-lg`
          }`}
        >
          {userVIPTier?.id === tier.id
            ? 'Current Plan'
            : user.balance < tier.price
            ? 'Insufficient Balance'
            : userStorage.hasActiveSubscription(user.id)
            ? 'Active Subscription'
            : userVIPTier
            ? 'Upgrade Plan'
            : 'Subscribe Now'
          }
        </button>
      </div>
    </div>
  );

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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            VIP Membership
            </h1>
          <p className="text-white/80 text-base sm:text-lg">
            Unlock exclusive rewards and higher earnings
          </p>
        </div>

        {/* Enhanced Current VIP Status Card */}
        {userVIPTier && (
          <div className="glass-card border border-purple-400/30 shadow-2xl rounded-3xl p-8 mb-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg">
                  <Crown className="w-12 h-12 text-white drop-shadow-glow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {userVIPTier.name}
                  </h3>
                  <p className="text-white/70 text-base">Daily reward: ${userVIPTier.dailyReward} USDT</p>
                  <p className="text-white/70 text-base">Start: {latestVIPSub?.startDate ? new Date(latestVIPSub.startDate).toLocaleDateString() : '-'}</p>
                  <p className="text-white/70 text-base">End: {latestVIPSub?.endDate ? new Date(latestVIPSub.endDate).toLocaleDateString() : '-'}</p>
                  <p className="text-white/70 text-base">Days left: {latestVIPSub?.endDate ? Math.max(0, Math.ceil((new Date(latestVIPSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : '-'}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[180px]">
                {/* Cancel Plan Button */}
                <button
                  className="glass-card border border-red-400/30 text-red-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-red-400/10 transition"
                  onClick={handleCancelSubscription}
                  disabled={latestVIPSub?.status !== 'active'}
                >
                  Cancel Plan
                </button>
                {/* Upgrade Plan Button */}
                <button
                  className="glass-card border border-blue-400/30 text-blue-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-blue-400/10 transition"
                  onClick={() => setShowUpgradeModal(true)}
                  disabled={latestVIPSub?.status !== 'active'}
                >
                  Upgrade Plan
                </button>
                {/* Renew Plan Button (if <7 days left) */}
                {latestVIPSub?.endDate && Math.ceil((new Date(latestVIPSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 7 && (
                  <button
                    className="glass-card border border-yellow-400/30 text-yellow-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-yellow-400/10 transition"
                    onClick={() => handleConfirmSubscription()}
                  >
                    Renew Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subscription History Table */}
        {user.subscriptionHistory && user.subscriptionHistory.filter(sub => sub.type === 'vip').length > 0 && (
          <div className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
              VIP Subscription History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-white/90">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-4 py-2 text-left">Tier</th>
                    <th className="px-4 py-2 text-left">Start Date</th>
                    <th className="px-4 py-2 text-left">End Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.subscriptionHistory.filter(sub => sub.type === 'vip').map((sub, idx) => (
                    <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white/0' : 'bg-white/5'}>
                      <td className="px-4 py-2">{sub.notes?.includes('VIP') ? sub.notes.split('VIP ')[1].split(' ')[0] : sub.type}</td>
                      <td className="px-4 py-2">{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2">${sub.amount}</td>
                      <td className="px-4 py-2 capitalize">{sub.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIP Tiers */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
            Choose Your VIP Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vipTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-105 ${
                  userVIPTier?.id === tier.id
                    ? 'glass-card border-purple-400/50 shadow-2xl'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                {userVIPTier?.id === tier.id && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}

                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {tier.name}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-white/80 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>

                  <div className="text-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      ${tier.price}
                    </span>
                    <p className="text-white/60 text-sm">per month</p>
                  </div>
                </div>
                {userVIPTier && tier.id > userVIPTier.id && (
                  <button
                    className="glass-card border border-blue-400/30 text-blue-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-blue-400/10 transition"
                    onClick={() => handleUpgradeSubscription(tier)}
                    disabled={user.balance < tier.price || userStorage.hasActiveSubscription(user.id)}
                  >
                    Upgrade to {tier.name}
                  </button>
                )}
                {userVIPTier && tier.id < userVIPTier.id && (
                  <button
                    className="glass-card border border-red-400/30 text-red-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-red-400/10 transition"
                    onClick={() => handleUpgradeSubscription(tier)}
                    disabled={user.balance < tier.price || userStorage.hasActiveSubscription(user.id)}
                  >
                    Downgrade to {tier.name}
                  </button>
                )}
                {userVIPTier?.id === tier.id && (
                  <button
                    className="glass-card border border-green-400/30 text-green-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-green-400/10 transition"
                    disabled
                  >
                    Current Plan
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* VIP Benefits */}
        <div
          className="glass-card border border-white/10 rounded-3xl p-8 backdrop-blur-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
            VIP Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: DollarSign, title: 'Higher Rewards', desc: 'Earn more USDT per ad watched' },
              { icon: Zap, title: 'Priority Support', desc: 'Get help faster with VIP support' },
              { icon: Gift, title: 'Exclusive Bonuses', desc: 'Special rewards and promotions' },
              { icon: Shield, title: 'Enhanced Security', desc: 'Advanced account protection' },
              { icon: TrendingUp, title: 'Better Analytics', desc: 'Detailed earning insights' },
              { icon: Users, title: 'VIP Community', desc: 'Access to exclusive VIP groups' }
            ].map((benefit, index) => (
              <div
                key={benefit.title}
                className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-200"
              >
                <benefit.icon className="w-8 h-8 text-yellow-400 mx-auto mb-3 drop-shadow-glow" />
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-white/70 text-sm">{benefit.desc}</p>
              </div>
            ))}
            </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="glass-card border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4">Confirm VIP Upgrade</h2>
            <p className="text-white/80 mb-6">
              You are about to upgrade your VIP plan to <span className="font-semibold">{selectedTier.name}</span>.
              This will deduct <span className="font-semibold">${selectedTier.price}</span> from your wallet balance.
              Are you sure you want to proceed?
            </p>
            <div className="flex gap-3">
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition"
                onClick={handleUpgradeCancel}
              >
                Cancel
              </button>
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition"
                onClick={handleUpgradeConfirm}
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongratulations && purchasedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="glass-card border border-green-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-green-400 mb-4">Congratulations!</h2>
            <p className="text-white/80 mb-6">
              You have successfully upgraded to the <span className="font-semibold">{purchasedTier.name}</span> VIP plan.
              Your daily reward is now <span className="font-semibold">${purchasedTier.dailyReward}</span>.
            </p>
            <button
              className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition"
              onClick={handleCloseCongratulations}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && upgradeToTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="glass-card border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4">Confirm VIP Upgrade</h2>
            <p className="text-white/80 mb-6">
              You are about to upgrade your VIP plan from <span className="font-semibold">{userVIPTier?.name}</span> to <span className="font-semibold">{upgradeToTier.name}</span>.
              This will deduct <span className="font-semibold">${upgradeToTier.price}</span> from your wallet balance.
              Are you sure you want to proceed?
            </p>
            <div className="flex gap-3">
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition"
                onClick={handleConfirmUpgrade}
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Plan Confirmation Modal */}
      {showCancellationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="glass-card border border-red-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-red-400 mb-4">Cancel VIP Plan?</h2>
            <p className="text-white/80 mb-6">Are you sure you want to cancel your VIP subscription? This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <input
                className="glass-card border border-white/10 rounded-lg px-3 py-2 text-white bg-transparent mb-2"
                placeholder="Reason for cancellation (optional)"
                value={cancellationReason}
                onChange={e => setCancellationReason(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="glass-card border border-red-400/30 text-red-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-red-400/10 transition flex-1"
                  onClick={handleConfirmCancellation}
                >
                  Confirm Cancel
                </button>
                <button
                  className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition flex-1"
                  onClick={() => setShowCancellationModal(false)}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 