import React, { useState, useEffect } from 'react';
import { Crown, X } from 'lucide-react';

interface VIPRewardNotificationProps {
  amount: number;
  tierName: string;
  onClose: () => void;
}

export const VIPRewardNotification: React.FC<VIPRewardNotificationProps> = ({ 
  amount, 
  tierName, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 shadow-lg border border-yellow-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold">VIP Daily Reward!</h4>
            <p className="text-white/90 text-sm">
              ${amount.toFixed(2)} added to your balance from {tierName}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}; 