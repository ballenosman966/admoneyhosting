import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Play, 
  Wallet, 
  User, 
  LogOut,
  Coins,
  Shield,
  Settings,
  Bell,
  Lock,
  ChevronDown,
  Users,
  Crown,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  TrendingUp,
  Link as RouterLink
} from 'lucide-react';
import { Page } from '../App';
import { User as UserType, userStorage, Notification } from '../utils/userStorage';
import { Link } from 'react-router-dom';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: UserType;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout, user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-full px-3 sm:px-4 bg-transparent" style={{background: 'transparent'}}>
      <div className="max-w-full sm:max-w-7xl mx-auto px-0 sm:px-4 bg-transparent" style={{background: 'transparent'}}>
        <div
          className="flex items-center justify-between h-16 min-w-0 w-full px-4"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(6.2px)',
            WebkitBackdropFilter: 'blur(6.2px)',
            border: '1px solid rgba(255, 255, 255, 0.10)'
          }}
        >
          {/* Left: Logo and App Name */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg text-responsive">Ad money</span>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="flex-1 flex justify-center items-center">
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

          {/* Right: About, Balance, Notifications, User, Logout */}
          <div className="flex items-center space-x-3">
            {!user && (
              <Link to="/about" className="text-white/90 hover:text-yellow-300 font-bold px-2">About</Link>
            )}
            <div className="hidden sm:block text-yellow-400 font-semibold text-base px-2">${user.balance.toFixed(2)} <span className="text-white/70 font-normal">USDT</span></div>
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
            <button
              onClick={onLogout}
              className="px-2 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold hover:bg-red-500/40 hover:text-white transition-colors border border-red-500/30 text-sm"
            >
              <LogOut className="w-3 h-3 inline-block mr-1 align-text-bottom" /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};