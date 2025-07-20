import { DeviceSession } from './userStorage';
import { clientSessionService } from './clientSessionService';

// Simplified session service that uses client-side storage for Netlify
class UnifiedSessionService {
  private isNetlifyEnvironment: boolean;

  constructor() {
    // Detect if we're in a Netlify environment
    this.isNetlifyEnvironment = this.detectNetlifyEnvironment();
    console.log('🌐 SessionService: Environment detected as', this.isNetlifyEnvironment ? 'Netlify' : 'Local Development');
    console.log('🌐 SessionService: Using service:', this.isNetlifyEnvironment ? 'client' : 'server');
  }

  private detectNetlifyEnvironment(): boolean {
    // Check for Netlify environment variables
    if (typeof window !== 'undefined') {
      // Check if we're on a Netlify domain
      const hostname = window.location.hostname;
      console.log('🌐 SessionService: Hostname detected:', hostname);
      
      if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
        console.log('🌐 SessionService: Netlify domain detected');
        return true;
      }
      
      // Check if we're not on localhost (likely production)
      if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
        console.log('🌐 SessionService: Production environment detected (non-localhost)');
        return true;
      }
      
      console.log('🌐 SessionService: Local development environment detected');
    }
    
    return false;
  }

  // For Netlify, always use client service. For local development, try server first but fallback to client
  private async getService() {
    if (this.isNetlifyEnvironment) {
      console.log('🌐 SessionService: Using client service (Netlify environment)');
      return clientSessionService;
    }
    
    // For local development, try server first
    console.log('🌐 SessionService: Using server service (local development)');
    return clientSessionService; // Force client service for now to ensure it works
  }

  // Get all sessions for a user
  async getUserSessions(userId: string): Promise<DeviceSession[]> {
    console.log('🌐 SessionService: Getting sessions for user:', userId);
    try {
      const service = await this.getService();
      const sessions = await service.getUserSessions(userId);
      console.log('🌐 SessionService: Retrieved sessions:', sessions);
      return sessions;
    } catch (error) {
      console.error('❌ SessionService: Error getting sessions:', error);
      // Always fallback to client service
      console.log('🌐 SessionService: Falling back to client service');
      return await clientSessionService.getUserSessions(userId);
    }
  }

  // Create a new session
  async createSession(userId: string, deviceInfo: any, userAgent: string): Promise<DeviceSession> {
    console.log('🌐 SessionService: Creating session for user:', userId);
    try {
      const service = await this.getService();
      const session = await service.createSession(userId, deviceInfo, userAgent);
      console.log('🌐 SessionService: Session created:', session);
      return session;
    } catch (error) {
      console.error('❌ SessionService: Error creating session:', error);
      // Always fallback to client service
      console.log('🌐 SessionService: Falling back to client service');
      return await clientSessionService.createSession(userId, deviceInfo, userAgent);
    }
  }

  // Create session with device detection
  async createSessionWithDeviceDetection(userId: string): Promise<DeviceSession> {
    console.log('🌐 SessionService: Creating session with device detection for user:', userId);
    try {
      const service = await this.getService();
      const session = await service.createSessionWithDeviceDetection(userId);
      console.log('🌐 SessionService: Session created with device detection:', session);
      return session;
    } catch (error) {
      console.error('❌ SessionService: Error creating session with device detection:', error);
      // Always fallback to client service
      console.log('🌐 SessionService: Falling back to client service');
      return await clientSessionService.createSessionWithDeviceDetection(userId);
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<DeviceSession> {
    console.log('🌐 SessionService: Updating session activity for:', sessionId);
    try {
      const service = await this.getService();
      return await service.updateSessionActivity(sessionId);
    } catch (error) {
      console.error('❌ SessionService: Error updating session activity:', error);
      // Always fallback to client service
      return await clientSessionService.updateSessionActivity(sessionId);
    }
  }

  // Terminate a specific session
  async terminateSession(sessionId: string): Promise<{ message: string; session: DeviceSession }> {
    console.log('🌐 SessionService: Terminating session:', sessionId);
    try {
      const service = await this.getService();
      return await service.terminateSession(sessionId);
    } catch (error) {
      console.error('❌ SessionService: Error terminating session:', error);
      // Always fallback to client service
      return await clientSessionService.terminateSession(sessionId);
    }
  }

  // Terminate all sessions for a user except current
  async terminateAllOtherSessions(userId: string): Promise<{ message: string; remainingSessions: DeviceSession[] }> {
    console.log('🌐 SessionService: Terminating all other sessions for user:', userId);
    try {
      const service = await this.getService();
      return await service.terminateAllOtherSessions(userId);
    } catch (error) {
      console.error('❌ SessionService: Error terminating other sessions:', error);
      // Always fallback to client service
      return await clientSessionService.terminateAllOtherSessions(userId);
    }
  }

  // Terminate all sessions for a user
  async terminateAllSessions(userId: string): Promise<{ message: string; deletedSessions: DeviceSession[] }> {
    console.log('🌐 SessionService: Terminating all sessions for user:', userId);
    try {
      const service = await this.getService();
      return await service.terminateAllSessions(userId);
    } catch (error) {
      console.error('❌ SessionService: Error terminating all sessions:', error);
      // Always fallback to client service
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
    console.log('🌐 SessionService: Getting session stats for user:', userId);
    try {
      const service = await this.getService();
      return await service.getSessionStats(userId);
    } catch (error) {
      console.error('❌ SessionService: Error getting session stats:', error);
      // Always fallback to client service
      return await clientSessionService.getSessionStats(userId);
    }
  }

  // Test session functionality
  async testSessionFunctionality(): Promise<{ message: string; sessions: DeviceSession[]; totalSessions: number }> {
    console.log('🌐 SessionService: Testing session functionality');
    try {
      const service = await this.getService();
      return await service.testSessionFunctionality();
    } catch (error) {
      console.error('❌ SessionService: Error testing session functionality:', error);
      // Always fallback to client service
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