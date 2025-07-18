import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Clock, 
  LogOut, 
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';
import { userStorage, DeviceSession } from '../utils/userStorage';

interface SessionManagerProps {
  userId: string;
  onSessionTerminated?: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ userId, onSessionTerminated }) => {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);
  const [terminatingAll, setTerminatingAll] = useState(false);

  useEffect(() => {
    loadSessions();
    
    // If no current session exists, create one
    const checkAndCreateSession = () => {
      const userSessions = userStorage.getUserSessions(userId);
      const currentSession = userSessions.find(s => s.isCurrentSession);
      
      if (!currentSession) {
        userStorage.createSession(userId);
        loadSessions();
      }
    };
    
    // Check after a short delay to ensure initial load is complete
    const timeoutId = setTimeout(checkAndCreateSession, 1000);
    
    // Update sessions every 30 seconds to refresh "last active" times
    const interval = setInterval(loadSessions, 30000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [userId]);

  const loadSessions = () => {
    console.log('📱 SessionManager: Loading sessions for user:', userId);
    // Clean up duplicates before loading
    userStorage.removeDuplicateSessions(userId);
    const userSessions = userStorage.getUserSessions(userId);
    console.log('📱 SessionManager: Found sessions:', userSessions);
    setSessions(userSessions);
    setLoading(false);
  };

  const handleTerminateSession = async (sessionId: string) => {
    setTerminatingSession(sessionId);
    try {
      userStorage.terminateSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      onSessionTerminated?.();
    } catch (error) {
      console.error('Error terminating session:', error);
    } finally {
      setTerminatingSession(null);
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    setTerminatingAll(true);
    try {
      userStorage.terminateAllOtherSessions(userId);
      const currentSession = userStorage.getCurrentSession(userId);
      setSessions(currentSession ? [currentSession] : []);
      onSessionTerminated?.();
    } catch (error) {
      console.error('Error terminating all other sessions:', error);
    } finally {
      setTerminatingAll(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceTypeColor = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return 'text-blue-400';
      case 'tablet':
        return 'text-purple-400';
      default:
        return 'text-green-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-white/60 animate-spin" />
        <span className="ml-2 text-white/60">Loading sessions...</span>
      </div>
    );
  }

  if (sessions.length === 0) {
    // If no sessions found, create one for the current browser
    console.log('📱 No sessions found, creating current session for user:', userId);
    userStorage.createSession(userId);
    // Return loading state while creating session
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-white/60 animate-spin" />
        <span className="ml-2 text-white/60">Creating current session...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Session */}
      {sessions.filter(s => s.isCurrentSession).map(session => (
        <div key={session.id} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`mt-1 ${getDeviceTypeColor(session.deviceType)}`}>
                {getDeviceIcon(session.deviceType)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-white">{session.deviceName}</h4>
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    Current Session
                  </span>
                </div>
                <p className="text-white/70 text-sm mb-2">
                  {session.browser} on {session.os}
                </p>
                <div className="flex items-center space-x-4 text-xs text-white/60">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Logged in {userStorage.formatRelativeTime(session.loginTime)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Last active {userStorage.formatRelativeTime(session.lastActive)}</span>
                  </span>
                </div>
                {session.ipAddress && (
                  <div className="flex items-center space-x-4 text-xs text-white/60 mt-1">
                    <span className="flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>IP: {session.ipAddress}</span>
                    </span>
                    {session.location && (
                      <span className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>Location: {session.location}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Other Sessions */}
      {sessions.filter(s => !s.isCurrentSession).length > 0 && (
        <>
          <div className="border-t border-white/20 pt-4">
            <h4 className="text-white font-semibold mb-3">Other Active Sessions</h4>
            <div className="space-y-3">
              {sessions.filter(s => !s.isCurrentSession).map(session => (
                <div key={session.id} className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${getDeviceTypeColor(session.deviceType)}`}>
                        {getDeviceIcon(session.deviceType)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{session.deviceName}</h4>
                        <p className="text-white/70 text-sm mb-2">
                          {session.browser} on {session.os}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Logged in {userStorage.formatRelativeTime(session.loginTime)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>Last active {userStorage.formatRelativeTime(session.lastActive)}</span>
                          </span>
                        </div>
                        {session.ipAddress && (
                          <div className="flex items-center space-x-4 text-xs text-white/60 mt-1">
                            <span className="flex items-center space-x-1">
                              <Globe className="w-3 h-3" />
                              <span>IP: {session.ipAddress}</span>
                            </span>
                            {session.location && (
                              <span className="flex items-center space-x-1">
                                <Globe className="w-3 h-3" />
                                <span>Location: {session.location}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      disabled={terminatingSession === session.id}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 text-sm font-medium border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {terminatingSession === session.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <LogOut className="w-3 h-3" />
                      )}
                      <span>{terminatingSession === session.id ? 'Terminating...' : 'Log out'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminate All Other Sessions Button */}
          <div className="border-t border-white/20 pt-4">
            <button
              onClick={handleTerminateAllOtherSessions}
              disabled={terminatingAll}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 font-medium border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {terminatingAll ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>
                {terminatingAll ? 'Terminating...' : 'Log out of all other devices'}
              </span>
            </button>
            <p className="text-white/50 text-xs mt-2 text-center">
              This will log you out of all devices except this one
            </p>
          </div>
        </>
      )}

      {/* Session Info */}
      <div className="bg-white/5 rounded-lg p-4 mt-6">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <h4 className="text-white font-semibold">Session Security</h4>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <p>• Your sessions are automatically tracked for security</p>
          <p>• You can log out of individual devices or all devices at once</p>
          <p>• Sessions show device type, browser, and last activity</p>
          <p>• Current session is highlighted in green</p>
        </div>
        
        {/* Debug Section */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <h5 className="text-white font-medium mb-2">Debug Tools</h5>
          <div className="space-y-2">
            <button 
              onClick={() => {
                console.log('🔧 Manual session creation for user:', userId);
                userStorage.createSession(userId);
                setTimeout(loadSessions, 1000);
              }}
              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded text-xs"
            >
              Create Test Session
            </button>
            <button 
              onClick={() => {
                console.log('🔧 Clearing all sessions for user:', userId);
                userStorage.terminateAllSessions(userId);
                loadSessions();
              }}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded text-xs ml-2"
            >
              Clear All Sessions
            </button>
            <button 
              onClick={() => {
                console.log('🔧 Current user agent:', navigator.userAgent);
                console.log('🔧 Current location:', window.location.href);
                alert(`User Agent: ${navigator.userAgent}\nLocation: ${window.location.href}`);
              }}
              className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 rounded text-xs ml-2"
            >
              Show Debug Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 