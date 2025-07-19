import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Play, 
  Wallet, 
  User, 
  LogOut,
  Coins,
  Settings,
  Bell,
  Crown,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  Menu
} from 'lucide-react';
import { Page } from '../App';
import { User as UserType, userStorage, Notification } from '../utils/userStorage';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: UserType;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout, user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ads', label: 'Ads', icon: Play },
    { id: 'withdraw', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'vip', label: 'VIP', icon: Crown }
  ];

  // Debug: Log the navItems for admin user
  if (user.username === 'mhamad') {
    console.log('Admin user navItems:', navigationItems);
  }

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
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    userStorage.markNotificationAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    userStorage.markAllNotificationsAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-purple-400" />;
      case 'withdrawal':
        return <Wallet className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'reward':
        return 'border-purple-500/20 bg-purple-500/10';
      case 'withdrawal':
        return 'border-green-500/20 bg-green-500/10';
      default:
        return 'border-gray-500/20 bg-gray-500/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  // If a prop like isAdmin or currentPage === 'admin' is true, return null or do not render the nav bar.
  if (currentPage === 'admin') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-full px-3 sm:px-4 bg-transparent mt-6" style={{background: 'transparent'}}>
      <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4 bg-transparent" style={{background: 'transparent'}}>
        <div
          className="flex items-center justify-between h-16 min-w-0 w-full px-4"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.20)'
          }}
        >
          {/* Left: Logo and App Name */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg text-responsive">Ad money</span>
          </div>

          {/* Center: Navigation Tabs - Hidden on mobile, tablet, and iPad Pro */}
          <nav className="hidden xl:flex flex-1 justify-center items-center">
            <div className="flex space-x-2">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id as Page)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-bold text-base whitespace-nowrap min-w-[44px] min-h-[44px] text-responsive ${
                    currentPage === id
                      ? 'text-yellow-400 bg-white/10'
                      : 'text-white/90 hover:text-yellow-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Right: Balance, Notifications, Mobile Menu, Logout */}
          <div className="flex items-center space-x-3">
            {/* Balance - Hidden on mobile */}
            <div className="hidden sm:block text-yellow-400 font-semibold text-base px-2">${user.balance.toFixed(2)} <span className="text-white/70 font-normal">USDT</span></div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <Bell className="w-4 h-4 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {/* Notifications Dropdown (unchanged) */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl border border-white/20 shadow-xl backdrop-blur-sm z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-8 h-8 text-white/40 mx-auto mb-2" />
                        <p className="text-white/60 text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white/5 ${
                              notification.read ? 'opacity-60' : ''
                            } ${getNotificationColor(notification.type)}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <h4 className="text-white font-medium text-sm">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-400 rounded-full ml-2 flex-shrink-0"></div>
                                  )}
                                </div>
                                <p className="text-white/70 text-xs mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-white/50 text-xs mt-2">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {notifications.length > 3 && (
                          <div className="p-4 text-center">
                            <p className="text-white/60 text-sm">
                              Scroll to see all {notifications.length} notifications
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="xl:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:bg-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Menu className="w-4 h-4 text-white" />
              </button>
              
              {/* Mobile Menu Dropdown with Beautiful Glassmorphism */}
              {isMobileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 lg:w-56 sm:w-48 rounded-xl z-50 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(147, 51, 234, 0.9) 100%)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                >

                  
                  {/* Navigation Items */}
                  <div className="p-2 space-y-1">
                    {navigationItems.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => {
                          onNavigate(id as Page);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 lg:space-x-2 px-4 py-4 lg:px-3 lg:py-3 sm:px-2 sm:py-2 rounded-lg transition-all duration-300 font-medium text-base lg:text-sm sm:text-xs ${
                          currentPage === id
                            ? 'text-yellow-400'
                            : 'text-white/90 hover:text-white'
                        }`}
                        style={{
                          background: currentPage === id 
                            ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.4) 0%, rgba(255, 152, 0, 0.3) 100%)'
                            : 'rgba(88, 28, 135, 0.8)',
                          border: currentPage === id 
                            ? '1px solid rgba(255, 193, 7, 0.6)'
                            : '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(20px)'
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== id) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)';
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage !== id) {
                            e.currentTarget.style.background = 'rgba(88, 28, 135, 0.8)';
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                          }
                        }}
                      >
                        <div 
                          className={`w-10 h-10 lg:w-8 lg:h-8 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-all duration-300 ${
                            currentPage === id ? 'bg-yellow-400/15' : 'bg-white/08'
                          }`}
                          style={{ backdropFilter: 'blur(10px)' }}
                        >
                          <Icon className={`w-5 h-5 lg:w-4 lg:h-4 sm:w-3 sm:h-3 ${currentPage === id ? 'text-yellow-400' : 'text-white/80'}`} />
                        </div>
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                    
                    {/* Logout Button */}
                    <div className="pt-2 border-t border-white/15">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full flex items-center space-x-3 lg:space-x-2 px-4 py-4 lg:px-3 lg:py-3 sm:px-2 sm:py-2 rounded-lg transition-all duration-300 font-medium text-base lg:text-sm sm:text-xs text-red-200"
                        style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.3) 100%)',
                          border: '1px solid rgba(239, 68, 68, 0.5)',
                          backdropFilter: 'blur(20px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)';
                          e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.3) 100%)';
                          e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.5)';
                        }}
                      >
                        <div className="w-10 h-10 lg:w-8 lg:h-8 sm:w-6 sm:h-6 rounded-md flex items-center justify-center bg-red-500/15" style={{ backdropFilter: 'blur(10px)' }}>
                          <LogOut className="w-5 h-5 lg:w-4 lg:h-4 sm:w-3 sm:h-3 text-red-300" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Desktop Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="hidden xl:flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-red-500/80 text-white font-bold text-lg shadow hover:bg-red-600 transition-colors border border-red-500/30"
              style={{ minWidth: '120px' }}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="glass-card border border-white/20 rounded-2xl p-8 max-w-sm w-full shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Logout</h2>
            <p className="text-white/80 mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-end">
              <button
                className="glass-card border border-white/20 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-white/10 transition"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="glass-card border border-red-500/30 bg-red-500/20 text-red-300 font-bold py-2 px-4 rounded-xl shadow hover:bg-red-500/40 hover:text-white transition"
                onClick={() => { setShowLogoutModal(false); onLogout(); }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};