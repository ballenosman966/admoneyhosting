import React, { useState, useEffect } from 'react';
import { RefreshCw, LogOut, Clock, Globe, CheckCircle, AlertTriangle, Smartphone, Monitor, Tablet } from 'lucide-react';
import { serverSessionService, DeviceSession } from '../utils/serverSessionService';
import { User } from '../utils/userStorage';

interface SessionManagerProps {
  userId: string;
  currentUser?: User | null;
  onSessionTerminated?: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ userId, currentUser, onSessionTerminated }) => {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);
  const [terminatingAll, setTerminatingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
    
    // If no current session exists, create one
    const checkAndCreateSession = async () => {
      try {
        const userSessions = await serverSessionService.getUserSessions(userId);
        const currentSession = userSessions.find(s => s.isCurrentSession);
        
        if (!currentSession) {
          await serverSessionService.createSessionWithDeviceDetection(userId);
          loadSessions();
        }
      } catch (error) {
        console.error('Error checking/creating session:', error);
        setError('Failed to create session. Please try again.');
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

  const loadSessions = async () => {
    try {
      console.log('📱 SessionManager: Loading sessions for user:', userId);
      console.log('📱 SessionManager: API URL:', 'http://localhost:3001/api/sessions/' + userId);
      
      const userSessions = await serverSessionService.getUserSessions(userId);
      console.log('📱 SessionManager: Found sessions:', userSessions);
      setSessions(userSessions);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('❌ SessionManager: Error loading sessions:', error);
      console.error('❌ SessionManager: Error details:', error instanceof Error ? error.message : String(error));
      setError('Failed to load sessions. Please try again.');
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    setTerminatingSession(sessionId);
    try {
      await serverSessionService.terminateSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      onSessionTerminated?.();
    } catch (error) {
      console.error('Error terminating session:', error);
      setError('Failed to terminate session. Please try again.');
    } finally {
      setTerminatingSession(null);
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    setTerminatingAll(true);
    try {
      const result = await serverSessionService.terminateAllOtherSessions(userId);
      setSessions(result.remainingSessions);
      onSessionTerminated?.();
    } catch (error) {
      console.error('Error terminating all other sessions:', error);
      setError('Failed to terminate other sessions. Please try again.');
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

  const formatRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-white/60 animate-spin" />
        <span className="ml-2 text-white/60">Loading sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm">{error}</p>
          <button 
            onClick={loadSessions}
            className="mt-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    // If no sessions found, create one for the current browser
    console.log('📱 No sessions found, creating current session for user:', userId);
    serverSessionService.createSessionWithDeviceDetection(userId).then(() => {
      loadSessions();
    });
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
                    <span>Logged in {formatRelativeTime(session.loginTime)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Last active {formatRelativeTime(session.lastActive)}</span>
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
                            <span>Logged in {formatRelativeTime(session.loginTime)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>Last active {formatRelativeTime(session.lastActive)}</span>
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

      {/* Session Statistics */}
      <div className="bg-white/5 rounded-lg p-4 mt-6">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <h4 className="text-white font-semibold">Session Statistics</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{sessions.length}</div>
            <div className="text-xs text-white/60">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {sessions.filter(s => s.isCurrentSession).length}
            </div>
            <div className="text-xs text-white/60">Current Session</div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <p>• Device Types: {Array.from(new Set(sessions.map(s => s.deviceType))).join(', ')}</p>
          <p>• Browsers: {Array.from(new Set(sessions.map(s => s.browser))).join(', ')}</p>
          <p>• Operating Systems: {Array.from(new Set(sessions.map(s => s.os))).join(', ')}</p>
        </div>
      </div>

      {/* Session Security Info */}
      <div className="bg-white/5 rounded-lg p-4 mt-4">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <h4 className="text-white font-semibold">Session Security</h4>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <p>• Your sessions are automatically tracked for security</p>
          <p>• You can log out of individual devices or all devices at once</p>
          <p>• Sessions show device type, browser, and last activity</p>
          <p>• Current session is highlighted in green</p>
          <p>• Sessions are synchronized across all your devices</p>
        </div>
        
        {/* Debug Section - Only for Admin Users */}
        {currentUser && currentUser.username === 'mhamad' && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <h5 className="text-white font-medium mb-2">Debug Tools</h5>
            <div className="space-y-2">
              <button 
                onClick={async () => {
                  console.log('🔧 Manual session creation for user:', userId);
                  try {
                    await serverSessionService.createSessionWithDeviceDetection(userId);
                    setTimeout(loadSessions, 1000);
                  } catch (error) {
                    console.error('Error creating session:', error);
                  }
                }}
                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded text-xs"
              >
                Create Test Session
              </button>
              <button 
                onClick={async () => {
                  console.log('🔧 Clearing all sessions for user:', userId);
                  try {
                    await serverSessionService.terminateAllSessions(userId);
                    loadSessions();
                  } catch (error) {
                    console.error('Error clearing sessions:', error);
                  }
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
              <button 
                onClick={async () => {
                  console.log('🧪 Testing session functionality...');
                  try {
                    const result = await serverSessionService.testSessionFunctionality();
                    const stats = await serverSessionService.getSessionStats(userId);
                    console.log('📊 Session stats:', stats);
                    console.log('🧪 Test result:', result);
                    alert(`Session Test Complete!\n\nTotal Sessions: ${stats.totalSessions}\nActive Sessions: ${stats.activeSessions}\n\nCheck console for detailed results.`);
                  } catch (error) {
                    console.error('Error testing sessions:', error);
                    alert('Error testing sessions. Check console for details.');
                  }
                }}
                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded text-xs ml-2"
              >
                Test Sessions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 