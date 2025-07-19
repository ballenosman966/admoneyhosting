import React, { useState, useEffect } from 'react';
// Framer Motion removed
import { 
  Play, 
  DollarSign, 
  Clock, 
  Shield, 
  Users, 
  TrendingUp,
  CheckCircle,
  Star,
  Gift,
  Info,
  PlayCircle,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { userStorage } from '../utils/userStorage';
import SplitText from './SplitText';
import AnimatedList from './AnimatedList';
import { HowItWorksPage } from './HowItWorksPage';
import Aurora from './Aurora';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onAuth: (referralCode?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showLivePayouts, setShowLivePayouts] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showTrustBadges, setShowTrustBadges] = useState(false);
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showInviteWarning, setShowInviteWarning] = useState(false);
  const [showAnimatedFeatures, setShowAnimatedFeatures] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState<'home' | 'how-it-works'>('home');

  // Get referral ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const referrerId = urlParams.get('ref');

  // Get current user
  const currentUser = userStorage.getCurrentUser();

  const handleAuth = () => {
    onAuth(referrerId || undefined);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const benefits = [
    'Beginner-Friendly Interface',
    'Worldwide Access',
    'No Hidden Fees',
    'Instant Withdrawals',
    '24/7 Support'
  ];

  // Remove or comment out the hardcoded testimonials array and its usage
  // const testimonials = [
  //   { name: 'Alice', text: 'I earned my first USDT in minutes! Super easy.' },
  //   { name: 'Bob', text: 'Best ad platform for crypto rewards. Fast payouts.' },
  //   { name: 'Charlie', text: 'I invited my friends and got bonuses instantly.' }
  // ];
  // const livePayouts = [
  //   { name: 'Alice', amount: 5 },
  //   { name: 'Bob', amount: 10 },
  //   { name: 'Charlie', amount: 3 }
  // ];

  const stats = [
    { rate: '22,398+', amount: 'Active Users' },
    { rate: '$5,213+', amount: 'Daily Payouts' },
    { rate: '$2.4M+', amount: 'Total Earned' }
  ];

  // If we're on the How It Works page, render that instead
  if (currentPage === 'how-it-works') {
    return (
      <HowItWorksPage 
        onBack={() => setCurrentPage('home')} 
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Aurora />
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              className="flex items-center space-x-2"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AdMoney</span>
            </button>

            {/* Navigation Links */}
            <div 
              className="hidden md:flex items-center space-x-8"
            >
              <button 
                className="text-white/80 hover:text-white transition-colors font-medium"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Home
              </button>
              <button 
                className="text-white/80 hover:text-white transition-colors font-medium"
                onClick={() => navigate('/about')}
              >
                About
              </button>
              <button 
                className="text-white/80 hover:text-white transition-colors font-medium"
                onClick={() => setCurrentPage('how-it-works')}
              >
                How It Works
              </button>
              <button 
                className="text-white/80 hover:text-white transition-colors font-medium"
                onClick={() => navigate('/features')}
              >
                Features
              </button>
            </div>

            {/* Auth Buttons */}
            <div 
              className="flex items-center space-x-4"
            >
              <button 
                className="text-white/80 hover:text-white transition-colors font-medium"
                onClick={() => {
                  // For now, trigger the same auth flow as sign up
                  // In a real app, you'd have separate login/signup flows
                  handleAuth();
                }}
              >
                Login
              </button>
              <button 
                onClick={handleAuth}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals/Popups */}
      {showLearnMore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border border-white/20"
          >
            <button className="absolute top-3 right-3 text-white/60 hover:text-white" onClick={() => setShowLearnMore(false)}><Info className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-4 text-white">Learn More</h2>
            <p className="text-white/80 mb-2">AdMoney lets you earn USDT by watching ads, referring friends, and more. Withdraw instantly, no KYC required!</p>
            <ul className="list-disc pl-6 text-white/80 mb-2">
              <li>Watch ads, earn crypto</li>
              <li>Invite friends for bonuses</li>
              <li>Withdraw to your wallet anytime</li>
            </ul>
            <button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => setShowLearnMore(false)}>Close</button>
          </div>
        </div>
      )}
      
      {/* Other modals with similar styling... */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border border-white/20"
          >
            <button className="absolute top-3 right-3 text-white/60 hover:text-white" onClick={() => setShowHowItWorks(false)}><PlayCircle className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-4 text-white">How It Works</h2>
            <ol className="list-decimal pl-6 text-white/80 mb-2">
              <li>Sign up and verify your email</li>
              <li>Watch ads and complete simple tasks</li>
              <li>Earn USDT instantly to your balance</li>
              <li>Withdraw to your crypto wallet anytime</li>
            </ol>
            <button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => setShowHowItWorks(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 lg:px-20 py-16 text-center">
        <div className="max-w-7xl mx-auto">
          {/* Top Banner REMOVED */}

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Text Section */}
            <div 
              className="max-w-2xl text-left"
            >
              <h2 
                className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4"
              >
                Welcome to AdMoney
              </h2>
              
              <h1 
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
              >
                The Future of
                <br />
                Crypto Earnings
              </h1>
              
              <p 
                className="text-xl text-white/80 mb-8 leading-relaxed"
              >
                AdMoney is an ever-expanding ecosystem of interconnected earning opportunities, 
                built for a decentralized future where everyone can earn crypto effortlessly.
              </p>
              
              <div 
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleAuth}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold px-8 py-4 rounded-xl hover:from-green-300 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                >
                  Start Earning Now
                </button>
                <button 
                  className="bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-4 rounded-xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowHowItWorks(true)}
                >
                  How It Works
                </button>
              </div>
            </div>

            {/* Right 3D + Stats Section */}
            <div 
              className="relative w-full lg:w-1/2 flex items-center justify-center"
            >
              {/* 3D Crypto Vault Placeholder */}
              <div className="relative">
                <div 
                  className="w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl absolute inset-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Placeholder for 3D model - replace with Spline or Lottie */}
                <div className="relative z-0 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <DollarSign className="w-16 h-16 text-white mx-auto mb-4" />
                    <p className="text-white font-semibold">3D Crypto Vault</p>
                    <p className="text-white/60 text-sm">Replace with Spline</p>
          </div>
        </div>

                {/* Floating Stats */}
                <div className="absolute -top-8 -left-8 flex flex-col gap-4 z-20">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 + 1 }}
                      className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-white w-48 shadow-lg"
                    >
                      <p className="font-bold text-lg">{stat.rate}</p>
                      <p className="text-sm text-white/60">{stat.amount}</p>
                    </div>
                  ))}
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>



      {/* Benefits Section */}
      <section id="benefits-section" className="relative z-10 py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div 
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose AdMoney?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover the advantages that make us the leading choice for crypto earnings
            </p>
          </div>
          
          {/* 5-4 Benefits Layout */}
          <div className="space-y-8">
            {/* Main Benefits - 5x1 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 h-full"
                >
                  <div className="flex flex-col items-center text-center space-y-3 h-full">
                    <div
                      className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-white/90 font-medium text-sm leading-relaxed">{benefit}</p>
            </div>
              </div>
                </div>
              ))}
            </div>

            {/* Additional Features - 4x1 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Clock, text: "24/7 Availability", desc: "Always accessible" },
                { icon: DollarSign, text: "Instant Payouts", desc: "Get paid immediately" },
                { icon: Globe, text: "Global Access", desc: "Available worldwide" },
                { icon: Star, text: "Premium Support", desc: "Expert assistance" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col justify-center"
                >
                  <div 
                    className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3"
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{item.text}</h3>
                  <p className="text-white/70 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div 
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Trusted by Millions
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join the fastest-growing crypto rewards community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '2.4M+', label: 'Total Users', icon: Users },
              { number: '$15.2M+', label: 'Total Payouts', icon: DollarSign },
              { number: '150+', label: 'Countries', icon: Globe },
              { number: '99.9%', label: 'Uptime', icon: Shield }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-6 lg:px-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto">
          <div 
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real stories from real users earning crypto rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Sarah Chen', 
                role: 'Student',
                text: 'I earned my first $50 in USDT within a week! The platform is incredibly user-friendly and the payouts are instant.',
                avatar: '👩‍🎓',
                earnings: '+$847 USDT'
              },
              { 
                name: 'Marcus Rodriguez', 
                role: 'Freelancer',
                text: 'AdMoney has become my main source of passive income. I love how transparent and secure everything is.',
                avatar: '👨‍💻',
                earnings: '+$1,234 USDT'
              },
              { 
                name: 'Emma Thompson', 
                role: 'Entrepreneur',
                text: 'The referral program is amazing! I\'ve earned over $2,000 just by inviting friends. Highly recommended!',
                avatar: '👩‍💼',
                earnings: '+$2,156 USDT'
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full"
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                    </div>
                  <div className="ml-auto text-green-400 font-bold text-sm">
                    {testimonial.earnings}
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed mb-4">"{testimonial.text}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
              </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="relative z-10 py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div 
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Security & Trust
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Your security is our top priority
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Shield, 
                title: 'SSL Encryption', 
                desc: 'Bank-level security with 256-bit encryption',
                color: 'from-green-500 to-emerald-500'
              },
              { 
                icon: Clock, 
                title: 'Instant Payouts', 
                desc: 'Get your USDT within seconds, not days',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: Globe, 
                title: 'Global Access', 
                desc: 'Available in 150+ countries worldwide',
                color: 'from-purple-500 to-pink-500'
              },
              { 
                icon: Star, 
                title: '24/7 Support', 
                desc: 'Round-the-clock customer assistance',
                color: 'from-orange-500 to-red-500'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div 
                  className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-white/70 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 px-6 lg:px-20 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
          <div 
            className="max-w-5xl mx-auto text-center"
          >
          <h2 
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
          >
            Ready to earn while you sleep?
          </h2>
          <p 
            className="text-xl text-white/80 mb-8 max-w-3xl mx-auto"
          >
            Join thousands of users already earning passive income with AdMoney
          </p>
          <button
            onClick={handleAuth}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold px-12 py-6 rounded-2xl text-xl hover:from-green-300 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50"
          >
            Start Earning Now
            <ArrowRight className="inline-block ml-2 w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 lg:px-20 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
          </div>
                <span className="text-xl font-bold text-white">AdMoney</span>
              </div>
              <p className="text-white/60 text-sm">
                The future of crypto earnings. Earn USDT by watching ads, referring friends, and more.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => setCurrentPage('how-it-works')}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const section = document.querySelector('#features-section');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    API
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Status
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    GDPR
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2024 AdMoney. All rights reserved. Made with ❤️ for the crypto community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};