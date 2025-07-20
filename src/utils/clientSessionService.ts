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

  // Get location using browser geolocation API as fallback
  private async getBrowserLocation(): Promise<string> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('Location unavailable');
        return;
      }

      const timeoutId = setTimeout(() => {
        resolve('Location unavailable');
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          try {
            const { latitude, longitude } = position.coords;
            console.log('🌐 ClientSessionService: Browser geolocation coordinates:', { latitude, longitude });
            
            // Try multiple reverse geocoding services
            const geocodingServices = [
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9c7e1b22f2e86b6860e02b276463374c`
            ];

            for (const service of geocodingServices) {
              try {
                const response = await fetch(service, { 
                  signal: AbortSignal.timeout(3000),
                  headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'SessionManager/1.0'
                  }
                });
                
                if (response.ok) {
                  const data = await response.json();
                  let location = '';
                  
                  if (service.includes('bigdatacloud')) {
                    if (data.city && data.countryName) {
                      location = `${data.city}, ${data.countryName}`;
                    } else if (data.locality && data.countryName) {
                      location = `${data.locality}, ${data.countryName}`;
                    } else if (data.countryName) {
                      location = data.countryName;
                    }
                  } else if (service.includes('nominatim')) {
                    if (data.address) {
                      const city = data.address.city || data.address.town || data.address.village;
                      const country = data.address.country;
                      if (city && country) {
                        location = `${city}, ${country}`;
                      } else if (country) {
                        location = country;
                      }
                    }
                  } else if (service.includes('opencagedata')) {
                    if (data.results && data.results[0]) {
                      const components = data.results[0].components;
                      const city = components.city || components.town || components.village;
                      const country = components.country;
                      if (city && country) {
                        location = `${city}, ${country}`;
                      } else if (country) {
                        location = country;
                      }
                    }
                  }
                  
                  if (location) {
                    console.log('🌐 ClientSessionService: Reverse geocoding successful:', location);
                    resolve(location);
                    return;
                  }
                }
              } catch (error) {
                console.warn('🌐 ClientSessionService: Reverse geocoding service failed:', service, error);
                continue;
              }
            }
            
            resolve('Location unavailable');
          } catch (error) {
            console.warn('🌐 ClientSessionService: Reverse geocoding failed:', error);
            resolve('Location unavailable');
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.warn('🌐 ClientSessionService: Browser geolocation failed:', error);
          resolve('Location unavailable');
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Get basic location from timezone and language
  private getBasicLocationFromTimezone(): string {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language || navigator.languages?.[0] || 'en';
      
      console.log('🌐 ClientSessionService: Timezone:', timezone, 'Language:', language);
      
      // Map common timezones to locations
      const timezoneMap: { [key: string]: string } = {
        'America/New_York': 'Eastern US',
        'America/Chicago': 'Central US',
        'America/Denver': 'Mountain US',
        'America/Los_Angeles': 'Western US',
        'America/Toronto': 'Canada',
        'Europe/London': 'United Kingdom',
        'Europe/Paris': 'France',
        'Europe/Berlin': 'Germany',
        'Europe/Rome': 'Italy',
        'Europe/Madrid': 'Spain',
        'Europe/Amsterdam': 'Netherlands',
        'Europe/Stockholm': 'Sweden',
        'Europe/Oslo': 'Norway',
        'Europe/Copenhagen': 'Denmark',
        'Europe/Helsinki': 'Finland',
        'Europe/Warsaw': 'Poland',
        'Europe/Prague': 'Czech Republic',
        'Europe/Budapest': 'Hungary',
        'Europe/Vienna': 'Austria',
        'Europe/Zurich': 'Switzerland',
        'Europe/Brussels': 'Belgium',
        'Europe/Dublin': 'Ireland',
        'Europe/Lisbon': 'Portugal',
        'Europe/Athens': 'Greece',
        'Europe/Istanbul': 'Turkey',
        'Asia/Tokyo': 'Japan',
        'Asia/Seoul': 'South Korea',
        'Asia/Shanghai': 'China',
        'Asia/Hong_Kong': 'Hong Kong',
        'Asia/Singapore': 'Singapore',
        'Asia/Bangkok': 'Thailand',
        'Asia/Jakarta': 'Indonesia',
        'Asia/Manila': 'Philippines',
        'Asia/Kolkata': 'India',
        'Asia/Dubai': 'UAE',
        'Asia/Riyadh': 'Saudi Arabia',
        'Asia/Tehran': 'Iran',
        'Asia/Jerusalem': 'Israel',
        'Africa/Cairo': 'Egypt',
        'Africa/Lagos': 'Nigeria',
        'Africa/Johannesburg': 'South Africa',
        'Australia/Sydney': 'Australia',
        'Australia/Melbourne': 'Australia',
        'Australia/Perth': 'Australia',
        'Pacific/Auckland': 'New Zealand',
        'Pacific/Honolulu': 'Hawaii'
      };
      
      // Try to get location from timezone
      if (timezoneMap[timezone]) {
        return timezoneMap[timezone];
      }
      
      // Try to get location from language
      const languageMap: { [key: string]: string } = {
        'en': 'English-speaking region',
        'es': 'Spanish-speaking region',
        'fr': 'French-speaking region',
        'de': 'German-speaking region',
        'it': 'Italian-speaking region',
        'pt': 'Portuguese-speaking region',
        'ru': 'Russian-speaking region',
        'ja': 'Japanese-speaking region',
        'ko': 'Korean-speaking region',
        'zh': 'Chinese-speaking region',
        'ar': 'Arabic-speaking region',
        'hi': 'Hindi-speaking region'
      };
      
      const langCode = language.split('-')[0];
      if (languageMap[langCode]) {
        return languageMap[langCode];
      }
      
      // Extract country from timezone if possible
      const timezoneParts = timezone.split('/');
      if (timezoneParts.length > 1) {
        const region = timezoneParts[1].replace('_', ' ');
        return region;
      }
      
      return 'Unknown location';
    } catch (error) {
      console.warn('🌐 ClientSessionService: Error getting basic location from timezone:', error);
      return 'Location unavailable';
    }
  }

  // Get IP address and location from external APIs
  private async getIPAndLocation(): Promise<{ ipAddress: string; location: string }> {
    try {
      console.log('🌐 ClientSessionService: Fetching IP and location...');
      
      // Try multiple IP/location services for better reliability
      const services = [
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
        'https://api.myip.com',
        'https://api.ipify.org?format=json',
        'https://api64.ipify.org?format=json',
        'https://api.ip.sb/ip'
      ];

      for (const service of services) {
        try {
          console.log('🌐 ClientSessionService: Trying service:', service);
          const response = await fetch(service, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'SessionManager/1.0'
            },
            // Add timeout
            signal: AbortSignal.timeout(3000)
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          let data;
          if (service.includes('ip.sb')) {
            // ip.sb returns plain text
            const text = await response.text();
            data = { ip: text.trim() };
          } else {
            data = await response.json();
          }
          
          console.log('🌐 ClientSessionService: Service response:', data);

          let ipAddress = '';
          let location = '';

          // Parse different response formats with better location detection
          if (service.includes('ipapi.co')) {
            ipAddress = data.ip || '';
            if (data.city && data.region && data.country) {
              location = `${data.city}, ${data.region}, ${data.country}`;
            } else if (data.city && data.country) {
              location = `${data.city}, ${data.country}`;
            } else if (data.region && data.country) {
              location = `${data.region}, ${data.country}`;
            } else if (data.country) {
              location = data.country;
            }
          } else if (service.includes('ipinfo.io')) {
            ipAddress = data.ip || '';
            if (data.city && data.region && data.country) {
              location = `${data.city}, ${data.region}, ${data.country}`;
            } else if (data.city && data.country) {
              location = `${data.city}, ${data.country}`;
            } else if (data.region && data.country) {
              location = `${data.region}, ${data.country}`;
            } else if (data.country) {
              location = data.country;
            }
          } else if (service.includes('myip.com')) {
            ipAddress = data.ip || '';
            if (data.city && data.country) {
              location = `${data.city}, ${data.country}`;
            } else if (data.country) {
              location = data.country;
            }
          } else if (service.includes('ipify')) {
            ipAddress = data.ip || '';
          } else if (service.includes('ip.sb')) {
            ipAddress = data.ip || '';
          }

          if (ipAddress && ipAddress !== 'undefined' && ipAddress !== 'null') {
            console.log('🌐 ClientSessionService: IP and location found:', { ipAddress, location });
            return { 
              ipAddress, 
              location: location || 'Location unavailable' 
            };
          }
        } catch (error) {
          console.warn('🌐 ClientSessionService: Service failed:', service, error);
          continue;
        }
      }

      // If we have an IP but no location, try a dedicated geolocation service
      try {
        console.log('🌐 ClientSessionService: Trying dedicated geolocation service...');
        const ipResponse = await fetch('https://api.ipify.org?format=json', {
          signal: AbortSignal.timeout(2000),
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SessionManager/1.0'
          }
        });
        const ipData = await ipResponse.json();
        
        if (ipData.ip && ipData.ip !== 'undefined' && ipData.ip !== 'null') {
          // Try to get location for this IP using multiple services
          const geoServices = [
            `https://ipapi.co/${ipData.ip}/json/`,
            `https://ipinfo.io/${ipData.ip}/json`,
            `https://api.ipapi.com/api/${ipData.ip}?access_key=9c7e1b22f2e86b6860e02b276463374c`
          ];

          for (const geoService of geoServices) {
            try {
              const geoResponse = await fetch(geoService, {
                signal: AbortSignal.timeout(3000),
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'SessionManager/1.0'
                }
              });
              
              if (geoResponse.ok) {
                const geoData = await geoResponse.json();
                
                let location = '';
                if (geoData.city && geoData.region && geoData.country) {
                  location = `${geoData.city}, ${geoData.region}, ${geoData.country}`;
                } else if (geoData.city && geoData.country) {
                  location = `${geoData.city}, ${geoData.country}`;
                } else if (geoData.region && geoData.country) {
                  location = `${geoData.region}, ${geoData.country}`;
                } else if (geoData.country) {
                  location = geoData.country;
                }
                
                if (location) {
                  console.log('🌐 ClientSessionService: Dedicated geolocation successful:', { ip: ipData.ip, location });
                  return { 
                    ipAddress: ipData.ip, 
                    location: location
                  };
                }
              }
            } catch (geoError) {
              console.warn('🌐 ClientSessionService: Geolocation service failed:', geoService, geoError);
              continue;
            }
          }
          
          // If all geolocation services fail, try browser geolocation
          console.log('🌐 ClientSessionService: All geolocation services failed, trying browser geolocation...');
          const browserLocation = await this.getBrowserLocation();
          return { 
            ipAddress: ipData.ip, 
            location: browserLocation
          };
        }
      } catch (error) {
        console.warn('🌐 ClientSessionService: IP detection failed:', error);
      }

      // Final fallback - try browser geolocation
      try {
        console.log('🌐 ClientSessionService: Trying browser geolocation as fallback...');
        const browserLocation = await this.getBrowserLocation();
        return { 
          ipAddress: 'IP unavailable', 
          location: browserLocation
        };
      } catch (error) {
        console.warn('🌐 ClientSessionService: Browser geolocation fallback failed:', error);
        
        // Ultimate fallback - use timezone and language
        console.log('🌐 ClientSessionService: Using timezone-based location as ultimate fallback...');
        const basicLocation = this.getBasicLocationFromTimezone();
        return { 
          ipAddress: 'IP detection in progress...', 
          location: basicLocation
        };
      }
    } catch (error) {
      console.error('🌐 ClientSessionService: Error getting IP and location:', error);
      
      // Ultimate fallback - use timezone and language
      const basicLocation = this.getBasicLocationFromTimezone();
      return { 
        ipAddress: 'IP detection failed', 
        location: basicLocation
      };
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

  // Update IP and location for existing sessions in the background
  async updateSessionsIPAndLocation(): Promise<void> {
    try {
      console.log('🌐 ClientSessionService: Updating IP and location for all sessions...');
      
      // Get fresh IP and location
      const { ipAddress, location } = await this.getIPAndLocation();
      
      // Update all sessions with the new IP and location
      let updatedCount = 0;
      this.sessions.forEach(session => {
        if (session.ipAddress === 'Client-side' || 
            session.ipAddress === 'IP unavailable' || 
            session.ipAddress === 'IP detection failed' ||
            session.ipAddress === 'IP detection in progress...') {
          session.ipAddress = ipAddress;
          session.location = location;
          updatedCount++;
        }
      });
      
      if (updatedCount > 0) {
        this.saveSessions();
        console.log(`🌐 ClientSessionService: Updated ${updatedCount} sessions with new IP and location`);
      }
    } catch (error) {
      console.error('🌐 ClientSessionService: Error updating sessions IP and location:', error);
    }
  }

  // Get all sessions for a user
  async getUserSessions(userId: string): Promise<DeviceSession[]> {
    console.log('📱 ClientSessionService: Getting sessions for user:', userId);
    
    // Update IP and location for existing sessions in the background
    this.updateSessionsIPAndLocation();
    
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
      // Update existing session with fresh IP and location
      existingSession.isCurrentSession = true;
      existingSession.lastActive = new Date().toISOString();
      existingSession.deviceName = deviceInfo.deviceName;
      existingSession.deviceType = deviceInfo.deviceType;
      existingSession.browser = deviceInfo.browser;
      existingSession.os = deviceInfo.os;
      
      // Get fresh IP and location for existing session
      const { ipAddress, location } = await this.getIPAndLocation();
      existingSession.ipAddress = ipAddress;
      existingSession.location = location;
      
      this.saveSessions();
      console.log('📱 ClientSessionService: Updated existing session:', existingSession);
      return existingSession;
    }
    
    // Get IP and location with retry logic
    let ipAddress = 'IP detection in progress...';
    let location = 'Location detection in progress...';
    
    try {
      const ipResult = await this.getIPAndLocation();
      ipAddress = ipResult.ipAddress;
      location = ipResult.location;
    } catch (error) {
      console.error('📱 ClientSessionService: Error getting IP and location:', error);
      // Try one more time after a short delay
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retryResult = await this.getIPAndLocation();
        ipAddress = retryResult.ipAddress;
        location = retryResult.location;
      } catch (retryError) {
        console.error('📱 ClientSessionService: Retry also failed:', retryError);
        ipAddress = 'IP detection failed';
        location = 'Location detection failed';
      }
    }
    
    // Create new session
    const newSession: DeviceSession = {
      id: `client_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceName: deviceInfo.deviceName,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress,
      location,
      lastActive: new Date().toISOString(),
      isCurrentSession: true,
      userAgent,
      loginTime: new Date().toISOString()
    };
    
    this.sessions.push(newSession);
    this.saveSessions();
    
    console.log('📱 ClientSessionService: Session created:', newSession);
    
    // If we got placeholder values, try to update them in the background
    if (ipAddress === 'IP detection in progress...' || location === 'Location detection in progress...') {
      setTimeout(async () => {
        try {
          const { ipAddress: realIP, location: realLocation } = await this.getIPAndLocation();
          if (realIP !== 'IP detection failed' && realLocation !== 'Location detection failed') {
            newSession.ipAddress = realIP;
            newSession.location = realLocation;
            this.saveSessions();
            console.log('📱 ClientSessionService: Updated session with real IP and location:', newSession);
          }
        } catch (error) {
          console.error('📱 ClientSessionService: Background IP update failed:', error);
        }
      }, 2000);
    }
    
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