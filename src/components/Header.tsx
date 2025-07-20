import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  Menu,
  X,
  ChevronRight
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
 
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, shortLabel: 'Home' },
    { id: 'ads', label: 'Ads', icon: Play, shortLabel: 'Ads' },
    { id: 'withdraw', label: 'Wallet', icon: Wallet, shortLabel: 'Wallet' },
    ...(user ? [] : [{ id: 'features', label: 'Features', icon: Gift, shortLabel: 'Features' }]),
    { id: 'profile', label: 'Profile', icon: User, shortLabel: 'Profile' },
    { id: 'settings', label: 'Settings', icon: Settings, shortLabel: 'Settings' },
    { id: 'vip', label: 'VIP', icon: Crown, shortLabel: 'VIP' }
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
    const updatedNotifications = userStorage.getUserNotifications(user.id);
    setNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    userStorage.markAllNotificationsAsRead(user.id);
    const updatedNotifications = userStorage.getUserNotifications(user.id);
    setNotifications(updatedNotifications);
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
      default:
        return <Bell className="w-5 h-5 text-white/60" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'reward':
        return 'border-purple-500/30 bg-purple-500/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Don't render header for admin pages
  if (currentPage === 'admin') {
    return null;
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Main Header - Hidden on mobile, visible on tablet and desktop */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 w-full max-w-full px-3 sm:px-4 bg-transparent mt-6" style={{background: 'transparent'}}>
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
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Coins className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <span className="text-white font-bold text-lg text-responsive">Ad money</span>
            </div>

            {/* Center: Navigation Tabs - Hidden on tablet, visible on desktop */}
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

            {/* Right: Balance, Notifications, Tablet Menu, Logout */}
            <div className="flex items-center space-x-3">
              {/* Balance - Hidden on tablet */}
              <div className="hidden xl:block text-yellow-400 font-semibold text-base px-2">${user.balance.toFixed(2)} <span className="text-white/70 font-normal">USDT</span></div>
              
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => { console.log('Bell clicked'); setIsNotificationsOpen(!isNotificationsOpen); }}
                  className="relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-xl z-[9999] overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(147, 51, 234, 0.9) 100%)',
                      backdropFilter: 'blur(50px)',
                      WebkitBackdropFilter: 'blur(50px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-white/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-yellow-400 text-sm hover:text-yellow-300 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
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
                  </div>
                )}
              </div>
              
              {/* Logout Button (always visible next to notifications) */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-red-500/20"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
              
              {/* Tablet Menu Button */}
              <div className="xl:hidden relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setIsTabletMenuOpen(!isTabletMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
                
                {/* Tablet Menu Dropdown */}
                {isTabletMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-xl z-50 overflow-hidden"
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
                            setIsTabletMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm ${
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
                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 ${
                              currentPage === id ? 'bg-yellow-400/15' : 'bg-white/08'
                            }`}
                            style={{ backdropFilter: 'blur(10px)' }}
                          >
                            <Icon className={`w-4 h-4 ${currentPage === id ? 'text-yellow-400' : 'text-white/80'}`} />
                          </div>
                          <span className="font-medium">{label}</span>
                        </button>
                      ))}
                      
                      {/* Logout Button */}
                      <div className="pt-2 border-t border-white/15">
                        <button
                          onClick={() => {
                            setIsTabletMenuOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm text-red-200"
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
                          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-red-500/15" style={{ backdropFilter: 'blur(10px)' }}>
                            <LogOut className="w-4 h-4 text-red-300" />
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
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed left-4 right-4 bottom-4 z-50 rounded-2xl">
        {/* Bottom Navigation */}
        <div
          className="flex items-center justify-around px-2 py-2 rounded-2xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-lg"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            WebkitBackdropFilter: 'blur(16px)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Main Navigation Items (4 most important) */}
          {navigationItems.slice(0, 4).map(({ id, icon: Icon, shortLabel }) => (
            <button
              key={id}
              onClick={() => onNavigate(id as Page)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 ${
                currentPage === id
                  ? 'text-yellow-400'
                  : 'text-white/80 hover:text-white'
              }`}
              style={{
                background: currentPage === id 
                  ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.2) 100%)'
                  : 'transparent',
                border: currentPage === id 
                  ? '1px solid rgba(255, 193, 7, 0.5)'
                  : '1px solid transparent'
              }}
            >
              <div 
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 ${
                  currentPage === id ? 'bg-yellow-400/20' : 'bg-white/10'
                }`}
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <Icon className={`w-4 h-4 ${currentPage === id ? 'text-yellow-400' : 'text-white/80'}`} />
              </div>
              <span className="text-xs font-medium">{shortLabel}</span>
            </button>
          ))}
          
          {/* More Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 ${
              isMobileMenuOpen ? 'text-yellow-400' : 'text-white/80 hover:text-white'
            }`}
            style={{
              background: isMobileMenuOpen 
                ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.2) 100%)'
                : 'transparent',
              border: isMobileMenuOpen 
                ? '1px solid rgba(255, 193, 7, 0.5)'
                : '1px solid transparent'
            }}
          >
            <div 
              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'bg-yellow-400/20' : 'bg-white/10'
              }`}
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <Menu className={`w-4 h-4 ${isMobileMenuOpen ? 'text-yellow-400' : 'text-white/80'}`} />
            </div>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div 
              className="absolute left-4 right-4 rounded-2xl overflow-hidden max-w-sm mx-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.98) 0%, rgba(147, 51, 234, 0.95) 100%)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h3 className="text-white font-bold text-lg">Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Additional Navigation Items */}
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                {navigationItems.slice(4).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      onNavigate(id as Page);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm ${
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
                  >
                    <div 
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 ${
                        currentPage === id ? 'bg-yellow-400/15' : 'bg-white/08'
                      }`}
                      style={{ backdropFilter: 'blur(10px)' }}
                    >
                      <Icon className={`w-4 h-4 ${currentPage === id ? 'text-yellow-400' : 'text-white/80'}`} />
                    </div>
                    <span className="font-medium">{label}</span>
                    <ChevronRight className="w-4 h-4 text-white/40 ml-auto" />
                  </button>
                ))}
                
              </div>
            </div>
          </div>
        )}
      </div>

            {/* Mobile Top Bar - Simple version for mobile */}
      <div 
        className="mobile-top-bar fixed top-0 left-0 right-0 z-50 px-4 py-3 md:hidden" 
        style={{ 
          visibility: 'visible',
          opacity: '1',
          pointerEvents: 'auto',
          height: 'auto',
          minHeight: 'auto',
          maxHeight: '80px',
          overflow: 'hidden'
        }}
      >
        <div 
          className="flex items-center justify-between rounded-xl px-4 py-2"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Logo and App Name */}
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Coins className="w-4 h-4 text-white drop-shadow-sm" />
            </div>
            <span className="text-white font-bold text-sm">Ad money</span>
          </div>

          {/* Balance and Notifications and Logout */}
          <div className="flex items-center space-x-2">
            <div className="text-yellow-400 font-semibold text-sm">${user.balance.toFixed(2)}</div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Bell className="w-4 h-4 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Mobile Notifications Dropdown */}
              {isNotificationsOpen && ReactDOM.createPortal(
                <div
                  className={
                    `rounded-xl overflow-hidden z-[9999] ` +
                    (isMobile
                      ? 'fixed top-14 right-4 w-72'
                      : 'absolute right-0 mt-2 w-72')
                  }
                  style={{
                    background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(147, 51, 234, 0.9) 100%)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'auto'
                  }}
                >
                  {/* Header */}
                  <div className="p-3 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-base">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-yellow-400 text-xs hover:text-yellow-300 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center">
                          <Bell className="w-6 h-6 text-white/40 mx-auto mb-2" />
                          <p className="text-white/60 text-xs">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {notifications.slice(0, 3).map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white/5 ${
                                notification.read ? 'opacity-60' : ''
                              } ${getNotificationColor(notification.type)}`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-2">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <h4 className="text-white font-medium text-xs">
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-1 flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <p className="text-white/70 text-xs mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-white/50 text-xs mt-1">
                                    {formatTimestamp(notification.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {notifications.length > 3 && (
                            <div className="p-2 text-center">
                              <p className="text-white/60 text-xs">
                                +{notifications.length - 3} more notifications
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
            {/* Logout Button (mobile) */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-red-500/20"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 logout-modal-visible">
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
    </>
  );
};