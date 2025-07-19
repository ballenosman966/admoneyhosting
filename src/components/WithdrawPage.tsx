import React, { useState, useRef, useEffect } from 'react';
import { 
  Wallet, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink,
  QrCode,
  Image,
  X,
  Lock,
  DollarSign
} from 'lucide-react';
import { User, userStorage } from '../utils/userStorage';
import { blockchainVerification, VerificationResult } from '../utils/blockchainVerification';
import QRCode from 'react-qr-code';
import Aurora from './Aurora';
import { notificationService } from '../utils/notifications';
// Remove: import { motion } from 'framer-motion';

interface WithdrawPageProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

// Define the deposit proof type
interface DepositProof {
  id: string;
  userId: string;
  username: string;
  amount: number;
  transactionHash: string;
  screenshot: string;
  depositToAddress: string;
  status: 'pending' | 'approved';
  submittedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
}

// DepositHistory component for showing user's deposit proofs
interface DepositHistoryProps {
  userId: string;
}

const DepositHistory: React.FC<DepositHistoryProps> = ({ userId }) => {
  const [proofs, setProofs] = useState<DepositProof[]>([]);

  useEffect(() => {
    const existingProofs = localStorage.getItem('depositProofs');
    const allProofs: DepositProof[] = existingProofs ? JSON.parse(existingProofs) : [];
    setProofs(allProofs.filter(p => p.userId === userId));
  }, [userId]);

  if (proofs.length === 0) {
    return <div className="text-white/60 text-sm">No deposit history yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-white">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-2 py-2 text-left">Amount</th>
            <th className="px-2 py-2 text-left">Status</th>
            <th className="px-2 py-2 text-left">Date</th>
            <th className="px-2 py-2 text-left">Screenshot</th>
          </tr>
        </thead>
        <tbody>
          {proofs.slice().reverse().map(proof => (
            <tr key={proof.id} className="border-b border-white/10">
              <td className="px-2 py-2">{proof.amount} USDT</td>
              <td className="px-2 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  proof.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  proof.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {proof.status.charAt(0).toUpperCase() + proof.status.slice(1)}
                </span>
              </td>
              <td className="px-2 py-2">{new Date(proof.submittedAt).toLocaleString()}</td>
              <td className="px-2 py-2">
                {proof.screenshot ? (
                  <a href={proof.screenshot} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">View</a>
                ) : (
                  <span className="text-white/40">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Define the withdraw request type
interface WithdrawRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
}

// WithdrawalHistory component for showing user's past withdrawal requests
interface WithdrawalHistoryProps {
  userId: string;
}

const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({ userId }) => {
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);

  useEffect(() => {
    const existingRequests = localStorage.getItem('withdrawRequests');
    const allRequests: WithdrawRequest[] = existingRequests ? JSON.parse(existingRequests) : [];
    setRequests(allRequests.filter(r => r.userId === userId));
  }, [userId]);

  if (requests.length === 0) {
    return <div className="text-white/60 text-sm">No withdrawal history yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-white">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-2 py-2 text-left">Amount</th>
            <th className="px-2 py-2 text-left">Status</th>
            <th className="px-2 py-2 text-left">Date</th>
            <th className="px-2 py-2 text-left">Address</th>
          </tr>
        </thead>
        <tbody>
          {requests.slice().reverse().map(request => (
            <tr key={request.id} className="border-b border-white/10">
              <td className="px-2 py-2">{request.amount} USDT</td>
              <td className="px-2 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </td>
              <td className="px-2 py-2">{new Date(request.requestedAt).toLocaleString()}</td>
              <td className="px-2 py-2">
                <div className="flex items-center space-x-1">
                  <Copy className="w-3 h-3 text-white/60 cursor-pointer hover:text-white" />
                  <span className="text-white/80 responsive-text font-mono break-all">{request.walletAddress}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const WithdrawPage: React.FC<WithdrawPageProps> = ({ user, onUserUpdate }) => {
  // Get initial tab from localStorage or default to 'deposit'
  const getInitialTab = () => {
    const savedTab = localStorage.getItem('activeWithdrawTab');
    return savedTab === 'withdraw' ? 'withdraw' : 'deposit';
  };
  
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(getInitialTab);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [depositToAddress, setDepositToAddress] = useState('');
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [isSettingPasscode, setIsSettingPasscode] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [newPasscodeError, setNewPasscodeError] = useState('');
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [withdrawAmountError, setWithdrawAmountError] = useState('');
  const [depositAmountError, setDepositAmountError] = useState('');
  const WITHDRAW_NETWORK_FEE = 1; // USDT, for demonstration
  const PLATFORM_WITHDRAW_FEE = 2; // USDT

  // Handle tab change and save to localStorage
  const handleTabChange = (tab: 'deposit' | 'withdraw') => {
    setActiveTab(tab);
    localStorage.setItem('activeWithdrawTab', tab);
  };
  useEffect(() => {
    const saved = localStorage.getItem(`withdrawWhitelist_${user.id}`);
    setWhitelist(saved ? JSON.parse(saved) : []);
  }, [user.id]);

  const addToWhitelist = () => {
    const addr = withdrawAddress.trim();
    if (addr && !whitelist.includes(addr)) {
      const updated = [...whitelist, addr];
      setWhitelist(updated);
      localStorage.setItem(`withdrawWhitelist_${user.id}`, JSON.stringify(updated));
    }
  };

  const removeFromWhitelist = (addr: string) => {
    const updated = whitelist.filter(a => a !== addr);
    setWhitelist(updated);
    localStorage.setItem(`withdrawWhitelist_${user.id}`, JSON.stringify(updated));
  };

  const USDT_TRC20_ADDRESS = "TX8aLDW4Nqgfa5MNaMSJS2YGwJeZM9Y6WD";
  const MIN_DEPOSIT = 50;
  const MAX_DEPOSIT = 10000;
  const MIN_WITHDRAW = 10;
  const MAX_WITHDRAW = 5000;

  // Debug: Monitor screenshot state changes
  useEffect(() => {
    console.log('Screenshot state changed:', {
      hasScreenshot: !!screenshot,
      screenshotLength: screenshot?.length || 0
    });
  }, [screenshot]);

  // Debug: Monitor active tab changes
  useEffect(() => {
    console.log('Active tab changed:', activeTab);
  }, [activeTab]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(USDT_TRC20_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = USDT_TRC20_ADDRESS;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('Screenshot upload triggered:', file);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      console.log('File validation passed:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('FileReader result length:', result?.length);
        setScreenshot(result);
        setScreenshotFile(file);
        console.log('Screenshot state updated');
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotFile(null);
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = '';
    }
  };

  // Helper: Simulate proof validation
  const isProofValid = (proof: DepositProof) => {
    // Simulate: require transaction hash of at least 10 chars, screenshot present, and address matches
    return (
      proof.transactionHash && proof.transactionHash.length >= 10 &&
      proof.screenshot && proof.screenshot.length > 0
    );
  };

  const handleSubmitDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!depositAmount || isNaN(amount) || amount < MIN_DEPOSIT || amount > MAX_DEPOSIT) {
      setDepositAmountError(`Deposit must be between ${MIN_DEPOSIT} and ${MAX_DEPOSIT} USDT`);
      return;
    }

    if (!screenshot) {
      alert('Please upload a screenshot of your payment transaction.');
      return;
    }

    setDepositAmountError('');

    try {
      // Create deposit proof object
      const depositProof: DepositProof = {
        id: `deposit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        username: user.username,
        amount: amount,
        transactionHash: transactionHash || '',
        screenshot: screenshot,
        depositToAddress: USDT_TRC20_ADDRESS,
        status: 'pending',
        submittedAt: new Date(),
        adminNotes: ''
      };

      if (transactionHash && transactionHash.trim()) {
        const loadingMessage = 'Verifying transaction on blockchain...';
        alert(loadingMessage);
        const verificationResult: VerificationResult = await blockchainVerification.verifyDeposit(
          transactionHash.trim(),
          amount,
          USDT_TRC20_ADDRESS,
          user.id
        );

        if (verificationResult.isValid) {
          if (verificationResult.autoApprove) {
            depositProof.status = 'approved';
            depositProof.processedAt = new Date();
            depositProof.adminNotes = `Auto-approved: ${verificationResult.reason}`;
            userStorage.handleDeposit(user.id, amount);
            onUserUpdate({ ...user, balance: user.balance + amount });
            alert(`✅ Deposit automatically approved! ${amount} USDT has been added to your balance.`);
            // Notify user
            notificationService.showNotification({
              title: 'Deposit Approved',
              body: `Your deposit of ${amount} USDT was automatically approved and added to your balance.`,
              tag: 'deposit-approved',
              data: { type: 'deposit', status: 'approved', amount }
            });
          } else {
            depositProof.adminNotes = `Valid transaction but requires manual review: ${verificationResult.reason}`;
            alert(`✅ Transaction verified! Your deposit is pending manual review. Reason: ${verificationResult.reason}`);
            // Notify user
            notificationService.showNotification({
              title: 'Deposit Pending Review',
              body: `Your deposit of ${amount} USDT is pending manual review. Reason: ${verificationResult.reason}`,
              tag: 'deposit-pending',
              data: { type: 'deposit', status: 'pending', amount }
            });
          }
        } else {
          depositProof.adminNotes = `Verification failed: ${verificationResult.reason}`;
          alert(`⚠️ Transaction verification failed. Your deposit has been submitted for manual review. Reason: ${verificationResult.reason}`);
          // Notify user
          notificationService.showNotification({
            title: 'Deposit Not Approved',
            body: `Your deposit could not be automatically approved. Reason: ${verificationResult.reason}`,
            tag: 'deposit-refused',
            data: { type: 'deposit', status: 'refused', amount }
          });
        }
      } else {
        depositProof.adminNotes = 'No transaction hash provided - manual review required';
        alert(`Deposit proof submitted for ${depositAmount} USDT. Awaiting manual review.`);
        // Notify user
        notificationService.showNotification({
          title: 'Deposit Pending Review',
          body: `Your deposit of ${amount} USDT is pending manual review.`,
          tag: 'deposit-pending',
          data: { type: 'deposit', status: 'pending', amount }
        });
      }

      const existingProofs = localStorage.getItem('depositProofs');
      const allProofs = existingProofs ? JSON.parse(existingProofs) : [];
      allProofs.push(depositProof);
      localStorage.setItem('depositProofs', JSON.stringify(allProofs));

      setDepositAmount('');
      setTransactionHash('');
      setScreenshot(null);
      setScreenshotFile(null);
      if (screenshotInputRef.current) {
        screenshotInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error submitting deposit:', error);
      alert('Error submitting deposit. Please try again.');
      notificationService.showNotification({
        title: 'Deposit Error',
        body: 'There was an error submitting your deposit. Please try again.',
        tag: 'deposit-error',
        data: { type: 'deposit', status: 'error' }
      });
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amount) || amount < MIN_WITHDRAW || amount > MAX_WITHDRAW) {
      setWithdrawAmountError(`Withdrawal must be between ${MIN_WITHDRAW} and ${MAX_WITHDRAW} USDT`);
      return;
    }
    setWithdrawAmountError('');
    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }
    if (!withdrawAddress.trim()) {
      alert('Please enter a withdrawal address');
      return;
    }
    
    // Create withdraw request
    const withdrawRequest = {
      id: `withdraw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      amount: amount,
      walletAddress: withdrawAddress.trim(),
      status: 'pending' as const,
      requestedAt: new Date()
    };

    // Get existing withdraw requests from localStorage
    const existingRequests = localStorage.getItem('withdrawRequests');
    const requests = existingRequests ? JSON.parse(existingRequests) : [];
    
    // Add new request
    requests.push(withdrawRequest);
    localStorage.setItem('withdrawRequests', JSON.stringify(requests));
    
    alert(`Withdrawal request submitted for ${amount} USDT to ${withdrawAddress}. We will process it within 10-30 minutes.`);
    
    // Reset form
    setWithdrawAmount('');
    setWithdrawAddress('');
  };

  // Helper: Open passcode modal before withdrawal
  const requirePasscode = () => {
    if (!user.withdrawPasscode) {
      setIsSettingPasscode(true);
      setShowPasscodeModal(true);
    } else {
      setIsSettingPasscode(false);
      setShowPasscodeModal(true);
    }
  };

  // Intercept withdrawal button
  const handleWithdrawWithPasscode = () => {
    requirePasscode();
  };

  // Passcode creation handler
  const handleSetPasscode = () => {
    if (!/^[0-9]{4}$/.test(newPasscode)) {
      setNewPasscodeError('Passcode must be exactly 4 digits');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setNewPasscodeError('Passcodes do not match');
      return;
    }
    userStorage.setWithdrawPasscode(user.id, newPasscode);
    const updatedUser = userStorage.getCurrentUser();
    if (updatedUser) {
      onUserUpdate(updatedUser);
    }
    setShowPasscodeModal(false);
    setNewPasscode('');
    setConfirmPasscode('');
    setNewPasscodeError('');
    setTimeout(() => {
      setIsSettingPasscode(false);
      setShowPasscodeModal(true);
    }, 100); // Immediately prompt for passcode after setting
  };

  // Passcode verification handler
  const handleVerifyPasscode = () => {
    if (userStorage.checkWithdrawPasscode(user.id, passcodeInput)) {
      setShowPasscodeModal(false);
      setPasscodeInput('');
      setPasscodeError('');
      handleWithdraw(); // Proceed with withdrawal
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  const tabs = [
    { id: 'deposit', label: 'Deposit', icon: Upload },
    { id: 'withdraw', label: 'Withdraw', icon: Download }
  ];

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Aurora Animated Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
            </div>
      <div className="relative responsive-container w-full max-w-full px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div
          className="mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            Wallet
          </h1>
          <p className="text-white/80 text-base sm:text-lg">
            Deposit and withdraw your USDT
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          className="glass-card border border-white/10 rounded-2xl p-2 mb-8 backdrop-blur-lg"
        >
          <div className="flex space-x-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id as 'deposit' | 'withdraw')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-500 ease-in-out font-medium transform ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-102'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === id ? 'scale-110' : ''}`} />
                <span className="transition-all duration-300">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Balance Card */}
        <div
          className="glass-card border border-yellow-400/30 shadow-2xl rounded-3xl p-6 mb-8 backdrop-blur-xl"
        >
                <div className="text-center">
            <p className="text-white/70 text-sm mb-1">Available Balance</p>
            <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-xl">
              ${user.balance.toFixed(2)}
            </span>
            <p className="text-white/60 text-sm mt-1">USDT</p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          {activeTab === 'withdraw' && (
            <div className="animate-fadeInSlideUp">
              {/* Withdrawal Form */}
              <div
                className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg"
              >
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
                  Withdrawal Details
                </h2>
                
                <div className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Amount (USDT)</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => {
                        setWithdrawAmount(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (isNaN(val) || val < MIN_WITHDRAW) {
                          setWithdrawAmountError(`Minimum withdrawal is ${MIN_WITHDRAW} USDT`);
                        } else if (val > MAX_WITHDRAW) {
                          setWithdrawAmountError(`Maximum withdrawal is ${MAX_WITHDRAW} USDT`);
                        } else {
                          setWithdrawAmountError('');
                        }
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter amount to withdraw"
                      min={MIN_WITHDRAW}
                      max={MAX_WITHDRAW}
                      step="0.01"
                    />
                    
                    {/* Quick Amount Buttons */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button 
                        onClick={() => setWithdrawAmount('50')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        50 USDT
                      </button>
                      <button 
                        onClick={() => setWithdrawAmount('100')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        100 USDT
                      </button>
                      <button 
                        onClick={() => setWithdrawAmount('500')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        500 USDT
                      </button>
                      <button 
                        onClick={() => setWithdrawAmount('1000')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        1000 USDT
                      </button>
                    </div>
                    
                    <p className="text-white/60 text-sm mt-1">Minimum: {MIN_WITHDRAW} USDT &nbsp; | &nbsp; Maximum: {MAX_WITHDRAW} USDT</p>
                    {withdrawAmountError && <p className="text-red-400 text-xs mt-1">{withdrawAmountError}</p>}
                    {withdrawAmount && !withdrawAmountError && (
                      <p className="text-yellow-400 text-xs mt-1">
                        Estimated Network Fee: {WITHDRAW_NETWORK_FEE} USDT<br />
                        Net Amount Received: {Math.max(0, parseFloat(withdrawAmount) - WITHDRAW_NETWORK_FEE).toFixed(2)} USDT
                      </p>
                    )}
                    {withdrawAmount && !withdrawAmountError && (
                      <p className="text-blue-400 text-xs mt-1">
                        Estimated Arrival: 10-30 minutes
                      </p>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Withdrawal Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={withdrawAddress}
                        onChange={e => setWithdrawAddress(e.target.value)}
                        placeholder="Enter your USDT wallet address"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                      />
                      <button
                        onClick={addToWhitelist}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                        disabled={!withdrawAddress.trim() || whitelist.includes(withdrawAddress.trim())}
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                  </div>
                  {whitelist.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-white/60 text-xs">Saved Addresses:</span>
                      {whitelist.map(addr => (
                        <span key={addr} className="inline-flex items-center bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white font-mono">
                          <span className="mr-1 cursor-pointer hover:underline" onClick={() => setWithdrawAddress(addr)}>{addr}</span>
                          <button onClick={() => removeFromWhitelist(addr)} className="ml-1 text-red-400 hover:text-red-600">&times;</button>
                        </span>
                      ))}
                    </div>
                  )}
                  </div>

                  {/* Withdrawal Fee Calculator */}
                  <div className="glass-card border border-blue-400/20 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
                    <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-blue-300" />
                      Withdrawal Fee Calculator
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/80">TRC20 Network Fee:</span>
                        <span className="text-blue-400 font-semibold">~{WITHDRAW_NETWORK_FEE} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Platform Fee:</span>
                        <span className="text-blue-300 font-semibold">{PLATFORM_WITHDRAW_FEE} USDT</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 flex justify-between">
                        <span className="text-white font-semibold">Total Fee:</span>
                        <span className="text-white font-semibold">~{WITHDRAW_NETWORK_FEE + PLATFORM_WITHDRAW_FEE} USDT</span>
                      </div>
                      {withdrawAmount && !withdrawAmountError && (
                        <div className="border-t border-white/20 pt-2 flex justify-between">
                          <span className="text-white/80">Net Amount Received:</span>
                          <span className="text-green-400 font-semibold">
                            {Math.max(0, parseFloat(withdrawAmount) - WITHDRAW_NETWORK_FEE - PLATFORM_WITHDRAW_FEE).toFixed(2)} USDT
                          </span>
                        </div>
                      )}
                      <p className="text-white/60 text-xs mt-2">
                        * Network fees may vary based on blockchain congestion
                      </p>
                    </div>
                  </div>

                  {/* How to Withdraw USDT */}
                  <div className="glass-card border border-purple-400/20 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg mt-6">
                    <h3 className="text-purple-300 font-semibold mb-2 flex items-center">
                      <ExternalLink className="w-5 h-5 mr-2 text-purple-300" />
                      How to Withdraw USDT
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Enter Withdrawal Amount</p>
                          <p className="text-white/60">Choose how much USDT you want to withdraw (10-5,000 USDT)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Provide Wallet Address</p>
                          <p className="text-white/60">Enter your USDT (TRC20) wallet address for receiving funds</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Confirm Withdrawal</p>
                          <p className="text-white/60">Review details and confirm your withdrawal request</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          4
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Wait for Processing</p>
                          <p className="text-white/60">Your withdrawal will be processed within 10-30 minutes</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <p className="text-white/70 text-xs">
                        <strong>💡 Tip:</strong> Make sure your wallet address is correct before confirming. 
                        Withdrawals are irreversible once processed.
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  {withdrawAddress && (
                    <div
                      className="flex justify-center"
                    >
                      <div className="bg-white p-4 rounded-lg">
                        <QRCode value={withdrawAddress} size={128} />
                      </div>
                    </div>
                  )}

                  {/* Withdrawal Limits Information */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-blue-400 font-semibold mb-2 flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Withdrawal Limits & Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/80">Minimum Withdrawal:</span>
                        <span className="text-blue-400 font-semibold">{MIN_WITHDRAW} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Maximum Per Transaction:</span>
                        <span className="text-blue-400 font-semibold">{MAX_WITHDRAW} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Daily Limit:</span>
                        <span className="text-blue-400 font-semibold">10,000 USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Monthly Limit:</span>
                        <span className="text-blue-400 font-semibold">100,000 USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Processing Time:</span>
                        <span className="text-green-400 font-semibold">10-30 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Network:</span>
                        <span className="text-orange-400 font-semibold">TRC20 Only</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Reminders */}
                  <div className="glass-card border border-blue-400/20 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
                    <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-blue-300" />
                      Security Reminders
                    </h3>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Double-check your wallet address before confirming</li>
                      <li>• Use only TRC20 USDT wallet addresses</li>
                      <li>• Withdrawals are irreversible once processed</li>
                      <li>• Keep your withdrawal passcode secure</li>
                      <li>• Never share your wallet private keys</li>
                    </ul>
                  </div>

                  {/* Withdraw Button */}
                  <button
                    onClick={handleWithdrawWithPasscode}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-lg shadow-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Withdraw USDT
                  </button>
                </div>
              </div>

              {/* Withdrawal History */}
              <div
                className="glass-card border border-white/10 rounded-3xl p-8 backdrop-blur-lg"
              >
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                  Withdrawal History
                </h2>
                <WithdrawalHistory userId={user.id} />
              </div>
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="animate-fadeInSlideUp">
              {/* Deposit Section */}
              <div
                className="glass-card border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg"
              >
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  Deposit USDT
                </h2>
                
                <div className="space-y-6">
                  {/* Deposit Amount Input */}
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Deposit Amount (USDT)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => {
                        setDepositAmount(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (isNaN(val) || val < MIN_DEPOSIT) {
                          setDepositAmountError(`Minimum deposit is ${MIN_DEPOSIT} USDT`);
                        } else if (val > MAX_DEPOSIT) {
                          setDepositAmountError(`Maximum deposit is ${MAX_DEPOSIT} USDT`);
                        } else {
                          setDepositAmountError('');
                        }
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter amount you deposited"
                      min={MIN_DEPOSIT}
                      max={MAX_DEPOSIT}
                      step="0.01"
                    />
                    
                    {/* Quick Amount Buttons */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button 
                        onClick={() => setDepositAmount('100')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        100 USDT
                      </button>
                      <button 
                        onClick={() => setDepositAmount('500')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        500 USDT
                      </button>
                      <button 
                        onClick={() => setDepositAmount('1000')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        1000 USDT
                      </button>
                      <button 
                        onClick={() => setDepositAmount('2000')}
                        className="px-3 py-1 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
                      >
                        2000 USDT
                      </button>
                    </div>
                    
                    <p className="text-white/60 text-sm mt-1">Minimum: {MIN_DEPOSIT} USDT &nbsp; | &nbsp; Maximum: {MAX_DEPOSIT} USDT</p>
                    {depositAmountError && <p className="text-red-400 text-xs mt-1">{depositAmountError}</p>}
                    {depositAmount && !depositAmountError && (
                      <p className="text-green-400 text-xs mt-1">
                        ✓ Amount is within valid range
                      </p>
                    )}
                  </div>

                  {/* Network Fee Calculator */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-blue-400 font-semibold mb-2 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Network Fee Calculator
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/80">TRC20 Network Fee:</span>
                        <span className="text-blue-400 font-semibold">~2 USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Platform Fee:</span>
                        <span className="text-green-400 font-semibold">0 USDT</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 flex justify-between">
                        <span className="text-white font-semibold">Total Fee:</span>
                        <span className="text-white font-semibold">~2 USDT</span>
                      </div>
                      <p className="text-white/60 text-xs mt-2">
                        * Network fees may vary based on blockchain congestion
                      </p>
                    </div>
                  </div>

                  {/* Rate Limit Status */}
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h3 className="text-purple-400 font-semibold mb-2 flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Deposit Limits
                    </h3>
                    <div className="space-y-2 text-sm">
                      {(() => {
                        const rateLimitStatus = blockchainVerification.getRateLimitStatus(user.id);
                        const resetTime = new Date(rateLimitStatus.resetTime);
                        return (
                          <div>
                            <div className="flex justify-between">
                              <span className="text-white/80">Remaining Deposits:</span>
                              <span className={`font-semibold ${rateLimitStatus.remaining > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {rateLimitStatus.remaining} / 3
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/80">Limit Resets:</span>
                              <span className="text-purple-400 font-semibold">
                                {resetTime.toLocaleTimeString()}
                              </span>
                            </div>
                            {rateLimitStatus.remaining === 0 && (
                              <p className="text-red-400 text-xs mt-2">
                                ⚠️ Rate limit reached. Please wait until the limit resets.
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Transaction Hash Input */}
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Transaction Hash (Optional)</label>
                    <input
                      type="text"
                      value={transactionHash}
                      onChange={(e) => setTransactionHash(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all"
                      placeholder="Enter your transaction hash (optional)"
                    />
                    <p className="text-white/60 text-sm mt-1">Provide transaction hash for faster verification</p>
                  </div>

                  {/* Deposit Address */}
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Our Deposit Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={USDT_TRC20_ADDRESS}
                        readOnly
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none"
                      />
                      <button
                        onClick={handleCopyAddress}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                  {/* Deposit QR Code */}
                  <div className="flex flex-col items-center space-y-4">
                    <label className="block text-white/90 font-medium text-center">Scan QR Code to Get Deposit Address</label>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-white/20">
                      <QRCode 
                        value={USDT_TRC20_ADDRESS} 
                        size={160} 
                        level="M"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    </div>
                    <p className="text-white/60 text-sm text-center max-w-xs">
                      Scan this QR code with your wallet app to get the deposit address
                    </p>
                  </div>

                  {/* Upload Proof */}
                  <div className="flex flex-col items-center">
                    <label className="block text-white/90 font-medium mb-2 text-center">Upload Payment Proof</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center w-full max-w-md">
                      <input
                        type="file"
                        ref={screenshotInputRef}
                        onChange={handleScreenshotUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {!screenshot ? (
                        <button
                          onClick={() => screenshotInputRef.current?.click()}
                          className="flex flex-col items-center space-y-2 text-white/70 hover:text-white transition-colors w-full"
                        >
                          <Upload className="w-8 h-8" />
                          <span>Click to upload screenshot</span>
                          <p className="text-white/50 text-xs">PNG, JPG, JPEG up to 5MB</p>
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="relative inline-block">
                            <img 
                              src={screenshot} 
                              alt="Payment proof" 
                              className="max-w-full h-32 object-contain rounded-lg border border-white/20"
                            />
                            <button
                              onClick={handleRemoveScreenshot}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => screenshotInputRef.current?.click()}
                            className="text-green-400 hover:text-green-300 text-sm underline"
                          >
                            Change screenshot
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-white/60 text-sm text-center max-w-xs mt-2">
                      Upload a screenshot of your payment transaction for verification
                    </p>
                  </div>

                  {/* Important Information */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h3 className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Important Information
                    </h3>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Send only USDT (TRC20) to the address above</li>
                      <li>• Minimum deposit: {MIN_DEPOSIT} USDT</li>
                      <li>• Maximum deposit: {MAX_DEPOSIT} USDT</li>
                      <li>• Processing time: 10-30 minutes after confirmation</li>
                      <li>• Always double-check the address before sending</li>
                    </ul>
                  </div>

                  {/* How to Deposit Instructions */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h3 className="text-green-400 font-semibold mb-2 flex items-center">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      How to Deposit USDT
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Copy or Scan Address</p>
                          <p className="text-white/60">Copy the deposit address above or scan the QR code with your wallet</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Send USDT from Your Wallet</p>
                          <p className="text-white/60">Open your wallet app and send USDT (TRC20) to the copied address</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Wait for Confirmation</p>
                          <p className="text-white/60">Wait for the transaction to be confirmed on the blockchain (usually 1-3 minutes)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-400 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          4
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">Submit Proof</p>
                          <p className="text-white/60">Enter the amount, upload screenshot, and submit for verification</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-white/70 text-xs">
                        <strong>💡 Tip:</strong> Take a screenshot of your wallet transaction for faster verification. 
                        Make sure the screenshot shows the transaction hash, amount, and recipient address.
                      </p>
                    </div>
                  </div>

                  {/* Submit Deposit */}
                  <button
                    onClick={handleSubmitDeposit}
                    disabled={!screenshot || !depositAmount}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg shadow-lg hover:from-green-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Deposit Proof
                  </button>
                </div>
              </div>

              {/* Deposit History */}
              <div
                className="glass-card border border-white/10 rounded-3xl p-8 backdrop-blur-lg"
              >
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                  Deposit History
                </h2>
                <DepositHistory userId={user.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};