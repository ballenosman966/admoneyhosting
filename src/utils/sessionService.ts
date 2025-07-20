import { DeviceSession } from './userStorage';
import { serverSessionService } from './serverSessionService';
import { clientSessionService } from './clientSessionService';

// Unified session service that automatically chooses between client and server
class UnifiedSessionService {
  private isNetlifyEnvironment: boolean;

  constructor() {
    // Detect if we're in a Netlify environment
    this.isNetlifyEnvironment = this.detectNetlifyEnvironment();
    console.log('🌐 SessionService: Environment detected as', this.isNetlifyEnvironment ? 'Netlify' : 'Local Development');
  }

  private detectNetlifyEnvironment(): boolean {
    // Check for Netlify environment variables
    if (typeof window !== 'undefined') {
      // Check if we're on a Netlify domain
      const hostname = window.location.hostname;
      if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
        return true;
      }
      
      // Check if we're not on localhost (likely production)
      if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
        return true;
      }
    }
    
    return false;
  }

  private getService() {
    return this.isNetlifyEnvironment ? clientSessionService : serverSessionService;
  }

  // Get all sessions for a user
  async getUserSessions(userId: string): Promise<DeviceSession[]> {
    try {
      return await this.getService().getUserSessions(userId);
    } catch (error) {
      console.error('❌ SessionService: Error getting sessions, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.getUserSessions(userId);
    }
  }

  // Create a new session
  async createSession(userId: string, deviceInfo: any, userAgent: string): Promise<DeviceSession> {
    try {
      return await this.getService().createSession(userId, deviceInfo, userAgent);
    } catch (error) {
      console.error('❌ SessionService: Error creating session, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.createSession(userId, deviceInfo, userAgent);
    }
  }

  // Create session with device detection
  async createSessionWithDeviceDetection(userId: string): Promise<DeviceSession> {
    try {
      return await this.getService().createSessionWithDeviceDetection(userId);
    } catch (error) {
      console.error('❌ SessionService: Error creating session with device detection, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.createSessionWithDeviceDetection(userId);
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<DeviceSession> {
    try {
      return await this.getService().updateSessionActivity(sessionId);
    } catch (error) {
      console.error('❌ SessionService: Error updating session activity, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.updateSessionActivity(sessionId);
    }
  }

  // Terminate a specific session
  async terminateSession(sessionId: string): Promise<{ message: string; session: DeviceSession }> {
    try {
      return await this.getService().terminateSession(sessionId);
    } catch (error) {
      console.error('❌ SessionService: Error terminating session, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.terminateSession(sessionId);
    }
  }

  // Terminate all sessions for a user except current
  async terminateAllOtherSessions(userId: string): Promise<{ message: string; remainingSessions: DeviceSession[] }> {
    try {
      return await this.getService().terminateAllOtherSessions(userId);
    } catch (error) {
      console.error('❌ SessionService: Error terminating other sessions, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.terminateAllOtherSessions(userId);
    }
  }

  // Terminate all sessions for a user
  async terminateAllSessions(userId: string): Promise<{ message: string; deletedSessions: DeviceSession[] }> {
    try {
      return await this.getService().terminateAllSessions(userId);
    } catch (error) {
      console.error('❌ SessionService: Error terminating all sessions, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.terminateAllSessions(userId);
    }
  }

  // Get session statistics
  async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    activeSessions: number;
    sessionsByDeviceType: { [key: string]: number };
    sessionsByBrowser: { [key: string]: number };
    sessionsByOS: { [key: string]: number };
  }> {
    try {
      return await this.getService().getSessionStats(userId);
    } catch (error) {
      console.error('❌ SessionService: Error getting session stats, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.getSessionStats(userId);
    }
  }

  // Test session functionality
  async testSessionFunctionality(): Promise<{ message: string; sessions: DeviceSession[]; totalSessions: number }> {
    try {
      return await this.getService().testSessionFunctionality();
    } catch (error) {
      console.error('❌ SessionService: Error testing session functionality, falling back to client service:', error);
      // Fallback to client service if server fails
      return await clientSessionService.testSessionFunctionality();
    }
  }

  // Get environment info
  getEnvironmentInfo() {
    return {
      isNetlify: this.isNetlifyEnvironment,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      service: this.isNetlifyEnvironment ? 'client' : 'server'
    };
  }
}

export const sessionService = new UnifiedSessionService(); 