export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private _isSupported: boolean;

  constructor() {
    this._isSupported = 'Notification' in window;
    if (this._isSupported) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this._isSupported) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(data: NotificationData): Promise<Notification | null> {
    if (!this._isSupported || this.permission !== 'granted') {
      return null;
    }

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/icon-192x192.png',
        tag: data.tag,
        data: data.data,
        requireInteraction: false,
        silent: false
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  async showAdNotification(adTitle: string, reward: number): Promise<void> {
    await this.showNotification({
      title: 'New Ad Available! 🎬',
      body: `Watch "${adTitle}" and earn ${reward} USDT`,
      tag: 'new-ad',
      data: { type: 'new-ad', reward }
    });
  }

  async showRewardNotification(amount: number, source: string): Promise<void> {
    await this.showNotification({
      title: 'Reward Earned! 💰',
      body: `You earned ${amount} USDT from ${source}`,
      tag: 'reward-earned',
      data: { type: 'reward', amount, source }
    });
  }

  async showVIPNotification(): Promise<void> {
    await this.showNotification({
      title: 'VIP Benefits Unlocked! 👑',
      body: 'You now have access to exclusive ads and higher rewards',
      tag: 'vip-unlocked',
      data: { type: 'vip-unlocked' }
    });
  }

  async showWithdrawalNotification(amount: number): Promise<void> {
    await this.showNotification({
      title: 'Withdrawal Successful! 💸',
      body: `${amount} USDT has been sent to your wallet`,
      tag: 'withdrawal-success',
      data: { type: 'withdrawal', amount }
    });
  }

  async showReferralNotification(referralCode: string): Promise<void> {
    await this.showNotification({
      title: 'Referral Bonus! 🎁',
      body: `Share your code: ${referralCode} and earn 10% of your referrals' earnings`,
      tag: 'referral-bonus',
      data: { type: 'referral', code: referralCode }
    });
  }

  isPermissionGranted(): boolean {
    return this.permission === 'granted';
  }

  isSupported(): boolean {
    return this._isSupported;
  }
}

export const notificationService = new NotificationService(); 