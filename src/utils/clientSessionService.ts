import { DeviceSession } from './userStorage';

// Client-side session service for Netlify deployment
class ClientSessionService {
  private readonly SESSIONS_KEY = 'clientSessions';
  private sessions: DeviceSession[] = [];

  constructor() {
    this.loadSessions();
  }

  private loadSessions(): void {
    try {
      const stored = localStorage.getItem(this.SESSIONS_KEY);
      if (stored) {
        this.sessions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sessions from localStorage:', error);
      this.sessions = [];
    }
  }

  private saveSessions(): void {
    try {
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(this.sessions));
    } catch (error) {
      console.error('Error saving sessions to localStorage:', error);
    }
  }

  // Detect device information from user agent
  private detectDeviceInfo(userAgent: string): {
    deviceName: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  } {
    const ua = userAgent.toLowerCase();
    
    // Detect device type
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    let deviceName = 'Desktop Computer';
    
    const isMobile = ua.includes('mobile') || 
                    ua.includes('android') || 
                    ua.includes('iphone') || 
                    ua.includes('ipod') ||
                    ua.includes('blackberry') ||
                    ua.includes('windows phone') ||
                    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    
    const isTablet = ua.includes('tablet') || 
                    (ua.includes('ipad') && !ua.includes('mobile')) ||
                    ua.includes('playbook') ||
                    ua.includes('kindle');
    
    if (isMobile && !isTablet) {
      deviceType = 'mobile';
      deviceName = 'Mobile Device';
    } else if (isTablet) {
      deviceType = 'tablet';
      deviceName = 'Tablet Device';
    }
    
    // Detect browser
    let browser = 'Unknown Browser';
    if (ua.includes('chrome')) {
      browser = ua.includes('mobile') ? 'Chrome Mobile' : 'Chrome';
    } else if (ua.includes('firefox')) {
      browser = ua.includes('mobile') ? 'Firefox Mobile' : 'Firefox';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      browser = ua.includes('mobile') ? 'Safari Mobile' : 'Safari';
    } else if (ua.includes('edge')) {
      browser = ua.includes('mobile') ? 'Edge Mobile' : 'Edge';
    } else if (ua.includes('opera')) {
      browser = ua.includes('mobile') ? 'Opera Mobile' : 'Opera';
    }
    
    // Detect OS
    let os = 'Unknown OS';
    if (ua.includes('windows')) {
      os = ua.includes('phone') ? 'Windows Phone' : 'Windows';
    } else if (ua.includes('mac os')) {
      os = ua.includes('iphone') || ua.includes('ipad') ? 'iOS' : 'macOS';
    } else if (ua.includes('linux')) {
      os = 'Linux';
    } else if (ua.includes('android')) {
      os = 'Android';
    } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
      os = 'iOS';
    }
    
    // Set specific device names
    if (ua.includes('iphone')) {
      deviceName = 'iPhone';
      deviceType = 'mobile';
    } else if (ua.includes('ipad')) {
      deviceName = 'iPad';
      deviceType = 'tablet';
    } else if (ua.includes('android')) {
      if (ua.includes('samsung')) deviceName = 'Samsung Device';
      else if (ua.includes('huawei')) deviceName = 'Huawei Device';
      else if (ua.includes('xiaomi')) deviceName = 'Xiaomi Device';
      else if (ua.includes('oneplus')) deviceName = 'OnePlus Device';
      else if (ua.includes('google')) deviceName = 'Google Device';
      else deviceName = 'Android Device';
    }
    
    return { deviceName, deviceType, browser, os };
  }

  // Get all sessions for a user
  async getUserSessions(userId: string): Promise<DeviceSession[]> {
    console.log('📱 ClientSessionService: Getting sessions for user:', userId);
    const userSessions = this.sessions.filter(session => session.userId === userId);
    console.log('📱 ClientSessionService: Found sessions:', userSessions);
    return userSessions;
  }

  // Create a new session
  async createSession(userId: string, deviceInfo: any, userAgent: string): Promise<DeviceSession> {
    console.log('📱 ClientSessionService: Creating session for user:', userId);
    
    // Mark all existing sessions for this user as not current
    this.sessions.forEach(session => {
      if (session.userId === userId) {
        session.isCurrentSession = false;
      }
    });
    
    // Check if there's already a session for this user and user agent
    const existingSession = this.sessions.find(session => 
      session.userId === userId && 
      session.userAgent === userAgent
    );
    
    if (existingSession) {
      // Update existing session
      existingSession.isCurrentSession = true;
      existingSession.lastActive = new Date().toISOString();
      existingSession.deviceName = deviceInfo.deviceName;
      existingSession.deviceType = deviceInfo.deviceType;
      existingSession.browser = deviceInfo.browser;
      existingSession.os = deviceInfo.os;
      
      this.saveSessions();
      return existingSession;
    }
    
    // Create new session
    const newSession: DeviceSession = {
      id: `client_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceName: deviceInfo.deviceName,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress: 'Client-side',
      location: 'Client-side',
      lastActive: new Date().toISOString(),
      isCurrentSession: true,
      userAgent,
      loginTime: new Date().toISOString()
    };
    
    this.sessions.push(newSession);
    this.saveSessions();
    
    console.log('📱 ClientSessionService: Session created:', newSession);
    return newSession;
  }

  // Create session with device detection
  async createSessionWithDeviceDetection(userId: string): Promise<DeviceSession> {
    const userAgent = navigator.userAgent;
    const deviceInfo = this.detectDeviceInfo(userAgent);
    return this.createSession(userId, deviceInfo, userAgent);
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<DeviceSession> {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.lastActive = new Date().toISOString();
      this.saveSessions();
    }
    return session!;
  }

  // Terminate a specific session
  async terminateSession(sessionId: string): Promise<{ message: string; session: DeviceSession }> {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      const session = this.sessions[sessionIndex];
      this.sessions.splice(sessionIndex, 1);
      this.saveSessions();
      return { message: 'Session terminated successfully', session };
    }
    throw new Error('Session not found');
  }

  // Terminate all sessions for a user except current
  async terminateAllOtherSessions(userId: string): Promise<{ message: string; remainingSessions: DeviceSession[] }> {
    const currentSession = this.sessions.find(s => s.userId === userId && s.isCurrentSession);
    const otherSessions = this.sessions.filter(s => s.userId === userId && !s.isCurrentSession);
    
    this.sessions = this.sessions.filter(s => s.userId !== userId || s.isCurrentSession);
    this.saveSessions();
    
    return { 
      message: `Terminated ${otherSessions.length} other sessions`, 
      remainingSessions: currentSession ? [currentSession] : [] 
    };
  }

  // Terminate all sessions for a user
  async terminateAllSessions(userId: string): Promise<{ message: string; deletedSessions: DeviceSession[] }> {
    const userSessions = this.sessions.filter(s => s.userId === userId);
    this.sessions = this.sessions.filter(s => s.userId !== userId);
    this.saveSessions();
    
    return { 
      message: `Terminated all ${userSessions.length} sessions`, 
      deletedSessions: userSessions 
    };
  }

  // Get session statistics
  async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    activeSessions: number;
    sessionsByDeviceType: { [key: string]: number };
    sessionsByBrowser: { [key: string]: number };
    sessionsByOS: { [key: string]: number };
  }> {
    const userSessions = this.sessions.filter(s => s.userId === userId);
    
    const stats = {
      totalSessions: userSessions.length,
      activeSessions: userSessions.filter(s => s.isCurrentSession).length,
      sessionsByDeviceType: {} as { [key: string]: number },
      sessionsByBrowser: {} as { [key: string]: number },
      sessionsByOS: {} as { [key: string]: number }
    };
    
    userSessions.forEach(session => {
      stats.sessionsByDeviceType[session.deviceType] = (stats.sessionsByDeviceType[session.deviceType] || 0) + 1;
      stats.sessionsByBrowser[session.browser] = (stats.sessionsByBrowser[session.browser] || 0) + 1;
      stats.sessionsByOS[session.os] = (stats.sessionsByOS[session.os] || 0) + 1;
    });
    
    return stats;
  }

  // Test session functionality
  async testSessionFunctionality(): Promise<{ message: string; sessions: DeviceSession[]; totalSessions: number }> {
    const testUserId = 'test-user-123';
    
    // Create test sessions
    const testSessions = [
      await this.createSession(testUserId, {
        deviceName: 'Test Device 1',
        deviceType: 'desktop',
        browser: 'Chrome',
        os: 'Windows'
      }, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
      
      await this.createSession(testUserId, {
        deviceName: 'Test Device 2',
        deviceType: 'mobile',
        browser: 'Safari Mobile',
        os: 'iOS'
      }, 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'),
      
      await this.createSession(testUserId, {
        deviceName: 'Test Device 3',
        deviceType: 'tablet',
        browser: 'Safari Mobile',
        os: 'iOS'
      }, 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15')
    ];
    
    return {
      message: 'Test sessions created',
      sessions: testSessions,
      totalSessions: this.sessions.length
    };
  }
}

export const clientSessionService = new ClientSessionService(); 