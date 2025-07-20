import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { Dashboard } from './components/Dashboard';
import { AdViewer } from './components/AdViewer';
import { WithdrawPage } from './components/WithdrawPage';
import { ProfilePage } from './components/ProfilePage';
import { ReferralPage } from './components/ReferralPage';
import { SettingsPage } from './components/SettingsPage';
import { VIPPage } from './components/VIPPage';
import { userStorage, User } from './utils/userStorage';
import { serverSessionService } from './utils/serverSessionService';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationSettings from './components/NotificationSettings';
import TwoFactorAuth from './components/TwoFactorAuth';
import KYCVerification from './components/KYCVerification';
import AdminAnalytics from './components/AdminAnalytics';
import SupportPage from './components/SupportPage';
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';

export type Page = 'landing' | 'auth' | 'dashboard' | 'ads' | 'withdraw' | 'profile' | 'admin' | 'referrals' | 'settings' | 'security' | 'notifications' | 'vip' | 'analytics' | 'support' | 'features';

// Protected Route Component
const ProtectedRoute = ({ children, user }: { children: React.ReactNode; user: User | null }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children, user }: { children: React.ReactNode; user: User | null }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (user.username !== 'mhamad') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Main App Content
const AppContent = () => {
  console.log('AppContent: Component rendering...');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
  const [showKYCVerification, setShowKYCVerification] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderRoutes = ['/auth', '/reset-password', '/admin/login'];
  const shouldShowHeader = currentUser && !isAdminMode && !hideHeaderRoutes.includes(location.pathname);

  // Memoize auth handler to prevent unnecessary re-renders
  const handleAuth = useCallback(async (userData: { email?: string; password: string; username?: string; firstName?: string; lastName?: string; birthday?: string; country?: string; referralCode?: string; referrerId?: string }) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log('Auth attempt:', { 
        hasUsername: !!userData.username, 
        hasEmail: !!userData.email, 
        isSignup: !!(userData.username && userData.email),
        userData 
      });
      
      let user: User;
      
      if (userData.username && userData.email) {
        // Sign up
        console.log('Attempting to create user...');
        user = userStorage.createUser({
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          password: userData.password,
          birthday: userData.birthday,
          referralCode: userData.referralCode,
          referrerId: userData.referrerId
        });
        
        // Update user with country if provided
        if (userData.country) {
          user.country = userData.country;
          userStorage.updateUser(user);
        }
        
        console.log('User created successfully:', user.username);
      } else {
        // Sign in - use username for login
        if (!userData.username) {
          throw new Error('Username is required for login');
        }
        console.log('Attempting to authenticate user...');
        user = userStorage.authenticateUser(userData.username, userData.password);
        console.log('User authenticated successfully:', user.username);
      }
      
      // Set current user in storage
      userStorage.setCurrentUser(user);
      
      setCurrentUser(user);
      
      // Redirect admin users to admin panel, others to dashboard
      if (user.username === 'mhamad') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Memoize logout handler
  const handleLogout = useCallback(async () => {
    if (currentUser) {
      try {
        // Terminate current session on server
        const userSessions = await serverSessionService.getUserSessions(currentUser.id);
        const currentSession = userSessions.find(s => s.isCurrentSession);
        if (currentSession) {
          await serverSessionService.terminateSession(currentSession.id);
        }
      } catch (error) {
        console.error('Error terminating session on logout:', error);
      }
    }
    userStorage.setCurrentUser(null);
    setCurrentUser(null);
    navigate('/');
  }, [navigate, currentUser]);

  // Memoize back to landing handler
  const handleBackToLanding = useCallback(() => {
    navigate('/');
    setAuthError(null);
  }, [navigate]);

  // Memoize user update handler
  const handleUserUpdate = useCallback((updatedUser: User) => {
    userStorage.updateUser(updatedUser);
    setCurrentUser(updatedUser);
  }, []);

  // Memoize navigation handler
  const navigateToPage = useCallback((page: Page) => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    switch (page) {
      case 'landing':
        navigate('/');
        break;
      case 'auth':
        navigate('/auth');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'ads':
        navigate('/ads');
        break;
      case 'withdraw':
        navigate('/withdraw');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'referrals':
        navigate('/referrals');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'security':
        navigate('/security');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'vip':
        navigate('/vip');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'support':
        navigate('/support');
        break;
      case 'features':
        navigate('/features');
        break;
    }
  }, [navigate]);

  // Memoize admin auth handler
  const handleAdminAuth = useCallback(async (userData: { username: string; password: string }) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const user = userStorage.authenticateUser(userData.username, userData.password);
      if (user.username === 'mhamad') {
        userStorage.setCurrentUser(user);
        setCurrentUser(user);
        setIsAdminMode(true);
        navigate('/admin/dashboard');
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Admin authentication failed:', error);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Memoize admin logout handler
  const handleAdminLogout = useCallback(async () => {
    if (currentUser) {
      try {
        // Terminate current session on server
        const userSessions = await serverSessionService.getUserSessions(currentUser.id);
        const currentSession = userSessions.find(s => s.isCurrentSession);
        if (currentSession) {
          await serverSessionService.terminateSession(currentSession.id);
        }
      } catch (error) {
        console.error('Error terminating session on admin logout:', error);
      }
    }
    userStorage.setCurrentUser(null);
    setCurrentUser(null);
    setIsAdminMode(false);
    navigate('/');
  }, [navigate, currentUser]);

  // Memoize landing page auth handler
  const handleLandingAuth = useCallback((referralCode?: string) => {
    if (referralCode) {
      navigate(`/auth?ref=${referralCode}`);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  // Memoize back navigation handlers
  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // Listen for data restoration events
  useEffect(() => {
    const handleDataRestored = (event: CustomEvent) => {
      const { message, userCount } = event.detail;
      console.log('Data restored:', message, 'Users:', userCount);
      
      // Show a toast notification
      if (typeof window !== 'undefined') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
          toast.style.animation = 'slideOut 0.3s ease-in';
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        }, 5000);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    };

    window.addEventListener('dataRestored', handleDataRestored as EventListener);
    
    return () => {
      window.removeEventListener('dataRestored', handleDataRestored as EventListener);
    };
  }, []);

  // Memoize current page calculation
  const currentPage = useMemo((): Page => {
    switch (location.pathname) {
      case '/':
        return 'landing';
      case '/auth':
        return 'auth';
      case '/dashboard':
        return 'dashboard';
      case '/ads':
        return 'ads';
      case '/withdraw':
        return 'withdraw';
      case '/profile':
        return 'profile';
      case '/referrals':
        return 'referrals';
      case '/settings':
        return 'settings';
      case '/security':
        return 'security';
      case '/notifications':
        return 'notifications';
      case '/vip':
        return 'vip';
      case '/analytics':
        return 'analytics';
      case '/support':
        return 'support';
      case '/features':
        return 'features';
      default:
        return 'landing';
    }
  }, [location.pathname]);

  // Add a useEffect to set isAdminMode to true whenever the pathname starts with '/admin' and the current user is admin.
  useEffect(() => {
    if (currentUser && currentUser.username === 'mhamad' && location.pathname.startsWith('/admin')) {
      setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
  }, [location.pathname, currentUser]);

  // Optimized initialization effect - only run once on mount
  useEffect(() => {
    const initializeApp = async () => {
    try {
        console.log('App initialization started');
        
      // Only create admin account if no users exist (first time setup)
      if (userStorage.getUserCount() === 0) {
        userStorage.createDefaultAdmin();
        console.log('Created default admin account (first time setup)');
      }
      
      // Remove automatic test user creation - new users should start with real accounts
      // userStorage.ensureBallenUser();
        
        // Try to get current user from localStorage
      const savedUser = userStorage.getCurrentUser();
        console.log('Initialization: savedUser from getCurrentUser:', savedUser ? savedUser.username : 'null');
      
      if (savedUser) {
          console.log('Initialization: Found saved user:', savedUser.username, 'balance:', savedUser.balance);
          
          // Validate and repair current user data
          const isValid = userStorage.validateCurrentUser();
          console.log('Initialization: Current user validation result:', isValid);
          
          // Get the validated user data
          const validatedUser = userStorage.getCurrentUser();
          console.log('Initialization: validatedUser:', validatedUser ? validatedUser.username : 'null');
          
          if (validatedUser) {
            console.log('Initialization: Setting current user:', validatedUser.username, 'balance:', validatedUser.balance);
            setCurrentUser(validatedUser);
            
            // Ensure current session exists for the logged-in user
            const currentSession = userStorage.getCurrentSession(validatedUser.id);
            if (!currentSession) {
              console.log('Initialization: No current session found, creating one for user:', validatedUser.id);
              userStorage.createSession(validatedUser.id);
            }
        
            // If user is on landing page and is authenticated, redirect to appropriate page
        if (location.pathname === '/') {
              if (validatedUser.username === 'mhamad') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
          } else {
            console.log('Initialization: validatedUser is null, not setting current user');
            // Clear any invalid current user data
            userStorage.setCurrentUser(null);
          }
        } else {
          console.log('Initialization: No saved user found');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      
        // Try to restore from backup if available
      if (userStorage.hasBackup()) {
        console.log('Attempting to restore from backup...');
          try {
            if (userStorage.restoreFromBackup()) {
              console.log('Successfully restored from backup');
              // Retry initialization after backup restore
              // Only create admin if no users exist after restore
              if (userStorage.getUserCount() === 0) {
                userStorage.createDefaultAdmin();
              }
              // userStorage.ensureBallenUser();
            const savedUser = userStorage.getCurrentUser();
            if (savedUser) {
                const isValid = userStorage.validateCurrentUser();
                console.log('Backup restore: Current user validation result:', isValid);
                
                const validatedUser = userStorage.getCurrentUser();
                if (validatedUser) {
                  setCurrentUser(validatedUser);
                  
                  // Ensure current session exists for the restored user
                  const currentSession = userStorage.getCurrentSession(validatedUser.id);
                  if (!currentSession) {
                    console.log('Backup restore: No current session found, creating one for user:', validatedUser.id);
                    userStorage.createSession(validatedUser.id);
                  }
                  
              if (location.pathname === '/') {
                    if (validatedUser.username === 'mhamad') {
                  navigate('/admin');
                } else {
                  navigate('/dashboard');
                }
              }
            }
              }
            }
          } catch (backupError) {
            console.error('Failed to restore from backup:', backupError);
        }
      } else {
          // Only clear data for critical storage errors
        if (error instanceof Error && (
          error.message.includes('storage') || 
          error.message.includes('localStorage') ||
          error.message.includes('JSON') ||
          error.message.includes('Unexpected token')
        )) {
          console.log('Critical storage error detected, clearing data...');
          userStorage.clearAllData();
          // Only create admin if no users exist after clearing
          if (userStorage.getUserCount() === 0) {
            userStorage.createDefaultAdmin();
          }
          // userStorage.ensureBallenUser();
        } else {
          console.log('Non-critical error, preserving user data');
        }
      }
    } finally {
      setIsInitializing(false);
    }
    };

    initializeApp();
  }, []); // Empty dependency array to run only once on mount

  // Track session activity for logged-in users
  useEffect(() => {
    if (!currentUser) return;

    const updateSessionActivity = async () => {
      try {
        const userSessions = await serverSessionService.getUserSessions(currentUser.id);
        const currentSession = userSessions.find(s => s.isCurrentSession);
        if (currentSession) {
          await serverSessionService.updateSessionActivity(currentSession.id);
        } else {
          // If no current session exists, create one
          console.log('📱 No current session found, creating one for user:', currentUser.id);
          await serverSessionService.createSessionWithDeviceDetection(currentUser.id);
        }
      } catch (error) {
        console.error('Error updating session activity:', error);
      }
    };

    // Update activity on user interaction
    const handleUserActivity = () => {
      updateSessionActivity();
    };

    // Initial session check and creation
    updateSessionActivity();

    // Update activity every 5 minutes
    const activityInterval = setInterval(updateSessionActivity, 5 * 60 * 1000);

    // Listen for user interactions
    document.addEventListener('mousedown', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    document.addEventListener('touchstart', handleUserActivity);

    return () => {
      clearInterval(activityInterval);
      document.removeEventListener('mousedown', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
    };
  }, [currentUser]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <div className="text-white text-lg sm:text-xl mb-3 sm:mb-4">Loading Ad money...</div>
          <div className="text-white/60 text-sm sm:text-base">Please wait while we initialize the application</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 responsive-container">
      {shouldShowHeader && (
        <Header 
          currentPage={currentPage} 
          onNavigate={navigateToPage}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}
      
      <main className={`scrollable responsive-container ${shouldShowHeader ? 'pt-[72px] sm:pt-16 lg:pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage onAuth={handleLandingAuth} />} />
          <Route 
            path="/auth" 
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage
                  onAuth={handleAuth}
                  onBack={handleBackToLanding}
                  onResetPassword={() => navigate('/reset-password')}
                  isLoading={isLoading}
                  error={authError}
                />
              )
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ResetPasswordPage 
                  onBack={() => navigate('/auth')}
                  onSuccess={() => navigate('/auth')}
                />
              )
            } 
          />
          <Route 
            path="/admin/login" 
            element={
              currentUser && currentUser.username === 'mhamad' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminLoginPage 
                  onAdminLogin={handleAdminAuth} 
                  onBack={handleBackToLanding}
                  isLoading={isLoading}
                  error={authError}
                />
              )
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              currentUser && currentUser.username === 'mhamad' ? (
                <AdminDashboard 
                  onLogout={handleAdminLogout}
                  onBack={handleBackToLanding}
                />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={currentUser}>
                <Dashboard 
                  onNavigate={navigateToPage} 
                  user={currentUser!}
                  onUserUpdate={handleUserUpdate}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ads" 
            element={
              <ProtectedRoute user={currentUser}>
                <AdViewer 
                  onNavigate={navigateToPage}
                  user={currentUser!}
                  onUserUpdate={handleUserUpdate}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/withdraw" 
            element={
              <ProtectedRoute user={currentUser}>
                <WithdrawPage 
                  user={currentUser!}
                  onUserUpdate={handleUserUpdate}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute user={currentUser}>
                <ProfilePage 
                  user={currentUser!}
                  onUserUpdate={handleUserUpdate}
                  navigate={(path: string) => navigate(path)}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/referrals" 
            element={
              <ProtectedRoute user={currentUser}>
                <ReferralPage 
                  onBack={handleBackToDashboard}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute user={currentUser}>
                <SettingsPage 
                  user={currentUser!}
                  onUserUpdate={handleUserUpdate}
                  onBack={handleBackToDashboard}
                  showSecurityAndNotifications={true}
                  onShowNotificationSettings={() => setShowNotificationSettings(true)}
                  onShowTwoFactorAuth={() => setShowTwoFactorAuth(true)}
                  onShowKYCVerification={() => setShowKYCVerification(true)}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vip" 
            element={
              <ProtectedRoute user={currentUser}>
                <VIPPage 
                  user={currentUser!}
                  onUserUpdate={handleUserUpdate}
                  onBack={handleBackToDashboard}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <AdminRoute user={currentUser}>
                <AdminAnalytics />
              </AdminRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute user={currentUser}>
                <SupportPage 
                  onBack={handleBackToDashboard}
                />
              </ProtectedRoute>
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* PWA Install Prompt */}
      {/* <PWAInstallPrompt /> */}

      {/* Modals */}
      {showNotificationSettings && (
        <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
      )}
      {showTwoFactorAuth && (
        <TwoFactorAuth onClose={() => setShowTwoFactorAuth(false)} />
      )}
      {showKYCVerification && (
        <KYCVerification onClose={() => setShowKYCVerification(false)} />
      )}
    </div>
  );
};

// Main App Component
function App() {
  console.log('App: Component rendering...');
  
  useEffect(() => {
    console.log('App: Component mounted');
  }, []);
  
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;