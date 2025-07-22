import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  CheckCircle} from 'lucide-react';
import { User } from '../utils/userStorage';
import { userStorage } from '../utils/userStorage';
import Aurora from './Aurora';
import AnimatedContent from './AnimatedContent';
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
    dailyReward: 10.00,
    monthlyReward: 300.00,
    yearlyReward: 3650.00,
    features: [
      "Daily $10.00 reward (10 ads)",
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
      "Daily $2.16 reward (10 ads)",
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
      "Daily $5.16 reward (10 ads)",
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
      "Daily $7.16 reward (10 ads)",
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
      "Daily $11.19 reward (10 ads)",
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
      "Daily $21.22 reward (10 ads)",
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
      "Daily $47.52 reward (10 ads)",
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

export const VIPPage: React.FC<VIPPageProps> = ({ user, onUserUpdate }) => {
  const [selectedTier, setSelectedTier] = useState<VIPTier | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [purchasedTier, setPurchasedTier] = useState<VIPTier | null>(null);
  const [showUpgradeWarning, setShowUpgradeWarning] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeToTier, setUpgradeToTier] = useState<VIPTier | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const userVIPTier = vipTiers.find(tier => tier.id === user.vipTier) || vipTiers[0];
  // Find the latest active VIP subscription record for the current user:
  const latestVIPSub = user.subscriptionHistory?.filter(sub => sub.type === 'vip' && sub.status === 'active').slice(-1)[0];

  // Clean up subscription data on component mount
  useEffect(() => {
    userStorage.cleanupSubscriptionData();
  }, []);

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


  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Aurora Animated Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
      </div>
      <div className="relative responsive-container w-full max-w-full px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <AnimatedContent distance={50} duration={0.6} delay={0}>
          <div className="mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
              VIP Membership
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Unlock premium features and higher earnings
            </p>
          </div>
        </AnimatedContent>

        {/* Enhanced Current VIP Status Card */}
        <AnimatedContent distance={60} duration={0.7} delay={0.1}>
          <div className="glass-card border border-purple-400/30 shadow-2xl rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 sm:p-4 rounded-full shadow-lg">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white drop-shadow-glow" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {userVIPTier.name}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base">Daily reward: ${userVIPTier.dailyReward} USDT</p>
                  <p className="text-white/70 text-sm sm:text-base">Start: {latestVIPSub?.startDate ? new Date(latestVIPSub.startDate).toLocaleDateString() : '-'}</p>
                  <p className="text-white/70 text-sm sm:text-base">End: {latestVIPSub?.endDate ? new Date(latestVIPSub.endDate).toLocaleDateString() : '-'}</p>
                  <p className="text-white/70 text-sm sm:text-base">Days left: {latestVIPSub?.endDate ? Math.max(0, Math.ceil((new Date(latestVIPSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : '-'}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[150px] sm:min-w-[180px]">
                {/* Cancel Plan Button */}
                <button
                  className="glass-card border border-red-400/30 text-red-400 font-bold py-2 px-3 sm:px-4 rounded-xl shadow hover:bg-red-400/10 transition text-xs sm:text-sm"
                  onClick={handleCancelSubscription}
                  disabled={latestVIPSub?.status !== 'active'}
                >
                  Cancel Plan
                </button>
                {/* Upgrade Plan Button */}
                <button
                  className="glass-card border border-blue-400/30 text-blue-400 font-bold py-2 px-3 sm:px-4 rounded-xl shadow hover:bg-blue-400/10 transition text-xs sm:text-sm"
                  onClick={() => setShowUpgradeModal(true)}
                  disabled={latestVIPSub?.status !== 'active'}
                >
                  Upgrade Plan
                </button>
                {/* Renew Plan Button (if <7 days left) */}
                {latestVIPSub?.endDate && Math.ceil((new Date(latestVIPSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 7 && (
                  <button
                    className="glass-card border border-yellow-400/30 text-yellow-400 font-bold py-2 px-3 sm:px-4 rounded-xl shadow hover:bg-yellow-400/10 transition text-xs sm:text-sm"
                    onClick={() => handleConfirmSubscription()}
                  >
                    Renew Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Subscription History Table */}
        <AnimatedContent distance={70} duration={0.8} delay={0.2}>
          {user.subscriptionHistory && user.subscriptionHistory.filter(sub => sub.type === 'vip').length > 0 && (
            <div className="glass-card border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 backdrop-blur-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                VIP Subscription History
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-white/90 text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-2 sm:px-4 py-2 text-left">Tier</th>
                      <th className="px-2 sm:px-4 py-2 text-left">Start Date</th>
                      <th className="px-2 sm:px-4 py-2 text-left">End Date</th>
                      <th className="px-2 sm:px-4 py-2 text-left">Amount</th>
                      <th className="px-2 sm:px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.subscriptionHistory.filter(sub => sub.type === 'vip').map((sub, idx) => (
                      <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white/0' : 'bg-white/5'}>
                        <td className="px-2 sm:px-4 py-2">{sub.notes?.includes('VIP') ? sub.notes.split('VIP ')[1].split(' ')[0] : sub.type}</td>
                        <td className="px-2 sm:px-4 py-2">{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '-'}</td>
                        <td className="px-2 sm:px-4 py-2">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '-'}</td>
                        <td className="px-2 sm:px-4 py-2">${sub.amount}</td>
                        <td className="px-2 sm:px-4 py-2 capitalize">{sub.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </AnimatedContent>

        {/* VIP Tiers */}
        <AnimatedContent distance={70} duration={0.8} delay={0.2}>
          <div
            className="glass-card border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 backdrop-blur-lg"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6">
              Choose Your VIP Plan
            </h2>
            
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 sm:gap-6">
                {vipTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative w-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 bg-opacity-80 backdrop-blur-lg border ${userVIPTier?.id === tier.id ? 'border-yellow-400' : 'border-white/10'} rounded-2xl shadow-xl flex flex-col items-center p-4 xl:p-3 ${
                      userVIPTier?.id === tier.id ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20' : 'hover:shadow-2xl hover:shadow-white/10'
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                    {/* Features */}
                    <ul className="mb-4 space-y-2 w-full">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-white/90 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {/* Price */}
                    <div className="text-2xl font-bold text-yellow-400 mb-1">${tier.price}</div>
                    <div className="text-white/70 text-sm mb-4">per month</div>
                    {/* Button */}
                    <button
                      onClick={() => handleSubscribe(tier)}
                      disabled={userVIPTier?.id === tier.id || user.balance < tier.price || userStorage.hasActiveSubscription(user.id)}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 text-base mt-auto border border-white/20 bg-white/10 text-white hover:bg-white/20 ${
                        userVIPTier?.id === tier.id
                          ? 'bg-yellow-400/90 text-white cursor-not-allowed shadow-lg' // Current plan button is yellow
                          : user.balance < tier.price
                          ? 'bg-red-500 text-white cursor-not-allowed shadow-lg'
                          : userStorage.hasActiveSubscription(user.id)
                          ? 'bg-gray-500 text-white cursor-not-allowed shadow-lg'
                          : ''
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
                ))}
              </div>
            </div>
          </div>
        </AnimatedContent>


      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card border border-white/20 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Confirm VIP Upgrade</h2>
            <p className="text-white/80 mb-6 text-sm sm:text-base">
              You are about to upgrade your VIP plan to <span className="font-semibold">{selectedTier.name}</span>.
              This will deduct <span className="font-semibold">${selectedTier.price}</span> from your wallet balance.
              Are you sure you want to proceed?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 sm:px-6 rounded-xl shadow hover:bg-white/10 transition min-w-[120px] text-sm sm:text-base"
                onClick={handleUpgradeCancel}
              >
                Cancel
              </button>
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 sm:px-6 rounded-xl shadow hover:bg-white/10 transition min-w-[120px] text-sm sm:text-base"
                onClick={handleConfirmSubscription}
              >
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongratulations && purchasedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card border border-green-400/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg sm:text-xl font-bold text-green-400 mb-4">Congratulations!</h2>
            <p className="text-white/80 mb-6 text-sm sm:text-base">
              You have successfully upgraded to the <span className="font-semibold">{purchasedTier.name}</span> VIP plan.
              Your daily reward is now <span className="font-semibold">${purchasedTier.dailyReward}</span>.
            </p>
            <div className="flex justify-center">
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 sm:px-6 rounded-xl shadow hover:bg-white/10 transition min-w-[100px] text-sm sm:text-base"
                onClick={handleCloseCongratulations}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && upgradeToTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card border border-white/20 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Confirm VIP Upgrade</h2>
            <p className="text-white/80 mb-6 text-sm sm:text-base">
              You are about to upgrade your VIP plan from <span className="font-semibold">{userVIPTier?.name}</span> to <span className="font-semibold">{upgradeToTier.name}</span>.
              This will deduct <span className="font-semibold">${upgradeToTier.price}</span> from your wallet balance.
              Are you sure you want to proceed?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 sm:px-6 rounded-xl shadow hover:bg-white/10 transition min-w-[120px] text-sm sm:text-base"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 sm:px-6 rounded-xl shadow hover:bg-white/10 transition min-w-[120px] text-sm sm:text-base"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card border border-red-400/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg sm:text-xl font-bold text-red-400 mb-4">Cancel VIP Plan?</h2>
            <p className="text-white/80 mb-6 text-sm sm:text-base">Are you sure you want to cancel your VIP subscription? This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <input
                className="glass-card border border-white/10 rounded-lg px-3 py-2 text-white bg-transparent mb-2 text-sm sm:text-base"
                placeholder="Reason for cancellation (optional)"
                value={cancellationReason}
                onChange={e => setCancellationReason(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="glass-card border border-red-400/30 text-red-400 font-bold py-2 px-4 rounded-xl shadow hover:bg-red-400/10 transition flex-1 text-sm sm:text-base"
                  onClick={handleConfirmCancellation}
                >
                  Confirm Cancel
                </button>
                <button
                  className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition flex-1 text-sm sm:text-base"
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