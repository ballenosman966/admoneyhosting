import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (development)
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

// In-memory storage (in production, use a real database like MongoDB or PostgreSQL)
let sessions = [];
let users = [];

// Load existing data from files if they exist
const loadData = () => {
  try {
    if (fs.existsSync('data/sessions.json')) {
      sessions = JSON.parse(fs.readFileSync('data/sessions.json', 'utf8'));
    }
    if (fs.existsSync('data/users.json')) {
      users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Save data to files
const saveData = () => {
  try {
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data');
    }
    fs.writeFileSync('data/sessions.json', JSON.stringify(sessions, null, 2));
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Initialize data
loadData();

// Session Management API Endpoints

// Get all sessions for a user
app.get('/api/sessions/:userId', (req, res) => {
  try {
    console.log(`📱 GET /api/sessions/${req.params.userId} - Request received`);
    const { userId } = req.params;
    const userSessions = sessions.filter(session => session.userId === userId);
    
    console.log(`📱 Found ${userSessions.length} sessions for user ${userId}`);
    
    // Clean up old sessions (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const validSessions = userSessions.filter(session => 
      new Date(session.lastActive) > thirtyDaysAgo
    );
    
    // Remove expired sessions from storage
    if (validSessions.length !== userSessions.length) {
      sessions = sessions.filter(session => 
        session.userId !== userId || new Date(session.lastActive) > thirtyDaysAgo
      );
      saveData();
    }
    
    console.log(`📱 Returning ${validSessions.length} valid sessions`);
    res.json(validSessions);
  } catch (error) {
    console.error('❌ Error getting sessions:', error);
    res.status(500).json({ error: 'Failed to get sessions', details: error.message });
  }
});

// Create a new session
app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, deviceInfo, userAgent } = req.body;
    
    if (!userId || !deviceInfo || !userAgent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Mark all existing sessions for this user as not current
    sessions.forEach(session => {
      if (session.userId === userId) {
        session.isCurrentSession = false;
      }
    });
    
    // Check if there's already a session for this user and user agent
    const existingSession = sessions.find(session => 
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
      
      saveData();
      return res.json(existingSession);
    }
    
    // Get IP address with better detection
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     req.ip ||
                     '127.0.0.1';
    
    // Create new session
    const newSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceName: deviceInfo.deviceName,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress: ipAddress,
      location: 'Detecting...',
      lastActive: new Date().toISOString(),
      isCurrentSession: true,
      userAgent,
      loginTime: new Date().toISOString()
    };
    
    sessions.push(newSession);
    saveData();
    
    // Try to get location information
    try {
      // Skip location detection for localhost/private IPs
      if (newSession.ipAddress === '127.0.0.1' || 
          newSession.ipAddress === '::1' || 
          newSession.ipAddress.startsWith('192.168.') ||
          newSession.ipAddress.startsWith('10.') ||
          newSession.ipAddress.startsWith('172.')) {
        newSession.location = 'Local Development';
        console.log('📍 Skipping location detection for local IP:', newSession.ipAddress);
      } else {
        const locationData = await new Promise((resolve, reject) => {
          https.get(`https://ipapi.co/${newSession.ipAddress}/json/`, (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', () => {
              try {
                resolve(JSON.parse(data));
              } catch (error) {
                reject(error);
              }
            });
          }).on('error', (error) => {
            reject(error);
          });
        });
        
        if (locationData.city || locationData.region || locationData.country_name) {
          const locationParts = [];
          if (locationData.city) locationParts.push(locationData.city);
          if (locationData.region) locationParts.push(locationData.region);
          if (locationData.country_name) locationParts.push(locationData.country_name);
          
          newSession.location = locationParts.join(', ');
          newSession.ipAddress = locationData.ip || newSession.ipAddress;
          console.log('📍 Location detected:', newSession.location);
        } else {
          newSession.location = 'Location unavailable';
        }
      }
      
      // Update the session in storage
      const sessionIndex = sessions.findIndex(s => s.id === newSession.id);
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = newSession;
        saveData();
      }
    } catch (error) {
      console.error('Error getting location:', error);
      newSession.location = 'Location unavailable';
    }
    
    res.json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session activity
app.put('/api/sessions/:sessionId/activity', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    sessions[sessionIndex].lastActive = new Date().toISOString();
    saveData();
    
    res.json(sessions[sessionIndex]);
  } catch (error) {
    console.error('Error updating session activity:', error);
    res.status(500).json({ error: 'Failed to update session activity' });
  }
});

// Terminate a specific session
app.delete('/api/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const deletedSession = sessions[sessionIndex];
    sessions.splice(sessionIndex, 1);
    saveData();
    
    res.json({ message: 'Session terminated', session: deletedSession });
  } catch (error) {
    console.error('Error terminating session:', error);
    res.status(500).json({ error: 'Failed to terminate session' });
  }
});

// Terminate all sessions for a user except current
app.delete('/api/sessions/user/:userId/others', (req, res) => {
  try {
    const { userId } = req.params;
    const currentSession = sessions.find(s => s.userId === userId && s.isCurrentSession);
    
    if (currentSession) {
      sessions = sessions.filter(s => s.id === currentSession.id);
    } else {
      sessions = sessions.filter(s => s.userId !== userId);
    }
    
    saveData();
    
    res.json({ 
      message: 'Other sessions terminated', 
      remainingSessions: sessions.filter(s => s.userId === userId)
    });
  } catch (error) {
    console.error('Error terminating other sessions:', error);
    res.status(500).json({ error: 'Failed to terminate other sessions' });
  }
});

// Terminate all sessions for a user
app.delete('/api/sessions/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const deletedSessions = sessions.filter(s => s.userId === userId);
    
    sessions = sessions.filter(s => s.userId !== userId);
    saveData();
    
    res.json({ 
      message: 'All sessions terminated', 
      deletedSessions 
    });
  } catch (error) {
    console.error('Error terminating all sessions:', error);
    res.status(500).json({ error: 'Failed to terminate all sessions' });
  }
});

// Get session statistics
app.get('/api/sessions/stats/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userSessions = sessions.filter(session => session.userId === userId);
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const activeSessions = userSessions.filter(s => 
      new Date(s.lastActive) > fiveMinutesAgo
    );
    
    const deviceTypeCount = {};
    const browserCount = {};
    const osCount = {};
    
    userSessions.forEach(session => {
      deviceTypeCount[session.deviceType] = (deviceTypeCount[session.deviceType] || 0) + 1;
      browserCount[session.browser] = (browserCount[session.browser] || 0) + 1;
      osCount[session.os] = (osCount[session.os] || 0) + 1;
    });
    
    res.json({
      totalSessions: userSessions.length,
      activeSessions: activeSessions.length,
      sessionsByDeviceType: deviceTypeCount,
      sessionsByBrowser: browserCount,
      sessionsByOS: osCount
    });
  } catch (error) {
    console.error('Error getting session stats:', error);
    res.status(500).json({ error: 'Failed to get session statistics' });
  }
});

// Test session functionality
app.post('/api/sessions/test', (req, res) => {
  try {
    const testUserId = 'test-user-123';
    
    // Clear existing test sessions
    sessions = sessions.filter(s => s.userId !== testUserId);
    
    // Create test sessions with different user agents
    const testUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
    ];
    
    const testSessions = [];
    testUserAgents.forEach((userAgent, index) => {
      const deviceInfo = detectDeviceInfo(userAgent);
      const session = {
        id: `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: testUserId,
        deviceName: `Test Device ${index + 1}`,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress: 'Test IP',
        location: 'Test Location',
        lastActive: new Date().toISOString(),
        isCurrentSession: index === 0, // Only first session is current
        userAgent,
        loginTime: new Date().toISOString()
      };
      
      testSessions.push(session);
      sessions.push(session);
    });
    
    saveData();
    
    res.json({
      message: 'Test sessions created',
      sessions: testSessions,
      totalSessions: sessions.length
    });
  } catch (error) {
    console.error('Error creating test sessions:', error);
    res.status(500).json({ error: 'Failed to create test sessions' });
  }
});

// Helper function to detect device info
function detectDeviceInfo(userAgent) {
  const ua = userAgent.toLowerCase();
  
  let deviceType = 'desktop';
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

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Session API available at http://localhost:${PORT}/api/sessions`);
}); 