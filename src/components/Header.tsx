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
  ChevronRight,
  History,
  HelpCircle,
  Users
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
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']); // Start with main section expanded
 
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigationSections = [
    {
      id: 'main',
      title: 'Main Actions',
      icon: Home,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'ads', label: 'Watch Ads', icon: Play }
      ]
    },
    {
      id: 'finance',
      title: 'Finance & Rewards',
      icon: Wallet,
      items: [
        { id: 'withdraw', label: 'Wallet', icon: Wallet },
        { id: 'vip', label: 'VIP', icon: Crown },
        { id: 'referrals', label: 'Referrals', icon: Users }
      ]
    },
    {
      id: 'account',
      title: 'Account & Support',
      icon: User,
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'support', label: 'Support', icon: HelpCircle }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? [] // Close the section if it's already open
        : [sectionId] // Open only this section, closing all others
    );
  };

  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsSideMenuOpen(false);
      setIsMenuClosing(false);
    }, 300); // Match the animation duration
  };

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock/unlock body scroll when side menu opens/closes
  useEffect(() => {
    if (isSideMenuOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Unlock body scroll and restore position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isSideMenuOpen]);

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

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
              max-height: 0;
            }
            to {
              opacity: 1;
              transform: translateY(0);
              max-height: 500px;
            }
          }
          
          @keyframes slideInItem {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeInMenu {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes fadeOutMenu {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
      </style>
      {/* Main Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-[60] w-full px-4 py-3">
        <div 
          className="flex items-center justify-between px-4 py-3 rounded-xl backdrop-blur-md"
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
              className="text-white font-bold text-lg hidden sm:block hover:text-yellow-400 transition-colors"
            >
              AdMoney
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
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
                  {/* Notifications content remains the same */}
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

            {/* Hamburger Menu */}
            <button
              onClick={() => {
                if (isSideMenuOpen) {
                  closeMenu();
                } else {
                  setIsSideMenuOpen(true);
                }
              }}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md" 
          onClick={closeMenu}
          style={{
            animation: `${isMenuClosing ? 'fadeOutMenu' : 'fadeInMenu'} 0.3s ease-out`
          }}
        >
          <div
            className="fixed inset-0 z-40 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.85) 0%, rgba(147, 51, 234, 0.80) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
              animation: `${isMenuClosing ? 'fadeOutMenu' : 'fadeInMenu'} 0.3s ease-out`
            }}
          >
            {/* Content Container */}
            <div className="flex flex-col h-full pt-32 pb-6 px-6" onClick={(e) => e.stopPropagation()}>
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white/50" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Balance Display */}
              <div 
                className="mb-6 p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.15) 100%)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 20px rgba(255, 193, 7, 0.1)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.2) 100%)',
                        border: '1px solid rgba(255, 193, 7, 0.4)'
                      }}
                    >
                      <Coins className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium">Current Balance</p>
                      <p className="text-white text-xl font-bold">${user.balance.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation - Accordion Menu */}
              <div className="flex-1 flex flex-col justify-start pt-4 space-y-4 px-2">
                {navigationSections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm text-white"
                      style={{
                        background: expandedSections.includes(section.id)
                          ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 152, 0, 0.15) 100%)'
                          : 'rgba(255, 255, 255, 0.06)',
                        border: expandedSections.includes(section.id)
                          ? '1px solid rgba(255, 193, 7, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        if (!expandedSections.includes(section.id)) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!expandedSections.includes(section.id)) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        }
                      }}
                    >
                      <div 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          expandedSections.includes(section.id) ? 'bg-yellow-400/20' : 'bg-white/10'
                        }`}
                        style={{ backdropFilter: 'blur(5px)' }}
                      >
                        <section.icon className={`w-4 h-4 ${expandedSections.includes(section.id) ? 'text-yellow-400' : 'text-white/80'}`} />
                      </div>
                      <span className="font-medium text-sm flex-1 text-left">{section.title}</span>
                      <ChevronRight className={`w-3 h-3 text-white/40 transition-transform duration-300 ${expandedSections.includes(section.id) ? 'rotate-90' : ''}`} />
                    </button>

                    {expandedSections.includes(section.id) && (
                      <div 
                        className="pl-6 space-y-1 overflow-hidden"
                        style={{
                          animation: 'slideDown 0.3s ease-out',
                          opacity: '1',
                          transform: 'translateY(0)'
                        }}
                      >
                        {section.items.map((item, index) => (
                          <button
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate(item.id as Page);
                              closeMenu();
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-xs ${
                              currentPage === item.id
                                ? 'text-yellow-400'
                                : 'text-white/80 hover:text-white'
                            }`}
                            style={{
                              background: currentPage === item.id 
                                ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)'
                                : 'rgba(255, 255, 255, 0.03)',
                              border: currentPage === item.id 
                                ? '1px solid rgba(255, 193, 7, 0.3)'
                                : '1px solid rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(5px)',
                              animation: `slideInItem 0.3s ease-out ${index * 0.05}s both`,
                              opacity: '0',
                              transform: 'translateX(-10px)'
                            }}
                            onMouseEnter={(e) => {
                              if (currentPage !== item.id) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (currentPage !== item.id) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.05)';
                              }
                            }}
                          >
                            <div 
                              className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 ${
                                currentPage === item.id ? 'bg-yellow-400/15' : 'bg-white/05'
                              }`}
                              style={{ backdropFilter: 'blur(3px)' }}
                            >
                              <item.icon className={`w-3 h-3 ${currentPage === item.id ? 'text-yellow-400' : 'text-white/70'}`} />
                            </div>
                            <span className="font-medium text-xs flex-1 text-left">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
                      
                      {/* Logout Button */}
              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMenu();
                            setShowLogoutModal(true);
                          }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm text-red-200"
                          style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    backdropFilter: 'blur(10px)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.3) 100%)';
                            e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.5)';
                          }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)';
                    e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.4)';
                          }}
                        >
                            <LogOut className="w-4 h-4 text-red-300" />
                  <span className="font-medium text-sm">Logout</span>
                        </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div 
            className="rounded-2xl p-8 max-w-sm w-full mx-4"
            style={{
              background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(147, 51, 234, 0.9) 100%)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
            }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Confirm Logout</h2>
            <p className="text-white/80 mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-xl text-white font-medium transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl text-white font-medium transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.3) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  backdropFilter: 'blur(10px)'
                }}
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