import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  LogOut,
  Settings,
  Bell,
  Menu,
  MoreHorizontal,
  Shield,
  Download,
  Send,
  Wallet
} from 'lucide-react';
import { 
  AnimatedHomeIcon, 
  AnimatedPlayIcon, 
  AnimatedWalletIcon, 
  AnimatedCrownIcon, 
  AnimatedMoreIcon 
} from './AnimatedIcons';
import { Page } from '../App';
import { User as UserType, userStorage, Notification } from '../utils/userStorage';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: UserType;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout, user }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
 
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // PWA Install functionality
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Home', icon: AnimatedHomeIcon },
    { id: 'ads', label: 'Ads', icon: AnimatedPlayIcon },
    { id: 'withdraw', label: 'Wallet', icon: AnimatedWalletIcon },
    { id: 'vip', label: 'VIP', icon: AnimatedCrownIcon },
  ];

  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMenuClosing(false);
    }, 300); // Match the animation duration
  };

  // Close menu when navigating to different pages
  useEffect(() => {
    if (isMobileMenuOpen) {
      closeMenu();
    }
  }, [currentPage]);

  // Load notifications from userStorage
  useEffect(() => {
    const loadNotifications = () => {
      const userNotifications = userStorage.getUserNotifications(user.id);
      setNotifications(userNotifications);
    };

    loadNotifications();
    
    // Set up interval to check for new notifications
    const interval = setInterval(loadNotifications, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [user.id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render header for admin pages
  if (currentPage === 'admin') {
    return null;
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeInMenu {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeOutMenu {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-10px);
            }
          }
        `}
      </style>
      
      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 w-full">
          <div
          className="flex items-center justify-center px-4 py-3"
            style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Logo and Title */}
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-white font-bold text-lg">AdMoney</h1>
                        </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div
          className="flex items-center justify-around px-2 py-2"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
            borderRadius: '20px 20px 0 0'
          }}
        >
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ${
                currentPage === item.id 
                  ? 'bg-yellow-400/20 text-yellow-400' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={{ minWidth: '60px', minHeight: '60px' }}
            >
              <item.icon isActive={currentPage === item.id} className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* More Menu Button */}
          <div className="relative">
          <button
              onClick={() => {
                if (isMobileMenuOpen) {
                  closeMenu();
                } else {
                  setIsMobileMenuOpen(true);
                }
              }}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ${
                isMobileMenuOpen 
                  ? 'bg-yellow-400/20 text-yellow-400' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={{ minWidth: '60px', minHeight: '60px' }}
            >
              <AnimatedMoreIcon isActive={isMobileMenuOpen} className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">More</span>
          </button>

            {/* More Menu Dropdown */}
        {isMobileMenuOpen && (
            <div 
                className="absolute bottom-full right-0 mb-2 w-48 rounded-xl overflow-hidden shadow-xl"
              style={{
                  background: 'rgba(0, 0, 0, 0.72)',
                  backdropFilter: 'blur(230px)',
                  WebkitBackdropFilter: 'blur(230px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
                  animation: `${isMenuClosing ? 'fadeOutMenu' : 'fadeInMenu'} 0.3s ease-out`
                }}
              >
                <button
                  onClick={() => {
                    onNavigate('profile');
                    closeMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="flex items-center leading-none">Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    onNavigate('referrals');
                    closeMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/referral-icon.png" alt="Referrals" className="w-5 h-5" />
                  </div>
                  <span className="flex items-center leading-none">Referrals</span>
                </button>

                {/* KYC Verification */}
                <button
                  onClick={() => {
                    // Navigate to KYC or open KYC modal
                    window.location.href = '#kyc'; // Placeholder - you can modify this as needed
                    closeMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/kyc.png" alt="KYC" className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-all" style={{filter: 'brightness(0) invert(1)'}} />
                  </div>
                  <span className="flex items-center leading-none">KYC Verification</span>
                </button>

                {/* Add to Home Screen */}
                {showInstallButton && (
                  <button
                    onClick={() => {
                      handleInstallClick();
                      closeMenu();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="flex items-center leading-none">Add to Home Screen</span>
                  </button>
                )}

                {/* Telegram Channel */}
                <button
                  onClick={() => {
                    window.open('https://t.me/admoney_official', '_blank');
                    closeMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="whitespace-nowrap flex items-center leading-none">Telegram Channel</span>
                </button>
                
                <button
                  onClick={() => {
                    onNavigate('settings');
                    closeMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5" />
                  </div>
                  <span className="flex items-center leading-none">Settings</span>
                </button>

                <div className="border-t border-white/10">
                  <button
                    onClick={() => {
                      closeMenu();
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <LogOut className="w-5 h-5" />
                    </div>
                    <span className="flex items-center leading-none">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
      </div>
      </nav>

      {/* Desktop Header - Hidden on mobile */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 w-full px-4 py-3">
        <div 
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.85) 0%, rgba(147, 51, 234, 0.80) 100%)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="text-white font-bold text-lg hover:text-yellow-400 transition-colors"
            >
              AdMoney
            </button>
            </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Page)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.id 
                    ? 'bg-yellow-400/20 text-yellow-400' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon isActive={currentPage === item.id} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Balance Display */}
            <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <Wallet className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-semibold text-sm">${user.balance.toFixed(2)}</span>
            </div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
              >
                <Bell className="w-5 h-5 text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{notifications.length}</span>
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-3">Notifications</h3>
                      {notifications.length === 0 ? (
                      <p className="text-white/60 text-sm">No new notifications</p>
                      ) : (
                      <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                              key={notification.id}
                            className="p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <p className="text-white text-sm">{notification.message}</p>
                            <p className="text-white/40 text-xs mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
              )}
            </div>

            {/* More Menu - Desktop */}
            <div className="relative lg:hidden">
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              {/* More Menu Dropdown - Desktop */}
              {isMobileMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-xl"
              style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(120px)',
                    WebkitBackdropFilter: 'blur(120px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="flex items-center leading-none">Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onNavigate('referrals');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <img src="/referral-icon.png" alt="Referrals" className="w-5 h-5" />
                    </div>
                    <span className="flex items-center leading-none">Referrals</span>
                  </button>

                  {/* KYC Verification */}
                  <button
                    onClick={() => {
                      // Navigate to KYC or open KYC modal
                      window.location.href = '#kyc'; // Placeholder - you can modify this as needed
                      setIsMobileMenuOpen(false);
                    }}
                                          className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <img src="/kyc.png" alt="KYC" className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-all" style={{filter: 'brightness(0) invert(1)'}} />
                      </div>
                      <span className="flex items-center leading-none">KYC Verification</span>
                  </button>

                  {/* Add to Home Screen */}
                  {showInstallButton && (
                    <button
                      onClick={() => {
                        handleInstallClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5" />
                      </div>
                      <span className="flex items-center leading-none">Add to Home Screen</span>
                    </button>
                  )}

                  {/* Telegram Channel */}
                  <button
                    onClick={() => {
                      window.open('https://t.me/admoney_official', '_blank');
                      setIsMobileMenuOpen(false);
                    }}
                                          className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Send className="w-5 h-5" />
                      </div>
                      <span className="whitespace-nowrap flex items-center leading-none">Telegram Channel</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5" />
                    </div>
                    <span className="flex items-center leading-none">Settings</span>
                  </button>
                  
                  <div className="border-t border-white/10">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <LogOut className="w-5 h-5" />
                      </div>
                      <span className="flex items-center leading-none">Logout</span>
            </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div 
            className="rounded-2xl p-8 max-w-sm w-full mx-4"
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(120px)',
              WebkitBackdropFilter: 'blur(120px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
            }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Confirm Logout</h2>
            <p className="text-white/80 mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white font-medium transition-all"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};