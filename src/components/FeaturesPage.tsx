import React from 'react';
import { Play, DollarSign, Clock, Shield, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Play,
    title: 'Watch Short Ads',
    description: 'Enjoy 25-30 second video ads covering gaming, tech, apps, and more'
  },
  {
    icon: DollarSign,
    title: 'Earn USDT Instantly',
    description: 'Get paid immediately after watching each ad - no delays or hidden fees'
  },
  {
    icon: Clock,
    title: 'Daily Streak Bonuses',
    description: 'Unlock extra rewards for consistent daily engagement'
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Top-tier security with instant withdrawals to any USDT wallet'
  },
  {
    icon: Users,
    title: 'Referral Rewards',
    description: 'Earn passive income by referring friends to the platform'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Dashboard',
    description: 'Track your earnings with live statistics and progress monitoring'
  }
];

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      {/* Navigation Header - match How It Works */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AdMoney</span>
            </div>
          </div>
        </div>
      </nav>
      {/* Features Section */}
      <section className="relative z-10 pt-24 pb-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need to start earning crypto rewards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full group"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed flex-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage; 