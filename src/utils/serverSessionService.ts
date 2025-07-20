const API_BASE_URL = 'http://localhost:3001/api';

export interface DeviceSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress?: string;
  location?: string;
  lastActive: string;
  isCurrentSession: boolean;
  userAgent: string;
  loginTime: string;
}

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  sessionsByDeviceType: { [key: string]: number };
  sessionsByBrowser: { [key: string]: number };
  sessionsByOS: { [key: string]: number };
}

class ServerSessionService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('🌐 ServerSessionService: Making request to:', url);
      console.log('🌐 ServerSessionService: Request options:', options);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('🌐 ServerSessionService: Response status:', response.status);
      console.log('🌐 ServerSessionService: Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🌐 ServerSessionService: Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('🌐 ServerSessionService: Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ ServerSessionService: API request failed:', error);
      console.error('❌ ServerSessionService: Error details:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  // Get all sessions for a user
  async getUserSessions(userId: string): Promise<DeviceSession[]> {
    console.log('🌐 ServerSessionService: Getting sessions for user:', userId);
    console.log('🌐 ServerSessionService: User ID type:', typeof userId);
    console.log('🌐 ServerSessionService: User ID value:', userId);
    
    try {
      const result = await this.makeRequest(`/sessions/${userId}`);
      console.log('🌐 ServerSessionService: Successfully got sessions:', result);
      return result;
    } catch (error) {
      console.error('❌ ServerSessionService: Failed to get sessions for user:', userId);
      console.error('❌ ServerSessionService: Error:', error);
      throw error;
    }
  }

  // Create a new session
  async createSession(userId: string, deviceInfo: any, userAgent: string): Promise<DeviceSession> {
    return this.makeRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify({ userId, deviceInfo, userAgent }),
    });
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<DeviceSession> {
    return this.makeRequest(`/sessions/${sessionId}/activity`, {
      method: 'PUT',
    });
  }

  // Terminate a specific session
  async terminateSession(sessionId: string): Promise<{ message: string; session: DeviceSession }> {
    return this.makeRequest(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Terminate all sessions for a user except current
  async terminateAllOtherSessions(userId: string): Promise<{ message: string; remainingSessions: DeviceSession[] }> {
    return this.makeRequest(`/sessions/user/${userId}/others`, {
      method: 'DELETE',
    });
  }

  // Terminate all sessions for a user
  async terminateAllSessions(userId: string): Promise<{ message: string; deletedSessions: DeviceSession[] }> {
    return this.makeRequest(`/sessions/user/${userId}`, {
      method: 'DELETE',
    });
  }

  // Get session statistics
  async getSessionStats(userId: string): Promise<SessionStats> {
    return this.makeRequest(`/sessions/stats/${userId}`);
  }

  // Test session functionality
  async testSessionFunctionality(): Promise<{ message: string; sessions: DeviceSession[]; totalSessions: number }> {
    return this.makeRequest('/sessions/test', {
      method: 'POST',
    });
  }

  // Detect device information from user agent
  private detectDeviceInfo(userAgent: string): {
    deviceName: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  } {
    const ua = userAgent.toLowerCase();
    
    // Detect device type with improved mobile detection
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    let deviceName = 'Desktop Computer';
    
    // Check for mobile indicators
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
    
    // Detect browser with mobile browser support
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
    } else if (ua.includes('samsung')) {
      browser = 'Samsung Internet';
    }
    
    // Detect OS with mobile OS support
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
    } else if (ua.includes('blackberry')) {
      os = 'BlackBerry OS';
    }
    
    // Set more specific device names
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
    } else if (ua.includes('blackberry')) {
      deviceName = 'BlackBerry';
      deviceType = 'mobile';
    }
    
    return { deviceName, deviceType, browser, os };
  }

  // Create session with device detection
  async createSessionWithDeviceDetection(userId: string): Promise<DeviceSession> {
    const userAgent = navigator.userAgent;
    const deviceInfo = this.detectDeviceInfo(userAgent);
    
    return this.createSession(userId, deviceInfo, userAgent);
  }
}

export const serverSessionService = new ServerSessionService(); 