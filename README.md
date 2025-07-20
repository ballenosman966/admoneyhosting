# Crypto Rewards Website - Server-Side Session Management

This project now includes a complete server-side session management system that allows true cross-device session tracking.

## 🚀 Features

### Session Management
- **Cross-Device Tracking**: Sessions are stored server-side and visible across all devices
- **Real-Time Location Detection**: Automatic IP and location detection for each session
- **Device Recognition**: Automatic detection of device type, browser, and OS
- **Activity Tracking**: Real-time session activity monitoring
- **Security Controls**: Ability to terminate individual or all sessions
- **Session Statistics**: Detailed analytics and statistics

### Security Features
- **Session Isolation**: Each device gets its own session
- **Activity Monitoring**: Tracks user activity across all devices
- **Automatic Cleanup**: Removes sessions older than 30 days
- **Duplicate Prevention**: Prevents multiple sessions from the same device

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Server Dependencies**
   ```bash
   npm install express cors body-parser
   ```

## 🚀 Running the Application

### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```
This will start both the frontend (Vite dev server) and backend (Express server) concurrently.

### Production Mode
```bash
npm run start
```
This will build the frontend and start the production server.

### Individual Services

**Frontend Only:**
```bash
npm run dev
```

**Backend Only:**
```bash
npm run server
```

## 🌐 API Endpoints

The server provides the following REST API endpoints:

### Session Management
- `GET /api/sessions/:userId` - Get all sessions for a user
- `POST /api/sessions` - Create a new session
- `PUT /api/sessions/:sessionId/activity` - Update session activity
- `DELETE /api/sessions/:sessionId` - Terminate a specific session
- `DELETE /api/sessions/user/:userId/others` - Terminate all other sessions
- `DELETE /api/sessions/user/:userId` - Terminate all sessions for a user

### Statistics & Testing
- `GET /api/sessions/stats/:userId` - Get session statistics
- `POST /api/sessions/test` - Test session functionality

## 📱 Cross-Device Testing

To test the cross-device functionality:

1. **Start the server:**
   ```bash
   npm run dev:full
   ```

2. **Open the website on different devices/browsers:**
   - Desktop Chrome
   - Mobile Safari
   - Tablet Firefox
   - Any other device/browser combination

3. **Log in with the same account** on each device

4. **Check the Sessions page** on any device - you should see sessions from all devices

## 🔧 Debug Tools (Admin Only)

Admin users (username: `mhamad`) have access to debug tools:

- **Create Test Session**: Manually create a new session
- **Clear All Sessions**: Remove all sessions for the current user
- **Show Debug Info**: Display current user agent and location
- **Test Sessions**: Run comprehensive session functionality tests

## 📊 Session Data Structure

Each session contains:
```typescript
{
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
```

## 🗄️ Data Storage

### Development
- Sessions are stored in `data/sessions.json`
- Users are stored in `data/users.json`
- Data persists between server restarts

### Production
- Replace the file-based storage with a real database (MongoDB, PostgreSQL, etc.)
- Update the storage functions in `server.js`

## 🔒 Security Considerations

1. **CORS**: Configured for development. Update for production
2. **Rate Limiting**: Add rate limiting for production use
3. **Authentication**: Add proper authentication middleware
4. **HTTPS**: Use HTTPS in production
5. **Database**: Use a proper database instead of file storage

## 🐛 Troubleshooting

### Common Issues

1. **Server not starting:**
   - Check if port 3001 is available
   - Ensure all dependencies are installed

2. **Sessions not showing:**
   - Check browser console for API errors
   - Verify server is running on port 3001
   - Check network connectivity

3. **Location not detected:**
   - The location API may be rate-limited
   - Check server logs for API errors

### Debug Mode

Enable debug logging by checking the browser console and server logs for detailed information.

## 📈 Performance

- **Session Updates**: Every 5 minutes automatically
- **Activity Tracking**: On user interactions (mouse, keyboard, scroll, touch)
- **Cleanup**: Automatic removal of sessions older than 30 days
- **Caching**: Sessions are cached in memory for fast access

## 🔄 Migration from Local Storage

The system automatically migrates from the old localStorage-based sessions to the new server-side system. No manual migration is required.

## 📝 Environment Variables

Create a `.env` file for production configuration:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=your_database_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 