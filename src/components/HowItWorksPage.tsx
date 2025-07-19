import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  Shield, 
  Users, 
  TrendingUp,
  CheckCircle,
  Star,
  ArrowLeft,
  Play,
  Mail,
  Wallet,
  Zap,
  Globe,
  Lock,
  Gift
} from 'lucide-react';

interface HowItWorksPageProps {
  onBack: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -100]);
  const y2 = useTransform(scrollY, [0, 300], [0, 100]);

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account and verify your email address',
      icon: Mail,
      details: [
        'Quick registration with email',
        'Instant email verification',
        'No personal documents required',
        'Secure account setup'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '02',
      title: 'Watch Ads',
      description: 'Enjoy short video ads and complete simple tasks',
      icon: Play,
      details: [
        '25-30 second video ads',
        'Gaming, tech, and app content',
        'Simple engagement tasks',
        'Earn while you learn'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '03',
      title: 'Earn & Withdraw',
      description: 'Get paid instantly and withdraw to your wallet',
      icon: Wallet,
      details: [
        'Instant USDT payments',
        'No minimum withdrawal',
        'Multiple wallet support',
        '24/7 withdrawal access'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const features = [
    { icon: Zap, title: 'Instant Payouts', desc: 'Get paid within seconds' },
    { icon: Shield, title: 'Secure Platform', desc: 'Bank-level security' },
    { icon: Globe, title: 'Global Access', desc: 'Available worldwide' },
    { icon: Gift, title: 'Daily Bonuses', desc: 'Earn extra rewards' },
    { icon: Users, title: 'Referral Program', desc: 'Invite friends & earn' },
    { icon: TrendingUp, title: 'Real-time Stats', desc: 'Track your earnings' }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      {/* Animated Background Spheres */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"
          style={{ y: y2 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <motion.button 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AdMoney</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-24 pb-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              How It Works
            </motion.h1>
            <motion.p 
              className="text-xl text-white/80 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Get started in three simple steps and begin earning crypto rewards
            </motion.p>
          </motion.div>
          
          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                onClick={() => setActiveStep(index)}
              >
                <div className="text-center">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed mb-6">{step.description}</p>
                  
                  {/* Step Details */}
                  <div className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div 
                        key={detailIndex}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Demo Section */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Interactive Demo</h2>
              <p className="text-white/80">Click on any step above to see detailed information</p>
            </div>
            
            {activeStep !== null && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {React.createElement(steps[activeStep].icon, { className: 'w-12 h-12 text-white' })}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{steps[activeStep].title}</h3>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">{steps[activeStep].description}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Why Choose AdMoney?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover the features that make us the leading choice for crypto earnings
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(0,0,0,0.2)"
                }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-white/70 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 lg:px-20 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to Start Earning?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join thousands of users already earning passive income with AdMoney
          </motion.p>
          <motion.button
            onClick={onBack}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold px-12 py-6 rounded-2xl text-xl hover:from-green-300 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 25px 50px rgba(34, 197, 94, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}; 