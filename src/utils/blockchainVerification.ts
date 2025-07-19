// Blockchain Transaction Verification Service
// Handles automatic verification of USDT deposits with security features

export interface VerificationConfig {
  maxAutoApprovalAmount: number;
  minConfirmationTime: number; // in milliseconds
  whitelistedAddresses: string[];
  rateLimitWindow: number; // in milliseconds
  maxDepositsPerWindow: number;
}

export interface TransactionData {
  txHash: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface VerificationResult {
  isValid: boolean;
  reason?: string;
  transactionData?: TransactionData;
  autoApprove: boolean;
}

// Default configuration
const DEFAULT_CONFIG: VerificationConfig = {
  maxAutoApprovalAmount: 1000, // USDT
  minConfirmationTime: 5 * 60 * 1000, // 5 minutes
  whitelistedAddresses: [], // Empty by default - admin can add addresses
  rateLimitWindow: 60 * 60 * 1000, // 1 hour
  maxDepositsPerWindow: 3 // Max 3 deposits per hour per user
};

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

class BlockchainVerificationService {
  private config: VerificationConfig;

  constructor(config: Partial<VerificationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Update configuration (for admin panel)
  updateConfig(newConfig: Partial<VerificationConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): VerificationConfig {
    return { ...this.config };
  }

  // Verify transaction using Tron API
  async verifyTransaction(txHash: string, expectedAmount: number, expectedToAddress: string): Promise<TransactionData | null> {
    try {
      // Use Tron API to get transaction details
      const response = await fetch(`https://api.trongrid.io/v1/transactions/${txHash}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('Transaction not found');
      }

      const tx = data.data[0];
      
      // Extract transaction details
      const transactionData: TransactionData = {
        txHash: tx.txID,
        amount: this.parseAmount(tx.raw_data?.contract?.[0]?.parameter?.value?.amount),
        fromAddress: this.formatAddress(tx.raw_data?.contract?.[0]?.parameter?.value?.owner_address),
        toAddress: this.formatAddress(tx.raw_data?.contract?.[0]?.parameter?.value?.to_address),
        timestamp: tx.blockTimeStamp,
        confirmations: tx.confirmed ? 1 : 0, // Simplified confirmation count
        status: tx.confirmed ? 'confirmed' : 'pending'
      };

      return transactionData;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return null;
    }
  }

  // Parse amount from Tron transaction
  private parseAmount(amount: string | number): number {
    if (typeof amount === 'string') {
      return parseInt(amount) / 1000000; // Convert from sun to USDT
    }
    return (amount as number) / 1000000;
  }

  // Format Tron address
  private formatAddress(address: string): string {
    if (!address) return '';
    // Convert hex address to base58 if needed
    return address.startsWith('T') ? address : this.hexToBase58(address);
  }

  // Convert hex to base58 (simplified)
  private hexToBase58(hex: string): string {
    // This is a simplified conversion - in production, use a proper library
    return hex; // Placeholder
  }

  // Check if address is whitelisted
  private isAddressWhitelisted(address: string): boolean {
    if (this.config.whitelistedAddresses.length === 0) {
      return true; // If no whitelist, allow all addresses
    }
    return this.config.whitelistedAddresses.includes(address.toLowerCase());
  }

  // Check rate limiting
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userRateLimit = rateLimitStore.get(userId);

    if (!userRateLimit || now - userRateLimit.lastReset > this.config.rateLimitWindow) {
      // Reset rate limit
      rateLimitStore.set(userId, { count: 1, lastReset: now });
      return true;
    }

    if (userRateLimit.count >= this.config.maxDepositsPerWindow) {
      return false; // Rate limit exceeded
    }

    // Increment count
    userRateLimit.count++;
    return true;
  }

  // Check if enough time has passed since transaction
  private checkConfirmationTime(timestamp: number): boolean {
    const now = Date.now();
    const timeSinceTransaction = now - timestamp;
    return timeSinceTransaction >= this.config.minConfirmationTime;
  }

  // Main verification function
  async verifyDeposit(
    txHash: string, 
    expectedAmount: number, 
    expectedToAddress: string, 
    userId: string
  ): Promise<VerificationResult> {
    try {
      // Step 1: Check rate limiting
      if (!this.checkRateLimit(userId)) {
        return {
          isValid: false,
          reason: `Rate limit exceeded. Maximum ${this.config.maxDepositsPerWindow} deposits per ${this.config.rateLimitWindow / (60 * 60 * 1000)} hour(s)`,
          autoApprove: false
        };
      }

      // Step 2: Verify transaction on blockchain
      const transactionData = await this.verifyTransaction(txHash, expectedAmount, expectedToAddress);
      
      if (!transactionData) {
        return {
          isValid: false,
          reason: 'Transaction not found or verification failed',
          autoApprove: false
        };
      }

      // Step 3: Verify transaction details
      if (transactionData.toAddress.toLowerCase() !== expectedToAddress.toLowerCase()) {
        return {
          isValid: false,
          reason: 'Transaction recipient address does not match expected address',
          transactionData,
          autoApprove: false
        };
      }

      if (Math.abs(transactionData.amount - expectedAmount) > 0.01) { // Allow small rounding differences
        return {
          isValid: false,
          reason: `Transaction amount (${transactionData.amount} USDT) does not match expected amount (${expectedAmount} USDT)`,
          transactionData,
          autoApprove: false
        };
      }

      // Step 4: Check address whitelist
      if (!this.isAddressWhitelisted(transactionData.fromAddress)) {
        return {
          isValid: false,
          reason: 'Sender address is not whitelisted for auto-approval',
          transactionData,
          autoApprove: false
        };
      }

      // Step 5: Check confirmation time
      if (!this.checkConfirmationTime(transactionData.timestamp)) {
        return {
          isValid: true,
          reason: 'Transaction confirmed but waiting for minimum confirmation time',
          transactionData,
          autoApprove: false
        };
      }

      // Step 6: Check amount limits for auto-approval
      const canAutoApprove = transactionData.amount <= this.config.maxAutoApprovalAmount;

      return {
        isValid: true,
        transactionData,
        autoApprove: canAutoApprove,
        reason: canAutoApprove 
          ? 'Transaction verified and eligible for auto-approval'
          : `Transaction verified but amount (${transactionData.amount} USDT) exceeds auto-approval limit (${this.config.maxAutoApprovalAmount} USDT)`
      };

    } catch (error) {
      console.error('Deposit verification error:', error);
      return {
        isValid: false,
        reason: 'Verification process failed',
        autoApprove: false
      };
    }
  }

  // Get rate limit status for a user
  getRateLimitStatus(userId: string): { remaining: number; resetTime: number } {
    const userRateLimit = rateLimitStore.get(userId);
    const now = Date.now();

    if (!userRateLimit || now - userRateLimit.lastReset > this.config.rateLimitWindow) {
      return {
        remaining: this.config.maxDepositsPerWindow,
        resetTime: now + this.config.rateLimitWindow
      };
    }

    return {
      remaining: Math.max(0, this.config.maxDepositsPerWindow - userRateLimit.count),
      resetTime: userRateLimit.lastReset + this.config.rateLimitWindow
    };
  }

  // Clear rate limit for a user (admin function)
  clearRateLimit(userId: string): void {
    rateLimitStore.delete(userId);
  }

  // Add address to whitelist
  addToWhitelist(address: string): void {
    if (!this.config.whitelistedAddresses.includes(address.toLowerCase())) {
      this.config.whitelistedAddresses.push(address.toLowerCase());
    }
  }

  // Remove address from whitelist
  removeFromWhitelist(address: string): void {
    this.config.whitelistedAddresses = this.config.whitelistedAddresses.filter(
      addr => addr !== address.toLowerCase()
    );
  }
}

// Export singleton instance
export const blockchainVerification = new BlockchainVerificationService(); 