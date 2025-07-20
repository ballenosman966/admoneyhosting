export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string; // In a real app, this would be hashed
  balance: number;
  totalEarned: number;
  joinDate: string;
  // Referral fields
  referralCode: string;
  referredBy?: string; // Username of the person who referred this user
  referralEarnings: number;
  referralCount: number;
  referralHistory: ReferralRecord[];
  // Profile fields
  displayName?: string;
  bio?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  language?: string;
  birthday?: string; // Date of birth
  profileImage?: string; // Base64 encoded image data
  // Settings fields
  theme?: 'dark' | 'light' | 'auto';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  soundEnabled?: boolean;
  autoPlayAds?: boolean;
  showEarnings?: boolean;
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  showProfilePublicly?: boolean;
  pendingDeletion?: boolean;
  // Additional fields for notifications
  newAds?: boolean;
  earnings?: boolean;
  streak?: boolean;
  withdrawals?: boolean;
  referrals?: boolean;
  promotions?: boolean;
  // Stats fields
  currentStreak?: number;
  totalAdsWatched?: number;
  // VIP fields
  vipTier?: number;
  vipStartDate?: string;
  lastVipReward?: string;
  vipAdProgress?: {
    adsWatched: number;
    totalAdsRequired: number;
    dailyReward: number;
    lastResetDate: string;
  };
  // Subscription fields
  isSubscribed?: boolean;
  subscriptionType?: 'basic' | 'premium' | 'vip';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  subscriptionHistory?: SubscriptionRecord[];
  // Email verification
  isEmailVerified?: boolean;
  withdrawPasscode?: string; // 4-digit code for withdrawals
  // Phone verification
  isPhoneVerified?: boolean;
  // Privacy settings
  profileVisibility?: 'public' | 'private' | 'friends';
  showEmail?: boolean;
  showPhone?: boolean;
  showReferralStats?: boolean;
  // Social media links
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  // Referral statistics
  referralStats?: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarnings: number;
    pendingEarnings: number;
  };
  // Activity log
  activityLog?: ActivityRecord[];
  // KYC verification
  kycData?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    documentType: 'passport' | 'national_id' | 'drivers_license';
    documentNumber: string;
    documentFront: string;
    documentBack: string;
    selfie: string;
    status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
    submittedAt?: string;
    reviewedAt?: string;
    rejectionReason?: string;
  };
}

export interface ReferralRecord {
  id: string;
  referredUsername: string;
  referredEmail: string;
  joinDate: string;
  earnings: number;
  status: 'active' | 'inactive';
}

export interface SubscriptionRecord {
  id: string;
  type: 'basic' | 'premium' | 'vip';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'warning' | 'info' | 'reward' | 'withdrawal';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityRecord {
  type: 'ad' | 'referral' | 'withdrawal' | 'deposit' | 'vip' | 'other';
  message: string;
  amount?: number;
  date: string;
  extra?: any;
}

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

// Simulate a simple database with localStorage
class UserStorage {
  private readonly USERS_KEY = 'cryptoRewardsUsers';
  private readonly CURRENT_USER_KEY = 'cryptoRewardsCurrentUser';
  private readonly NOTIFICATIONS_KEY = 'cryptoRewardsNotifications';
  private readonly BACKUP_KEY = 'cryptoRewardsBackup';
  private readonly SESSIONS_KEY = 'cryptoRewardsSessions';
  private usersCache: User[] | null = null;
  private currentUserCache: User | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 10000; // 10 seconds cache (increased from 5)

  constructor() {
    try {
      // Migrate data from old port-specific storage to new persistent storage
      this.migrateDataFromOldStorage();
    } catch (error) {
      console.error('UserStorage constructor error:', error);
    }
  }

  // Migrate data from old port-specific storage to persistent storage
  private migrateDataFromOldStorage(): void {
    try {
      // Check if we have data in the current storage
      const currentUsers = localStorage.getItem(this.USERS_KEY);
      const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
      
      // If we have data, backup it to persistent storage
      if (currentUsers || currentUser) {
        const backupData = {
          users: currentUsers ? JSON.parse(currentUsers) : [],
          currentUser: currentUser ? JSON.parse(currentUser) : null,
          timestamp: Date.now(),
          port: window.location.port || '3000'
        };
        
        // Store backup in sessionStorage (persists across port changes)
        sessionStorage.setItem(this.BACKUP_KEY, JSON.stringify(backupData));
        console.log('Data backed up to sessionStorage for port persistence');
      }
      
      // Try to restore data from sessionStorage if current storage is empty
      const backupData = sessionStorage.getItem(this.BACKUP_KEY);
      if (backupData && (!currentUsers || !currentUser)) {
        const backup = JSON.parse(backupData);
        
        if (backup.users && backup.users.length > 0) {
          localStorage.setItem(this.USERS_KEY, JSON.stringify(backup.users));
          console.log('Users data restored from backup');
          
          // Show notification to user about data restoration
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              const event = new CustomEvent('dataRestored', {
                detail: { 
                  message: `Your data has been restored from port ${backup.port || '3000'}`,
                  userCount: backup.users.length
                }
              });
              window.dispatchEvent(event);
            }, 1000);
          }
        }
        
        if (backup.currentUser) {
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(backup.currentUser));
          console.log('Current user data restored from backup');
        }
      }
    } catch (error) {
      console.error('Error during data migration:', error);
    }
  }

  // Get all users with improved caching
  private getUsers(): User[] {
    const now = Date.now();
    if (this.usersCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.usersCache;
    }
    
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage not available');
        return [];
      }
      const users = localStorage.getItem(this.USERS_KEY);
      const parsedUsers = users ? JSON.parse(users) : [];
      
      this.usersCache = parsedUsers;
      this.cacheTimestamp = now;
      
      return parsedUsers;
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return [];
    }
  }

  // Save all users with error handling
  private saveUsers(users: User[]): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage not available');
        return;
      }
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      // Update cache
      this.usersCache = users;
      this.cacheTimestamp = Date.now();
      
      // Backup to sessionStorage for port persistence
      this.backupData();
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }

  // Clear cache (for when user data changes)
  private clearCache(): void {
    this.usersCache = null;
    this.currentUserCache = null;
    this.cacheTimestamp = 0;
  }

  // Backup data to sessionStorage for port persistence
  private backupData(): void {
    try {
      const currentUsers = localStorage.getItem(this.USERS_KEY);
      const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
      
      const backupData = {
        users: currentUsers ? JSON.parse(currentUsers) : [],
        currentUser: currentUser ? JSON.parse(currentUser) : null,
        timestamp: Date.now(),
        port: window.location.port || '3000'
      };
      
      sessionStorage.setItem(this.BACKUP_KEY, JSON.stringify(backupData));
      console.log(`Data backed up for port ${window.location.port || '3000'}`);
    } catch (error) {
      console.error('Error backing up data:', error);
    }
  }

  // Manually restore data from backup (for debugging)
  restoreFromPortBackup(): boolean {
    try {
      const backupData = sessionStorage.getItem(this.BACKUP_KEY);
      if (!backupData) {
        console.log('No port backup found in sessionStorage');
        return false;
      }

      const backup = JSON.parse(backupData);
      console.log('Restoring from backup:', backup);

      if (backup.users && backup.users.length > 0) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(backup.users));
        console.log(`Restored ${backup.users.length} users from backup`);
      }
      
      if (backup.currentUser) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(backup.currentUser));
        console.log(`Restored current user: ${backup.currentUser.username} from backup`);
      }
      
      this.clearCache();
      return true;
    } catch (error) {
      console.error('Error restoring from port backup:', error);
      return false;
    }
  }

  // Check if port backup exists
  hasPortBackup(): boolean {
    return sessionStorage.getItem(this.BACKUP_KEY) !== null;
  }

  // Get backup info for debugging
  getBackupInfo(): { hasBackup: boolean; backupData?: any } {
    try {
      const backupData = sessionStorage.getItem(this.BACKUP_KEY);
      if (!backupData) {
        return { hasBackup: false };
      }
      
      const backup = JSON.parse(backupData);
      return { hasBackup: true, backupData: backup };
    } catch (error) {
      console.error('Error getting backup info:', error);
      return { hasBackup: false };
    }
  }

  // Check if email exists with caching
  checkEmailExists(email: string): boolean {
    const users = this.getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Check if username exists with caching
  checkUsernameExists(username: string): boolean {
    const users = this.getUsers();
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
  }

  // Check if referral code exists with caching
  checkReferralCodeExists(referralCode: string): boolean {
    if (!referralCode || referralCode.trim() === '') {
      return false;
    }
    const users = this.getUsers();
    return users.some(user => user.referralCode && user.referralCode.toLowerCase() === referralCode.toLowerCase());
  }

  // Get user by referral code with caching
  getUserByReferralCode(referralCode: string): User | null {
    if (!referralCode || referralCode.trim() === '') {
      return null;
    }
    const users = this.getUsers();
    return users.find(user => user.referralCode && user.referralCode.toLowerCase() === referralCode.toLowerCase()) || null;
  }

  // Check if user ID exists with caching
  checkUserIdExists(userId: string): boolean {
    const users = this.getUsers();
    return users.some(user => user.id === userId);
  }

  // Get user by ID with caching
  getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === userId) || null;
  }

  // Get user by email with caching
  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Update user password by email
  updateUserPasswordByEmail(email: string, newPassword: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword; // In real app, hash this password
      this.saveUsers(users);
      
      // Update current user cache if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
        this.currentUserCache = users[userIndex];
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
      }
    } else {
      throw new Error('User not found');
    }
  }

  // Create a new user
  createUser(userData: { username: string; email: string; firstName: string; lastName: string; password: string; birthday?: string; country?: string; referralCode?: string; referrerId?: string }): User {
    const users = this.getUsers();
    
    // Check if email already exists
    if (this.checkEmailExists(userData.email)) {
      throw new Error('An account with this email already exists');
    }

    // Check if username already exists
    if (this.checkUsernameExists(userData.username)) {
      throw new Error('Username already taken');
    }

    // Handle referral - check both referral code and referrer ID
    let referredBy: string | undefined;
    let validReferral = false;
    
    if (userData.referrerId) {
      // Priority to referrer ID
      const referrer = this.getUserById(userData.referrerId);
      if (referrer) {
        referredBy = referrer.username;
        validReferral = true;
      }
    } else if (userData.referralCode) {
      // Fallback to referral code
      const referrer = users.find(user => user.referralCode === userData.referralCode);
      if (referrer) {
        referredBy = referrer.username;
        validReferral = true;
      }
    }

    // Allow all users to register without invite code (invite codes are optional)
    // The first user (after admin) can register without any invite code
    const nonAdminUsers = users.filter(user => user.username !== 'mhamad');
    const isFirstUser = nonAdminUsers.length === 0;

    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password, // In a real app, hash this password
      balance: 0, // Start with zero balance - no demo money
      totalEarned: 0,
      joinDate: new Date().toISOString(),
      // Referral fields
      referralCode: this.generateReferralCode(),
      referredBy,
      referralEarnings: 0,
      referralCount: 0,
      referralHistory: [],
      // Initialize profile fields
      displayName: userData.username,
      bio: '',
      phone: '',
      country: userData.country || '',
      timezone: 'UTC',
      language: 'en',
      birthday: userData.birthday || '',
      // Initialize settings fields
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      autoPlayAds: true,
      showEarnings: true,
      twoFactorAuth: false,
      sessionTimeout: 30,
      // Initialize notification settings
      newAds: true,
      earnings: true,
      streak: true,
      withdrawals: true,
      referrals: true,
      promotions: true,
      // Initialize stats - start with zero
      currentStreak: 0,
      totalAdsWatched: 0,
      // Initialize VIP fields - start with no VIP
      vipTier: 0,
      vipStartDate: undefined,
      lastVipReward: undefined,
      // Initialize subscription fields - no subscriptions
      isSubscribed: false,
      subscriptionType: undefined,
      subscriptionStartDate: undefined,
      subscriptionEndDate: undefined,
      subscriptionStatus: undefined,
      subscriptionHistory: [],
      // Email verification - start as verified for simplicity
      isEmailVerified: true,
      // Activity log - start empty
      activityLog: []
    };

    // Add to users array
    users.push(newUser);
    this.saveUsers(users);

    // Handle referral payment if valid
    if (validReferral && referredBy) {
      this.addReferral(referredBy, newUser);
    }

    // Create a session for the new user
    this.createSession(newUser.id);

    return newUser;
  }

  // Authenticate user with improved performance
  authenticateUser(identifier: string, password: string): User {
    const users = this.getUsers();
    const user = users.find(u => 
      u.username.toLowerCase() === identifier.toLowerCase() || 
      u.email.toLowerCase() === identifier.toLowerCase()
    );

    if (!user || user.password !== password) {
      throw new Error('Invalid username/email or password');
    }

    // Ensure we return the most up-to-date user data
    // This prevents issues where user data might be stale
    const updatedUser = { ...user };
    
    // Create a new session for the authenticated user
    this.createSession(updatedUser.id);
    
    // Update current user cache and localStorage immediately
    this.setCurrentUser(updatedUser);
    
    return updatedUser;
  }

  // Get current user with improved caching and validation
  getCurrentUser(): User | null {
    // First check cache
    if (this.currentUserCache) {
      console.log('getCurrentUser: Returning from cache:', this.currentUserCache.username);
      return this.currentUserCache;
    }

    try {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      console.log('getCurrentUser: Raw localStorage data:', userData ? 'exists' : 'null');
      
      if (!userData) {
        console.log('getCurrentUser: No user data in localStorage');
        return null;
      }

      const user = JSON.parse(userData);
      console.log('getCurrentUser: Parsed user data:', user.username, 'balance:', user.balance);
      
      // Validate that the user exists in the users array
      const users = this.getUsers();
      const userExists = users.find(u => u.id === user.id);
      
      if (!userExists) {
        console.log('getCurrentUser: User not found in users array, clearing current user');
        this.setCurrentUser(null);
        return null;
      }
      
      // Use the user from the users array to ensure we have the latest data
      const latestUser = { ...userExists };
      this.currentUserCache = latestUser;
      
      console.log('getCurrentUser: Returning latest user data:', latestUser.username, 'balance:', latestUser.balance);
      return latestUser;
    } catch (error) {
      console.error('Error reading current user from localStorage:', error);
      // Clear invalid data
      this.setCurrentUser(null);
      return null;
    }
  }

  // Set current user with improved error handling and persistence
  setCurrentUser(user: User | null): void {
    try {
      if (user) {
        // Ensure the user exists in the users array before setting as current
        const users = this.getUsers();
        const userExists = users.find(u => u.id === user.id);
        
        if (!userExists) {
          console.log('setCurrentUser: User not found in users array, cannot set as current user');
          return;
        }
        
        // Use the user from the users array to ensure consistency
        const latestUser = { ...userExists };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(latestUser));
        this.currentUserCache = latestUser;
        console.log('setCurrentUser: Set current user:', latestUser.username, 'balance:', latestUser.balance);
      } else {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        this.currentUserCache = null;
        console.log('setCurrentUser: Cleared current user');
      }
      
      // Backup data for port persistence
      this.backupData();
    } catch (error) {
      console.error('Error saving current user to localStorage:', error);
      // Clear cache on error
      this.currentUserCache = null;
    }
  }

  // Update user with improved performance
  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
      
      // Update current user cache if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        this.currentUserCache = updatedUser;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
    }
  }

  // Add earnings to user (ad watched)
  addEarnings(userId: string, amount: number): User {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const user = users[userIndex];
    user.balance += amount;
    user.totalEarned += amount;
    // Add activity log entry
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
      type: 'ad',
      message: 'Watched an ad and earned',
      amount,
      date: new Date().toISOString(),
    });
    users[userIndex] = user;
    this.saveUsers(users);
    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
    return user;
  }

  // Clear all data (for testing)
  clearAllData(): void {
    // Create a backup before clearing
    try {
      const users = this.getUsers();
      const currentUser = this.getCurrentUser();
      const backup = {
        users,
        currentUser,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('cryptoRewardsBackup', JSON.stringify(backup));
      console.log('Backup created before clearing data');
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
    
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.clearCache();
  }

  // Method to clean up inconsistent subscription data
  cleanupSubscriptionData(): void {
    const users = this.getUsers();
    let updated = false;

    users.forEach((user, index) => {
      // If user has cancelled/expired status but subscription history shows active
      if ((user.subscriptionStatus === 'cancelled' || user.subscriptionStatus === 'expired') && 
          user.subscriptionHistory && user.subscriptionHistory.length > 0) {
        
        user.subscriptionHistory.forEach(subscription => {
          if (subscription.status === 'active' && user.subscriptionStatus) {
            subscription.status = user.subscriptionStatus;
            updated = true;
          }
        });
      }
      
      // If user has isSubscribed = false but active subscriptions in history
      if (!user.isSubscribed && user.subscriptionHistory && user.subscriptionHistory.length > 0) {
        const now = new Date();
        const hasActiveSub = user.subscriptionHistory.some(sub => {
          const endDate = new Date(sub.endDate);
          return sub.status === 'active' && endDate > now;
        });
        
        if (!hasActiveSub) {
          // Mark all active subscriptions as cancelled if user is not subscribed
          user.subscriptionHistory.forEach(subscription => {
            if (subscription.status === 'active') {
              subscription.status = 'cancelled';
              updated = true;
            }
          });
        }
      }
    });

    if (updated) {
      this.saveUsers(users);
      this.clearCache();
      console.log('Subscription data cleaned up');
    }
  }

  // Restore data from backup
  restoreFromBackup(): boolean {
    try {
      const backupData = localStorage.getItem('cryptoRewardsBackup');
      if (!backupData) {
        console.log('No backup found');
        return false;
      }

      const backup = JSON.parse(backupData);
      if (backup.users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(backup.users));
      }
      if (backup.currentUser) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(backup.currentUser));
      }
      
      this.clearCache();
      console.log('Data restored from backup');
      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  // Check if backup exists
  hasBackup(): boolean {
    return localStorage.getItem('cryptoRewardsBackup') !== null;
  }

  // Check if this is the first user (after admin)
  isFirstUser(): boolean {
    const users = this.getUsers();
    const nonAdminUsers = users.filter(user => user.username !== 'mhamad');
    return nonAdminUsers.length === 0;
  }

  // Get user count (for debugging)
  getUserCount(): number {
    return this.getUsers().length;
  }

  // Create default admin account
  createDefaultAdmin(): void {
    const users = this.getUsers();
    
    // Check if admin already exists
    const adminExists = users.some(user => user.username === 'mhamad');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        username: 'mhamad',
        email: 'admin@cryptorewards.com',
        firstName: 'Admin',
        lastName: 'User',
        password: '@@mhamad$$',
        balance: 0,
        totalEarned: 0,
        joinDate: new Date().toISOString(),
        // Referral fields
        referralCode: this.generateReferralCode(),
        referralEarnings: 0,
        referralCount: 0,
        referralHistory: [],
        // Initialize profile fields
        displayName: 'Admin',
        bio: 'System Administrator',
        phone: '',
        country: '',
        timezone: 'UTC',
        language: 'en',
        // Initialize settings fields
        theme: 'dark',
        emailNotifications: true,
        pushNotifications: true,
        soundEnabled: true,
        autoPlayAds: true,
        showEarnings: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        // Initialize notification settings
        newAds: true,
        earnings: true,
        streak: true,
        withdrawals: true,
        referrals: true,
        promotions: true,
        // Initialize stats fields
        currentStreak: 0,
        totalAdsWatched: 0,
        // Initialize VIP fields
        vipTier: undefined,
        vipStartDate: undefined,
        lastVipReward: undefined,
        // Initialize subscription fields
        isSubscribed: false,
        subscriptionType: undefined,
        subscriptionStartDate: undefined,
        subscriptionEndDate: undefined,
        subscriptionStatus: undefined,
        subscriptionHistory: [],
        // Email verification
        isEmailVerified: true,
        // Activity log
        activityLog: []
      };

      users.push(adminUser);
      this.saveUsers(users);
    }
  }

  // Generate a unique referral code
  private generateReferralCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
  }

  // Add a referral for a user
  addReferral(userId: string, referredUser: User): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const user = users[userIndex];
    
    // Referral reward amount
    const referralReward = 2.00; // $2.00 per referral
    
    const referralRecord: ReferralRecord = {
      id: Date.now().toString(),
      referredUsername: referredUser.username,
      referredEmail: referredUser.email,
      joinDate: new Date().toISOString(),
      earnings: referralReward, // Set the earnings amount
      status: 'active'
    };
    
    // Update user's referral statistics
    user.referralHistory.push(referralRecord);
    user.referralCount = user.referralHistory.length;
    user.referralEarnings += referralReward;
    user.balance += referralReward; // Add reward to balance
    user.totalEarned += referralReward; // Add to total earnings
    
    // Add activity log entry
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
      type: 'referral',
      message: `Referred ${referredUser.username} and earned $${referralReward.toFixed(2)}`,
      amount: referralReward,
      date: new Date().toISOString(),
      extra: { referredUser: referredUser.username }
    });
    
    // Add notification for referral reward
    this.addNotification(userId, {
      type: 'reward',
      title: 'Referral Reward!',
      message: `You earned $${referralReward.toFixed(2)} for referring ${referredUser.username}!`
    });
    
    users[userIndex] = user;
    this.saveUsers(users);
    
    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
    
    console.log(`✅ Referral processed: ${user.username} referred ${referredUser.username} and earned $${referralReward.toFixed(2)}`);
  }

  // Get referral history for a user
  getReferralHistory(userId: string): ReferralRecord[] {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.referralHistory;
  }

  // Update referral earnings for a user
  updateReferralEarnings(userId: string, referralId: string, earnings: number): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    const referralIndex = user.referralHistory.findIndex(r => r.id === referralId);

    if (referralIndex === -1) {
      throw new Error('Referral record not found');
    }

    user.referralHistory[referralIndex].earnings = earnings;
    this.saveUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
  }

  // Mark referral as inactive
  markReferralInactive(userId: string, referralId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    const referralIndex = user.referralHistory.findIndex(r => r.id === referralId);

    if (referralIndex === -1) {
      throw new Error('Referral record not found');
    }

    user.referralHistory[referralIndex].status = 'inactive';
    this.saveUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
  }

  // Handle deposit
  handleDeposit(userId: string, depositAmount: number): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const user = users[userIndex];
    user.balance += depositAmount;
    // Add activity log entry
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
      type: 'deposit',
      message: 'Deposit approved',
      amount: depositAmount,
      date: new Date().toISOString(),
    });
    users[userIndex] = user;
    this.saveUsers(users);
  }

  // Process VIP daily rewards
  processVIPRewards(): void {
    const today = new Date().toDateString();
    const sessionKey = `vipRewardsProcessed_${today}`;
    
    // Check if rewards were already processed today
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    
    const users = this.getUsers();
    let hasChanges = false;
    
    users.forEach(user => {
      if (user.vipTier && user.vipStartDate) {
        // Initialize VIP ad progress if not exists or if it's a new day
        if (!user.vipAdProgress || user.vipAdProgress.lastResetDate !== today) {
          const vipTier = this.getVIPTier(user.vipTier);
          if (vipTier) {
            user.vipAdProgress = {
              adsWatched: 0,
              totalAdsRequired: 10, // changed from 20 to 10
              dailyReward: vipTier.dailyReward,
              lastResetDate: today
            };
            hasChanges = true;
          }
        }
            
            // Update current user if it's the same user
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === user.id) {
              this.setCurrentUser(user);
        }
      }
    });
    
    // Only save if there were actual changes
    if (hasChanges) {
      this.saveUsers(users);
      // Mark as processed for today
      sessionStorage.setItem(sessionKey, 'true');
    }
  }

  // Get VIP tier information
  getVIPTier(tierId: number): { dailyReward: number; name: string } | null {
    const vipTiers = [
      { id: 1, name: "VIP 1", dailyReward: 0.60 },
      { id: 2, name: "VIP 2", dailyReward: 2.16 },
      { id: 3, name: "VIP 3", dailyReward: 5.16 },
      { id: 4, name: "VIP 4", dailyReward: 7.16 },
      { id: 5, name: "VIP 5", dailyReward: 11.19 },
      { id: 6, name: "VIP 6", dailyReward: 21.22 },
      { id: 7, name: "VIP 7", dailyReward: 47.52 }
    ];
    
    return vipTiers.find(tier => tier.id === tierId) || null;
  }

  // Process VIP ad reward when user watches an ad
  processVIPAdReward(userId: string): { reward: number; isComplete: boolean; progress: number } | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1 || !users[userIndex].vipTier || !users[userIndex].vipAdProgress) {
      return null;
    }

    const user = users[userIndex];
    const today = new Date().toDateString();
    
    // Ensure vipAdProgress exists
    if (!user.vipAdProgress) {
      const vipTier = this.getVIPTier(user.vipTier!);
      if (vipTier) {
        user.vipAdProgress = {
          adsWatched: 0,
          totalAdsRequired: 10, // changed from 20 to 10
          dailyReward: vipTier.dailyReward,
          lastResetDate: today
        };
      } else {
        return null;
      }
    }
    
    // Reset progress if it's a new day
    if (user.vipAdProgress.lastResetDate !== today) {
      const vipTier = this.getVIPTier(user.vipTier!);
      if (vipTier) {
        user.vipAdProgress = {
          adsWatched: 0,
          totalAdsRequired: 10, // changed from 20 to 10
          dailyReward: vipTier.dailyReward,
          lastResetDate: today
        };
      }
    }

    // Calculate reward for this ad (1/10 of daily reward)
    const rewardPerAd = user.vipAdProgress.dailyReward / 10; // changed from 20 to 10
    
    // Increment ads watched
    user.vipAdProgress.adsWatched += 1;
    
    // Check if daily goal is complete
    const isComplete = user.vipAdProgress.adsWatched >= user.vipAdProgress.totalAdsRequired;
    
    // Add reward to user's balance
    user.balance += rewardPerAd;
    user.totalEarned += rewardPerAd;
    
    // If daily goal is complete, mark the reward as claimed
    if (isComplete) {
      user.lastVipReward = new Date().toISOString();
    }
    
    // Save changes
    this.saveUsers(users);
    
    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
    
    return {
      reward: rewardPerAd,
      isComplete,
      progress: user.vipAdProgress.adsWatched
    };
  }

  // Get all users (for admin panel)
  getAllUsers(): User[] {
    const users = this.getUsers();
    
    // Ensure all users have referral codes
    let hasChanges = false;
    users.forEach(user => {
      if (!user.referralCode || user.referralCode.trim() === '') {
        user.referralCode = this.generateReferralCode();
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      this.saveUsers(users);
    }
    
    return users;
  }

  // Reset user account completely
  resetUserAccount(username: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
      throw new Error(`User with username '${username}' not found`);
    }

    // Reset all user data to initial state
    users[userIndex] = {
      ...users[userIndex],
      balance: 0,
      totalEarned: 0,
      referralEarnings: 0,
      referralCount: 0,
      referralHistory: [],
      currentStreak: 0,
      totalAdsWatched: 0,
      vipTier: undefined,
      vipStartDate: undefined,
      lastVipReward: undefined,
      // Keep basic account info
      id: users[userIndex].id,
      username: users[userIndex].username,
      email: users[userIndex].email,
      password: users[userIndex].password,
      joinDate: users[userIndex].joinDate,
      referralCode: users[userIndex].referralCode,
      referredBy: users[userIndex].referredBy,
      // Reset subscription fields
      isSubscribed: false,
      subscriptionType: undefined,
      subscriptionStartDate: undefined,
      subscriptionEndDate: undefined,
      subscriptionStatus: undefined,
      subscriptionHistory: [],
      // Email verification
      isEmailVerified: true,
      // Activity log
      activityLog: []
    };

    this.saveUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.username === username) {
      this.setCurrentUser(users[userIndex]);
    }
  }

  // Reset total earned and ads watched for all users
  resetEarningsAndStats(): void {
    const users = this.getUsers();
    let hasChanges = false;
    
    users.forEach(user => {
      // Reset total earned and ads watched, but keep current balance
      user.totalEarned = user.balance; // Set total earned to current balance
      user.totalAdsWatched = 0;
      user.currentStreak = 0;
      hasChanges = true;
    });
    
    if (hasChanges) {
      this.saveUsers(users);
      
      // Update current user if logged in
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = users.find(u => u.id === currentUser.id);
        if (updatedUser) {
          this.setCurrentUser(updatedUser);
        }
      }
    }
  }

  // Add balance to specific user by username
  addBalanceToUser(username: string, amount: number): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
      throw new Error(`User with username '${username}' not found`);
    }

    users[userIndex].balance += amount;
    users[userIndex].totalEarned += amount;
    this.saveUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.username === username) {
      this.setCurrentUser(users[userIndex]);
    }
  }

  // Subscription Management Methods
  addSubscription(userId: string, subscriptionData: {
    type: 'basic' | 'premium' | 'vip';
    amount: number;
    duration: number; // in days
    paymentMethod?: string;
    transactionId?: string;
    notes?: string;
    vipTierId?: number; // Add VIP tier ID parameter
  }): User {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    
    // Check if user has sufficient balance for wallet_balance payment
    if (subscriptionData.paymentMethod === 'wallet_balance') {
      if (user.balance < subscriptionData.amount) {
        throw new Error('Insufficient balance for subscription');
      }
      // Deduct the subscription amount from user's balance
      user.balance -= subscriptionData.amount;
    }
    
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + subscriptionData.duration * 24 * 60 * 60 * 1000).toISOString();
    
    const subscriptionRecord: SubscriptionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: subscriptionData.type,
      startDate,
      endDate,
      status: 'active',
      amount: subscriptionData.amount,
      paymentMethod: subscriptionData.paymentMethod,
      transactionId: subscriptionData.transactionId,
      notes: subscriptionData.notes
    };

    // Update user subscription fields
    user.isSubscribed = true;
    user.subscriptionType = subscriptionData.type;
    user.subscriptionStartDate = startDate;
    user.subscriptionEndDate = endDate;
    user.subscriptionStatus = 'active';
    
    // Initialize subscription history if it doesn't exist
    if (!user.subscriptionHistory) {
      user.subscriptionHistory = [];
    }
    
    // Add to subscription history
    user.subscriptionHistory.push(subscriptionRecord);
    
    // Update VIP tier if subscription is VIP
    if (subscriptionData.type === 'vip') {
      user.vipTier = subscriptionData.vipTierId || 1; // Use provided tier ID or default to 1
      user.vipStartDate = startDate;
    }

    users[userIndex] = user;
    this.saveUsers(users);
    
    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
    
    // Add activity log entry
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.unshift({
      type: 'vip',
      message: `Purchased VIP (${subscriptionData.type})`,
      amount: subscriptionData.amount,
      date: new Date().toISOString(),
      extra: { duration: subscriptionData.duration, paymentMethod: subscriptionData.paymentMethod }
    });
    this.saveUsers(users);
    
    return user;
  }

  cancelSubscription(userId: string, reason?: string): User {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    
    // Check if user has any active subscription (including VIP)
    const hasActiveSub = this.hasActiveSubscription(userId);
    if (!hasActiveSub) {
      throw new Error('User has no active subscription to cancel');
    }

    // Update subscription status
    user.subscriptionStatus = 'cancelled';
    user.isSubscribed = false;
    
    // Clear VIP tier if it's a VIP subscription
    if (user.subscriptionType === 'vip') {
      user.vipTier = undefined;
      user.vipStartDate = undefined;
      user.lastVipReward = undefined;
      user.vipAdProgress = undefined;
    }
    
    // Update ALL active subscription records to cancelled
    if (user.subscriptionHistory && user.subscriptionHistory.length > 0) {
      const now = new Date();
      let updatedCount = 0;
      
      user.subscriptionHistory.forEach(subscription => {
        const endDate = new Date(subscription.endDate);
        if (subscription.status === 'active' && endDate > now) {
          subscription.status = 'cancelled';
          if (reason) {
            subscription.notes = (subscription.notes || '') + ` | Cancelled: ${reason}`;
          }
          updatedCount++;
        }
      });
      
      // If no active subscriptions were found, mark the most recent one as cancelled
      if (updatedCount === 0 && user.subscriptionHistory.length > 0) {
        const latestSubscription = user.subscriptionHistory[user.subscriptionHistory.length - 1];
        latestSubscription.status = 'cancelled';
        if (reason) {
          latestSubscription.notes = (latestSubscription.notes || '') + ` | Cancelled: ${reason}`;
        }
      }
    }

    users[userIndex] = user;
    this.saveUsers(users);
    
    // Clear cache to ensure fresh data
    this.clearCache();
    
    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
    
    return user;
  }

  renewSubscription(userId: string, subscriptionData: {
    type: 'basic' | 'premium' | 'vip';
    amount: number;
    duration: number;
    paymentMethod?: string;
    transactionId?: string;
    notes?: string;
    vipTierId?: number;
  }): User {
    // First cancel the current subscription
    this.cancelSubscription(userId, 'Renewed');
    
    // Then add the new subscription
    return this.addSubscription(userId, subscriptionData);
  }

  hasActiveSubscription(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user) {
      return false;
    }
    
    // Check if user has isSubscribed flag and valid end date
    if (user.isSubscribed && user.subscriptionEndDate) {
      const now = new Date();
      const endDate = new Date(user.subscriptionEndDate);
      
      if (endDate > now && user.subscriptionStatus === 'active') {
        return true;
      }
    }
    
    // Also check subscription history for active subscriptions (for VIP users)
    if (user.subscriptionHistory && user.subscriptionHistory.length > 0) {
      const now = new Date();
      const activeSubscription = user.subscriptionHistory.find(sub => {
        const endDate = new Date(sub.endDate);
        return sub.status === 'active' && endDate > now;
      });
      
      if (activeSubscription) {
        return true;
      }
    }
    
    return false;
  }

  getActiveSubscriptionInfo(userId: string): { 
    type: string; 
    endDate: string; 
    daysRemaining: number;
    tierName?: string;
  } | null {
    const user = this.getUserById(userId);
    if (!user || !user.isSubscribed || !user.subscriptionEndDate) {
      return null;
    }
    
    const now = new Date();
    const endDate = new Date(user.subscriptionEndDate);
    
    if (endDate <= now || user.subscriptionStatus !== 'active') {
      return null;
    }
    
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      type: user.subscriptionType || 'unknown',
      endDate: user.subscriptionEndDate,
      daysRemaining,
      tierName: user.vipTier ? `VIP ${user.vipTier}` : undefined
    };
  }

  getSubscriptionStats(): {
    totalSubscribers: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    cancelledSubscriptions: number;
    revenueByType: { [key: string]: number };
    recentSubscriptions: SubscriptionRecord[];
  } {
    const users = this.getUsers();
    const subscribers = users.filter(user => user.subscriptionHistory && user.subscriptionHistory.length > 0);
    
    const stats = {
      totalSubscribers: subscribers.length,
      activeSubscriptions: 0,
      expiredSubscriptions: 0,
      cancelledSubscriptions: 0,
      revenueByType: { basic: 0, premium: 0, vip: 0 },
      recentSubscriptions: [] as SubscriptionRecord[]
    };

    const now = new Date();
    
    subscribers.forEach(user => {
      if (user.subscriptionHistory) {
        user.subscriptionHistory.forEach(sub => {
          // Count by status
          if (sub.status === 'active') {
            const endDate = new Date(sub.endDate);
            if (endDate > now) {
              stats.activeSubscriptions++;
            } else {
              stats.expiredSubscriptions++;
            }
          } else if (sub.status === 'cancelled') {
            stats.cancelledSubscriptions++;
          }
          
          // Calculate revenue
          stats.revenueByType[sub.type] += sub.amount;
          
          // Get recent subscriptions (last 30 days)
          const subDate = new Date(sub.startDate);
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (subDate >= thirtyDaysAgo) {
            stats.recentSubscriptions.push(sub);
          }
        });
      }
    });

    // Sort recent subscriptions by date (newest first)
    stats.recentSubscriptions.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return stats;
  }

  getSubscriptionsByDateRange(startDate: Date, endDate: Date): SubscriptionRecord[] {
    const users = this.getUsers();
    const subscriptions: SubscriptionRecord[] = [];
    
    users.forEach(user => {
      if (user.subscriptionHistory) {
        user.subscriptionHistory.forEach(sub => {
          const subDate = new Date(sub.startDate);
          if (subDate >= startDate && subDate <= endDate) {
            subscriptions.push({
              ...sub,
              username: user.username,
              email: user.email
            } as SubscriptionRecord & { username: string; email: string });
          }
        });
      }
    });

    return subscriptions.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }

  checkExpiredSubscriptions(): void {
    const users = this.getUsers();
    const now = new Date();
    let updated = false;

    users.forEach((user, index) => {
      if (user.isSubscribed && user.subscriptionEndDate) {
        const endDate = new Date(user.subscriptionEndDate);
        if (endDate < now && user.subscriptionStatus === 'active') {
          // Mark subscription as expired
          users[index].subscriptionStatus = 'expired';
          users[index].isSubscribed = false;
          
          // Update the latest subscription record
          if (users[index].subscriptionHistory && users[index].subscriptionHistory.length > 0) {
            const latestSubscription = users[index].subscriptionHistory[users[index].subscriptionHistory.length - 1];
            latestSubscription.status = 'expired';
          }
          
          updated = true;
        }
      }
      
      // Also clean up subscription history for expired subscriptions
      if (users[index].subscriptionHistory && users[index].subscriptionHistory.length > 0) {
        users[index].subscriptionHistory.forEach(subscription => {
          const endDate = new Date(subscription.endDate);
          if (endDate < now && subscription.status === 'active') {
            subscription.status = 'expired';
            updated = true;
          }
        });
      }
    });

    if (updated) {
      this.saveUsers(users);
      this.clearCache();
    }
  }

  // Add a method to mark email as verified
  markEmailVerified(userId: string): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].isEmailVerified = true;
      this.saveUsers(users);
      // Update current user if needed
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(users[index]);
      }
    }
  }

  // Add methods to set and check withdraw passcode
  setWithdrawPasscode(userId: string, passcode: string): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].withdrawPasscode = passcode;
      this.saveUsers(users);
      // Update current user if needed
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(users[index]);
      }
    }
  }

  checkWithdrawPasscode(userId: string, passcode: string): boolean {
    const user = this.getUsers().find(u => u.id === userId);
    return user?.withdrawPasscode === passcode;
  }

  resetAllBalances(): void {
    const users = this.getUsers();
    users.forEach(user => {
      user.balance = 0;
      user.totalEarned = 0;
    });
    this.saveUsers(users);
    this.clearCache();
  }

  // Synchronize user data from users array to current user storage
  syncUserData(userId: string): void {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        // Update current user with latest data from users array
        this.setCurrentUser(user);
        console.log('syncUserData: Updated current user with latest data:', user.username, 'balance:', user.balance);
      }
    }
  }

  // Validate and repair current user data
  validateCurrentUser(): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      console.log('validateCurrentUser: No current user found');
      return false;
    }

    const users = this.getUsers();
    const userInArray = users.find(u => u.id === currentUser.id);
    
    if (!userInArray) {
      console.log('validateCurrentUser: Current user not found in users array, clearing');
      this.setCurrentUser(null);
      return false;
    }

    // Check if data is consistent
    const isConsistent = 
      currentUser.balance === userInArray.balance &&
      currentUser.totalEarned === userInArray.totalEarned &&
      currentUser.vipTier === userInArray.vipTier;

    if (!isConsistent) {
      console.log('validateCurrentUser: Data inconsistent, updating current user');
      this.setCurrentUser(userInArray);
      return false;
    }

    console.log('validateCurrentUser: Current user data is valid and consistent');
    return true;
  }

  // Get notifications for a specific user
  getUserNotifications(userId: string): Notification[] {
    try {
      const allNotifications = localStorage.getItem(this.NOTIFICATIONS_KEY);
      if (!allNotifications) return [];
      
      const notifications: Notification[] = JSON.parse(allNotifications);
      return notifications.filter(n => n.userId === userId);
    } catch (error) {
      console.error('Error reading notifications from localStorage:', error);
      return [];
    }
  }

  // Add a notification for a user
  addNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'timestamp' | 'read'>): void {
    try {
      const allNotifications = localStorage.getItem(this.NOTIFICATIONS_KEY);
      const notifications: Notification[] = allNotifications ? JSON.parse(allNotifications) : [];
      
      const newNotification: Notification = {
        ...notification,
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      notifications.push(newNotification);
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error adding notification to localStorage:', error);
    }
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): void {
    try {
      const allNotifications = localStorage.getItem(this.NOTIFICATIONS_KEY);
      if (!allNotifications) return;
      
      const notifications: Notification[] = JSON.parse(allNotifications);
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read for a user
  markAllNotificationsAsRead(userId: string): void {
    try {
      const allNotifications = localStorage.getItem(this.NOTIFICATIONS_KEY);
      if (!allNotifications) return;
      
      const notifications: Notification[] = JSON.parse(allNotifications);
      const updatedNotifications = notifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
      );
      
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Add withdrawal approval notification and activity
  addWithdrawalApprovalNotification(userId: string, amount: number, transactionHash?: string): void {
    const message = transactionHash 
      ? `Your withdrawal request for ${amount} USDT has been approved and completed. Transaction hash: ${transactionHash}`
      : `Your withdrawal request for ${amount} USDT has been approved and is being processed.`;
    
    this.addNotification(userId, {
      type: 'withdrawal',
      title: 'Withdrawal Approved! 💰',
      message
    });

    // Add activity log entry
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      if (!user.activityLog) user.activityLog = [];
      user.activityLog.unshift({
        type: 'withdrawal',
        message: 'Withdrawal approved',
        amount,
        date: new Date().toISOString(),
        extra: { transactionHash }
      });
      users[userIndex] = user;
      this.saveUsers(users);
    }
  }

  // Add withdrawal rejection notification
  addWithdrawalRejectionNotification(userId: string, amount: number, reason?: string): void {
    const message = reason 
      ? `Your withdrawal request for ${amount} USDT has been rejected. Reason: ${reason}`
      : `Your withdrawal request for ${amount} USDT has been rejected.`;
    
    this.addNotification(userId, {
      type: 'warning',
      title: 'Withdrawal Rejected',
      message
    });
  }

  // Ensure ballen user exists with proper balance (only create if doesn't exist)
  // Create a test ballen user with a known referral code for easy testing
  // DISABLED: This creates demo accounts with fake balances - not for production
  createTestBallenUser(): void {
    console.warn('createTestBallenUser is disabled - demo accounts not allowed in production');
    return;
    
    // try {
    //   const users = this.getUsers();
    //   const ballenExists = users.find(u => u.username === 'ballen');
    //   
    //   if (ballenExists) {
    //     // Update existing ballen user with correct password and referral code
    //     const ballenIndex = users.findIndex(u => u.username === 'ballen');
    //     users[ballenIndex].password = 'ballen'; // Set correct password
    //     users[ballenIndex].referralCode = 'Hppr8Yke'; // Use the actual referral code
    //     this.saveUsers(users);
    //     console.log('Updated ballen user with password: ballen and referral code: Hppr8Yke');
    //   } else {
    //     // Create new ballen user with correct credentials
    //     const ballenUser: User = {
    //       id: 'ballen-001',
    //       username: 'ballen',
    //       email: 'ballen@example.com',
    //       firstName: 'Ballen',
    //       lastName: 'User',
    //       password: 'ballen', // Correct password for ballen:ballen login
    //       balance: 500,
    //       totalEarned: 0,
    //       joinDate: new Date().toISOString(),
    //       referralCode: 'Hppr8Yke', // Use the actual referral code from your profile
    //       referralEarnings: 0,
    //       referralCount: 0,
    //       referralHistory: [],
    //       displayName: 'Ballen',
    //       bio: 'Test User',
    //       phone: '',
    //       country: '',
    //       timezone: 'UTC',
    //       language: 'en',
    //       theme: 'dark',
    //       emailNotifications: true,
    //       pushNotifications: true,
    //       soundEnabled: true,
    //       autoPlayAds: true,
    //       showEarnings: true,
    //       twoFactorAuth: false,
    //       sessionTimeout: 30,
    //       newAds: true,
    //       earnings: true,
    //       streak: true,
    //       withdrawals: true,
    //       referrals: true,
    //       promotions: true,
    //       currentStreak: 0,
    //       totalAdsWatched: 0,
    //       isEmailVerified: true,
    //       activityLog: []
    //     };
    //     
    //     users.push(ballenUser);
    //     this.saveUsers(users);
    //     console.log('Created ballen user with password: ballen and referral code: Hppr8Yke');
    //   }
    // } catch (error) {
    //   console.error('Error creating test ballen user:', error);
    // }
  }

  // DISABLED: This creates demo accounts with fake balances - not for production
  ensureBallenUser(): void {
    console.warn('ensureBallenUser is disabled - demo accounts not allowed in production');
    return;
    
    // try {
    //   const users = this.getUsers();
    //   const ballenExists = users.find(u => u.username === 'ballen');
    //   
    //   if (!ballenExists) {
    //     console.log('Creating ballen user...');
    //     const ballenUser = this.createUser({
    //       username: 'ballen',
    //       email: 'ballen@example.com',
    //       firstName: 'Ballen',
    //       lastName: 'User',
    //       password: 'password123'
    //     });
    //     
    //     // Add balance and mark as email verified
    //     this.addBalanceToUser('ballen', 500);
    //     this.markEmailVerified(ballenUser.id);
    //     
    //     console.log('Created ballen user with $500 balance and email verified');
    //   } else {
    //     console.log('Ballen user already exists');
    //     
    //     // Ensure the existing ballen user has a referral code
    //     const ballenUser = users.find(u => u.username === 'ballen');
    //     if (ballenUser && (!ballenUser.referralCode || ballenUser.referralCode.trim() === '')) {
    //       ballenUser.referralCode = this.generateReferralCode();
    //       this.saveUsers(users);
    //       console.log('Generated referral code for existing ballen user:', ballenUser.referralCode);
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error ensuring ballen user exists:', error);
    // }
  }

  // Session Management Methods
  private getSessions(): DeviceSession[] {
    try {
      const sessions = localStorage.getItem(this.SESSIONS_KEY);
      console.log('🔧 Reading sessions from localStorage key:', this.SESSIONS_KEY);
      console.log('🔧 Raw sessions data:', sessions);
      const parsedSessions = sessions ? JSON.parse(sessions) : [];
      console.log('🔧 Parsed sessions:', parsedSessions);
      return parsedSessions;
    } catch (error) {
      console.error('Error reading sessions from localStorage:', error);
      return [];
    }
  }

  private saveSessions(sessions: DeviceSession[]): void {
    try {
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions to localStorage:', error);
    }
  }

  // Create a new session when user logs in
  createSession(userId: string): DeviceSession {
    console.log('🔧 Creating session for user:', userId);
    console.log('🔧 User Agent:', navigator.userAgent);
    
    const sessions = this.getSessions();
    console.log('🔧 Existing sessions:', sessions.length);
    
    // First, automatically clean up any duplicate sessions for this user
    this.removeDuplicateSessions(userId);
    
    // Get sessions again after cleanup
    const cleanedSessions = this.getSessions();
    
    // Enhanced duplicate detection - check for existing sessions with same device fingerprint
    const deviceFingerprint = this.createDeviceFingerprint();
    console.log('🔧 Device fingerprint:', deviceFingerprint);
    
    // Check if there's already a session for this user with the same device fingerprint
    const existingSession = cleanedSessions.find(session => 
      session.userId === userId && 
      this.createDeviceFingerprintFromSession(session) === deviceFingerprint
    );
    
    if (existingSession) {
      console.log('🔧 Found existing session with same device fingerprint:', existingSession.id);
      // Update the existing session instead of creating a new one
      existingSession.lastActive = new Date().toISOString();
      existingSession.isCurrentSession = true;
      
      // Mark all other sessions for this user as not current
      cleanedSessions.forEach(session => {
        if (session.userId === userId && session.id !== existingSession.id) {
          session.isCurrentSession = false;
        }
      });
      
      this.saveSessions(cleanedSessions);
      return existingSession;
    }
    
    // Check if there's already a current session for this user and browser (fallback)
    const existingCurrentSession = cleanedSessions.find(session => 
      session.userId === userId && 
      session.isCurrentSession &&
      session.userAgent === navigator.userAgent
    );
    
    if (existingCurrentSession) {
      console.log('🔧 Updating existing current session:', existingCurrentSession.id);
      // Update the existing session instead of creating a new one
      existingCurrentSession.lastActive = new Date().toISOString();
      this.saveSessions(cleanedSessions);
      return existingCurrentSession;
    }
    
    // Mark all existing sessions for this user as not current
    cleanedSessions.forEach(session => {
      if (session.userId === userId) {
        session.isCurrentSession = false;
      }
    });

    // Detect device information
    const userAgent = navigator.userAgent;
    const deviceInfo = this.detectDeviceInfo(userAgent);
    console.log('🔧 Device info detected:', deviceInfo);
    
    // Get IP and location info
    const ipInfo = this.getIPInfo();
    console.log('🔧 IP info:', ipInfo);
    
    const newSession: DeviceSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceName: deviceInfo.deviceName,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress: ipInfo.ip,
      location: ipInfo.location,
      lastActive: new Date().toISOString(),
      isCurrentSession: true,
      userAgent,
      loginTime: new Date().toISOString()
    };

    console.log('🔧 New session created:', newSession);
    cleanedSessions.push(newSession);
    this.saveSessions(cleanedSessions);
    console.log('🔧 Total sessions after creation:', cleanedSessions.length);
    
    // Try to update with real IP information
    this.updateSessionWithIP(newSession.id);
    
    return newSession;
  }

  // Create a unique device fingerprint for better duplicate detection
  private createDeviceFingerprint(): string {
    const userAgent = navigator.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    const colorDepth = screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    // Create a fingerprint based on device characteristics
    const fingerprint = `${userAgent}|${screenRes}|${colorDepth}|${timezone}|${language}`;
    return btoa(fingerprint).slice(0, 32); // Base64 encode and truncate for consistency
  }

  // Create device fingerprint from existing session
  private createDeviceFingerprintFromSession(session: DeviceSession): string {
    const userAgent = session.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    const colorDepth = screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    const fingerprint = `${userAgent}|${screenRes}|${colorDepth}|${timezone}|${language}`;
    return btoa(fingerprint).slice(0, 32);
  }

  // Get all sessions for a user
  getUserSessions(userId: string): DeviceSession[] {
    const sessions = this.getSessions();
    const userSessions = sessions.filter(session => session.userId === userId);
    console.log('🔧 Getting sessions for user:', userId);
    console.log('🔧 Found sessions:', userSessions.length);
    
    // Automatically clean up duplicates when sessions are retrieved
    if (userSessions.length > 1) {
      console.log('🔧 Auto-cleaning duplicates for user:', userId);
      this.removeDuplicateSessions(userId);
      
      // Get the cleaned sessions
      const cleanedSessions = this.getSessions();
      const cleanedUserSessions = cleanedSessions.filter(session => session.userId === userId);
      console.log('🔧 After auto-cleanup - user sessions:', cleanedUserSessions.length);
      return cleanedUserSessions;
    }
    
    console.log('🔧 All sessions in storage:', sessions);
    return userSessions;
  }

  // Update session activity
  updateSessionActivity(sessionId: string): void {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].lastActive = new Date().toISOString();
      this.saveSessions(sessions);
      
      // Automatically clean up duplicates for this user
      const userId = sessions[sessionIndex].userId;
      const userSessions = sessions.filter(s => s.userId === userId);
      if (userSessions.length > 1) {
        console.log('🔧 Auto-cleaning duplicates during activity update for user:', userId);
        this.removeDuplicateSessions(userId);
      }
    }
  }

  // Terminate a specific session
  terminateSession(sessionId: string): void {
    const sessions = this.getSessions();
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(updatedSessions);
  }

  // Terminate all sessions for a user except current
  terminateAllOtherSessions(userId: string): void {
    const sessions = this.getSessions();
    const currentSession = sessions.find(s => s.userId === userId && s.isCurrentSession);
    const updatedSessions = currentSession ? [currentSession] : [];
    this.saveSessions(updatedSessions);
  }

  // Terminate all sessions for a user
  terminateAllSessions(userId: string): void {
    const sessions = this.getSessions();
    const updatedSessions = sessions.filter(s => s.userId !== userId);
    this.saveSessions(updatedSessions);
  }

  // Clean up old sessions (older than 30 days)
  cleanupOldSessions(): void {
    const sessions = this.getSessions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const updatedSessions = sessions.filter(session => {
      const lastActive = new Date(session.lastActive);
      return lastActive > thirtyDaysAgo;
    });
    
    if (updatedSessions.length !== sessions.length) {
      this.saveSessions(updatedSessions);
    }
  }

  // Remove duplicate sessions for the same user and browser
  removeDuplicateSessions(userId: string): void {
    const sessions = this.getSessions();
    const userSessions = sessions.filter(s => s.userId === userId);
    
    if (userSessions.length <= 1) {
      return; // No duplicates to remove
    }
    
    console.log('🔧 Removing duplicate sessions for user:', userId);
    console.log('🔧 Before cleanup - user sessions:', userSessions.length);
    
    // Enhanced duplicate detection using device fingerprints
    const deviceFingerprints = new Map<string, DeviceSession[]>();
    
    userSessions.forEach(session => {
      const fingerprint = this.createDeviceFingerprintFromSession(session);
      if (!deviceFingerprints.has(fingerprint)) {
        deviceFingerprints.set(fingerprint, []);
      }
      deviceFingerprints.get(fingerprint)!.push(session);
    });
    
    // Keep only the most recent session for each device fingerprint
    const sessionsToKeep: DeviceSession[] = [];
    let totalRemoved = 0;
    
    deviceFingerprints.forEach((group, fingerprint) => {
      if (group.length > 1) {
        // Sort by last active time and keep the most recent
        group.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
        sessionsToKeep.push(group[0]);
        totalRemoved += group.length - 1;
        console.log('🔧 Removed', group.length - 1, 'duplicate sessions for device fingerprint:', fingerprint.slice(0, 8) + '...');
      } else {
        sessionsToKeep.push(group[0]);
      }
    });
    
    // Update sessions list
    const otherUserSessions = sessions.filter(s => s.userId !== userId);
    const updatedSessions = [...otherUserSessions, ...sessionsToKeep];
    this.saveSessions(updatedSessions);
    
    console.log('🔧 After cleanup - user sessions:', sessionsToKeep.length);
    console.log('🔧 Total duplicates removed:', totalRemoved);
  }

  // Clean up all duplicate sessions for all users
  cleanupAllDuplicateSessions(): void {
    console.log('🔧 Starting cleanup of all duplicate sessions...');
    const sessions = this.getSessions();
    
    if (sessions.length === 0) {
      console.log('🔧 No sessions to clean up');
      return;
    }
    
    // Get unique user IDs
    const userIds = [...new Set(sessions.map(s => s.userId))];
    console.log('🔧 Found', userIds.length, 'users with sessions');
    
    let totalRemoved = 0;
    userIds.forEach(userId => {
      const userSessions = sessions.filter(s => s.userId === userId);
      const beforeCount = userSessions.length;
      
      this.removeDuplicateSessions(userId);
      
      const afterSessions = this.getSessions().filter(s => s.userId === userId);
      const afterCount = afterSessions.length;
      const removed = beforeCount - afterCount;
      
      if (removed > 0) {
        totalRemoved += removed;
        console.log('🔧 User', userId, ': removed', removed, 'duplicate sessions');
      }
    });
    
    console.log('🔧 Total duplicate sessions removed:', totalRemoved);
  }

  // Get current session for a user
  getCurrentSession(userId: string): DeviceSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.userId === userId && s.isCurrentSession) || null;
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

  // Get IP and location information
  private getIPInfo(): { ip: string; location: string } {
    // Check if we're in localhost/development
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('192.168.');
    
    // Get the actual IP from the URL or network
    const currentIP = window.location.hostname;
    const currentPort = window.location.port;
    
    if (isLocalhost) {
      return {
        ip: `${currentIP}:${currentPort} (Local)`,
        location: 'Local Development'
      };
    }
    
    // For production, we would make an API call to get real IP
    // For now, return a placeholder that will be updated if available
    return {
      ip: 'Detecting...',
      location: 'Unknown'
    };
  }

  // Update session with real IP information (call this after getting IP)
  async updateSessionWithIP(sessionId: string): Promise<void> {
    console.log('🔧 Updating session with IP info:', sessionId);
    
    try {
      // Try to get real IP and location from a public API
      console.log('🔧 Fetching location data from ipapi.co...');
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log('🔧 Location API response:', data);
      
      const sessions = this.getSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex !== -1) {
        sessions[sessionIndex].ipAddress = data.ip || 'Unknown IP';
        
        // Build location string from available data
        const locationParts = [];
        if (data.city) locationParts.push(data.city);
        if (data.region) locationParts.push(data.region);
        if (data.country_name) locationParts.push(data.country_name);
        
        if (locationParts.length > 0) {
          sessions[sessionIndex].location = locationParts.join(', ');
        } else {
          sessions[sessionIndex].location = 'Location unavailable';
        }
        
        console.log('🔧 Updated session with location:', sessions[sessionIndex].location);
        this.saveSessions(sessions);
      }
    } catch (error) {
      console.log('🔧 ipapi.co failed, trying ipify.org...', error);
      // Fallback to simple IP detection
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        
        const sessions = this.getSessions();
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        
        if (sessionIndex !== -1) {
          sessions[sessionIndex].ipAddress = data.ip;
          sessions[sessionIndex].location = 'IP detected, location unavailable';
          console.log('🔧 Updated session with IP only:', data.ip);
          this.saveSessions(sessions);
        }
      } catch (ipError) {
        console.log('🔧 ipify.org failed, trying local network...', ipError);
        // If API fails, try to get local network IP
        try {
          const localIP = await this.getLocalNetworkIP();
          const sessions = this.getSessions();
          const sessionIndex = sessions.findIndex(s => s.id === sessionId);
          
          if (sessionIndex !== -1) {
            sessions[sessionIndex].ipAddress = localIP || 'Local Network';
            sessions[sessionIndex].location = 'Local Network';
            console.log('🔧 Updated session with local network:', localIP);
            this.saveSessions(sessions);
          }
        } catch (localError) {
          console.log('🔧 All location methods failed, using fallback...', localError);
          // Final fallback
          const sessions = this.getSessions();
          const sessionIndex = sessions.findIndex(s => s.id === sessionId);
          
          if (sessionIndex !== -1) {
            sessions[sessionIndex].ipAddress = 'Unknown IP';
            sessions[sessionIndex].location = 'Location unavailable';
            console.log('🔧 Updated session with fallback values');
            this.saveSessions(sessions);
          }
        }
      }
    }
  }

  // Update all existing sessions with proper location data
  async updateAllSessionsWithLocation(): Promise<void> {
    console.log('🔧 Updating all existing sessions with location data...');
    const sessions = this.getSessions();
    const sessionsToUpdate = sessions.filter(s => 
      s.location === 'Detected via API' || 
      s.location === 'Unknown' || 
      !s.location
    );
    
    console.log('🔧 Found sessions to update:', sessionsToUpdate.length);
    
    for (const session of sessionsToUpdate) {
      await this.updateSessionWithIP(session.id);
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Try to get local network IP
  private async getLocalNetworkIP(): Promise<string | null> {
    try {
      // Try to get local IP using WebRTC
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      return new Promise((resolve) => {
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const ipMatch = event.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
            if (ipMatch) {
              const ip = ipMatch[1];
              if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
                resolve(ip);
                return;
              }
            }
          }
          resolve(null);
        };
        
        // Timeout after 1 second
        setTimeout(() => resolve(null), 1000);
      });
    } catch (error) {
      return null;
    }
  }

  // Format relative time
  formatRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  }

  // Test session functionality
  testSessionFunctionality(): void {
    console.log('🧪 Testing session functionality...');
    
    // Clear existing sessions for testing
    const testUserId = 'test-user-123';
    this.terminateAllSessions(testUserId);
    
    // Create test sessions with different user agents
    const testUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
    ];
    
    testUserAgents.forEach((userAgent, index) => {
      const session = this.createTestSession(testUserId, userAgent, `Test Device ${index + 1}`);
      console.log(`🧪 Created test session ${index + 1}:`, session);
    });
    
    // Get all sessions for the test user
    const userSessions = this.getUserSessions(testUserId);
    console.log('🧪 All sessions for test user:', userSessions);
    
    // Verify that only one session is marked as current
    const currentSessions = userSessions.filter(s => s.isCurrentSession);
    console.log('🧪 Current sessions count:', currentSessions.length);
    
    if (currentSessions.length !== 1) {
      console.error('❌ ERROR: Multiple current sessions found!');
    } else {
      console.log('✅ SUCCESS: Only one current session as expected');
    }
    
    // Clean up test sessions
    this.terminateAllSessions(testUserId);
    console.log('🧪 Test sessions cleaned up');
  }

  // Create a test session with a specific user agent
  private createTestSession(userId: string, userAgent: string, deviceName: string): DeviceSession {
    const sessions = this.getSessions();
    
    // Mark all existing sessions for this user as not current
    sessions.forEach(session => {
      if (session.userId === userId) {
        session.isCurrentSession = false;
      }
    });

    // Detect device information
    const deviceInfo = this.detectDeviceInfo(userAgent);
    
    const newSession: DeviceSession = {
      id: `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceName: deviceName,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress: 'Test IP',
      location: 'Test Location',
      lastActive: new Date().toISOString(),
      isCurrentSession: true,
      userAgent,
      loginTime: new Date().toISOString()
    };

    sessions.push(newSession);
    this.saveSessions(sessions);
    
    return newSession;
  }

  // Get session statistics
  getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    sessionsByDeviceType: { [key: string]: number };
    sessionsByBrowser: { [key: string]: number };
    sessionsByOS: { [key: string]: number };
  } {
    const sessions = this.getSessions();
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const activeSessions = sessions.filter(s => 
      new Date(s.lastActive) > fiveMinutesAgo
    );
    
    const deviceTypeCount: { [key: string]: number } = {};
    const browserCount: { [key: string]: number } = {};
    const osCount: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      deviceTypeCount[session.deviceType] = (deviceTypeCount[session.deviceType] || 0) + 1;
      browserCount[session.browser] = (browserCount[session.browser] || 0) + 1;
      osCount[session.os] = (osCount[session.os] || 0) + 1;
    });
    
    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      sessionsByDeviceType: deviceTypeCount,
      sessionsByBrowser: browserCount,
      sessionsByOS: osCount
    };
  }
}

export const userStorage = new UserStorage(); 