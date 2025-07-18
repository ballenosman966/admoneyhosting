import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Eye, 
  Check, 
  X, 
  Clock, 
  User, 
  DollarSign, 
  FileText,
  Search,
  Filter,
  Download,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  CreditCard as IdCard,
  Camera
} from 'lucide-react';
import { SubscriptionManager } from './SubscriptionManager';
import { userStorage } from '../utils/userStorage';

interface DepositProof {
  id: string;
  userId: string;
  username: string;
  amount: number;
  transactionHash: string;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
}

interface WithdrawRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
  transactionHash?: string;
}

interface KYCVerification {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  documentType: 'passport' | 'national_id' | 'drivers_license';
  documentNumber: string;
  documentFront: string;
  documentBack: string;
  selfieWithDocument: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
  rejectionReason?: string;
}

interface AdminPanelProps {
  isAdmin: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin }) => {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'subscriptions' | 'deposit-overview' | 'kyc'>('deposits');
  const [depositProofs, setDepositProofs] = useState<DepositProof[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [kycVerifications, setKycVerifications] = useState<KYCVerification[]>([]);
  const [selectedProof, setSelectedProof] = useState<DepositProof | null>(null);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawRequest | null>(null);
  const [selectedKyc, setSelectedKyc] = useState<KYCVerification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [withdrawTransactionHash, setWithdrawTransactionHash] = useState('');
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);

  // Load deposit proofs from localStorage on component mount
  useEffect(() => {
    const savedProofs = localStorage.getItem('depositProofs');
    if (savedProofs) {
      const proofs = JSON.parse(savedProofs).map((proof: any) => ({
        ...proof,
        submittedAt: new Date(proof.submittedAt),
        processedAt: proof.processedAt ? new Date(proof.processedAt) : undefined
      }));
      setDepositProofs(proofs);
    }

    const savedWithdrawals = localStorage.getItem('withdrawRequests');
    if (savedWithdrawals) {
      const withdrawals = JSON.parse(savedWithdrawals).map((withdraw: any) => ({
        ...withdraw,
        requestedAt: new Date(withdraw.requestedAt),
        processedAt: withdraw.processedAt ? new Date(withdraw.processedAt) : undefined
      }));
      setWithdrawRequests(withdrawals);
    }

    const savedKyc = localStorage.getItem('kycVerifications');
    if (savedKyc) {
      const kyc = JSON.parse(savedKyc).map((verification: any) => ({
        ...verification,
        submittedAt: new Date(verification.submittedAt),
        processedAt: verification.processedAt ? new Date(verification.processedAt) : undefined
      }));
      setKycVerifications(kyc);
    }
  }, []);

  // Save deposit proofs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('depositProofs', JSON.stringify(depositProofs));
  }, [depositProofs]);

  // Save withdraw requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('withdrawRequests', JSON.stringify(withdrawRequests));
  }, [withdrawRequests]);

  // Save KYC verifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kycVerifications', JSON.stringify(kycVerifications));
  }, [kycVerifications]);

  // Add sample KYC data if none exists
  useEffect(() => {
    if (kycVerifications.length === 0) {
      const sampleKycData: KYCVerification[] = [
        {
          id: 'kyc-1',
          userId: 'user123',
          username: 'john_doe',
          fullName: 'John Doe',
          dateOfBirth: '1990-05-15',
          nationality: 'United States',
          documentType: 'passport',
          documentNumber: 'US123456789',
          documentFront: 'https://via.placeholder.com/400x250/1f2937/ffffff?text=Passport+Front',
          documentBack: 'https://via.placeholder.com/400x250/1f2937/ffffff?text=Passport+Back',
          selfieWithDocument: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Selfie+with+Document',
          status: 'pending',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          id: 'kyc-2',
          userId: 'user456',
          username: 'jane_smith',
          fullName: 'Jane Smith',
          dateOfBirth: '1985-12-20',
          nationality: 'Canada',
          documentType: 'national_id',
          documentNumber: 'CA987654321',
          documentFront: 'https://via.placeholder.com/400x250/1f2937/ffffff?text=ID+Front',
          documentBack: 'https://via.placeholder.com/400x250/1f2937/ffffff?text=ID+Back',
          selfieWithDocument: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Selfie+with+ID',
          status: 'approved',
          submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          adminNotes: 'All documents verified successfully. Identity confirmed.',
        },
        {
          id: 'kyc-3',
          userId: 'user789',
          username: 'mike_wilson',
          fullName: 'Mike Wilson',
          dateOfBirth: '1992-08-10',
          nationality: 'United Kingdom',
          documentType: 'drivers_license',
          documentNumber: 'UK456789123',
          documentFront: 'https://via.placeholder.com/400x250/1f2937/ffffff?text=License+Front',
          documentBack: 'https://via.placeholder.com/400x250/1f2937/ffffff?text=License+Back',
          selfieWithDocument: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Selfie+with+License',
          status: 'rejected',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          processedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          adminNotes: 'Document verification failed',
          rejectionReason: 'Document image quality is too low. Please resubmit with clearer photos.',
        }
      ];
      setKycVerifications(sampleKycData);
    }
  }, [kycVerifications.length]);

  const filteredProofs = depositProofs.filter(proof => {
    const matchesSearch = 
      proof.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.transactionHash.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proof.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredWithdrawals = withdrawRequests.filter(withdraw => {
    const matchesSearch = 
      withdraw.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdraw.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdraw.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || withdraw.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredKyc = kycVerifications.filter(kyc => {
    const matchesSearch = 
      kyc.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || kyc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (proofId: string) => {
    setDepositProofs(prev => prev.map(proof => 
      proof.id === proofId 
        ? { 
            ...proof, 
            status: 'approved' as const, 
            processedAt: new Date(),
            adminNotes: adminNotes || 'Approved by admin'
          }
        : proof
    ));
    setSelectedProof(null);
    setAdminNotes('');
  };

  const handleReject = (proofId: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setDepositProofs(prev => prev.map(proof => 
      proof.id === proofId 
        ? { 
            ...proof, 
            status: 'rejected' as const, 
            processedAt: new Date(),
            adminNotes
          }
        : proof
    ));
    setSelectedProof(null);
    setAdminNotes('');
  };

  const handleWithdrawApprove = (withdrawId: string) => {
    const withdraw = withdrawRequests.find(w => w.id === withdrawId);
    if (!withdraw) return;

    setWithdrawRequests(prev => prev.map(w => 
      w.id === withdrawId 
        ? { 
            ...w, 
            status: 'approved' as const, 
            processedAt: new Date(),
            adminNotes: adminNotes || 'Approved by admin'
          }
        : w
    ));

    // Send notification to user
    userStorage.addWithdrawalApprovalNotification(withdraw.userId, withdraw.amount);

    setSelectedWithdraw(null);
    setAdminNotes('');
  };

  const handleWithdrawReject = (withdrawId: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    const withdraw = withdrawRequests.find(w => w.id === withdrawId);
    if (!withdraw) return;
    
    setWithdrawRequests(prev => prev.map(w => 
      w.id === withdrawId 
        ? { 
            ...w, 
            status: 'rejected' as const, 
            processedAt: new Date(),
            adminNotes
          }
        : w
    ));

    // Send notification to user
    userStorage.addWithdrawalRejectionNotification(withdraw.userId, withdraw.amount, adminNotes);

    setSelectedWithdraw(null);
    setAdminNotes('');
  };

  const handleWithdrawComplete = (withdrawId: string) => {
    if (!withdrawTransactionHash.trim()) {
      alert('Please provide the transaction hash');
      return;
    }
    
    const withdraw = withdrawRequests.find(w => w.id === withdrawId);
    if (!withdraw) return;
    
    setWithdrawRequests(prev => prev.map(w => 
      w.id === withdrawId 
        ? { 
            ...w, 
            status: 'completed' as const, 
            processedAt: new Date(),
            transactionHash: withdrawTransactionHash,
            adminNotes: adminNotes || 'Completed by admin'
          }
        : w
    ));

    // Send notification to user with transaction hash
    userStorage.addWithdrawalApprovalNotification(withdraw.userId, withdraw.amount, withdrawTransactionHash);

    setSelectedWithdraw(null);
    setWithdrawTransactionHash('');
    setAdminNotes('');
  };

  const handleKycApprove = (kycId: string) => {
    setKycVerifications(prev => prev.map(kyc => 
      kyc.id === kycId 
        ? { 
            ...kyc, 
            status: 'approved' as const, 
            processedAt: new Date(),
            adminNotes: adminNotes || 'KYC approved by admin'
          }
        : kyc
    ));
    setSelectedKyc(null);
    setAdminNotes('');
  };

  const handleKycReject = (kycId: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setKycVerifications(prev => prev.map(kyc => 
      kyc.id === kycId 
        ? { 
            ...kyc, 
            status: 'rejected' as const, 
            processedAt: new Date(),
            adminNotes,
            rejectionReason: adminNotes
          }
        : kyc
    ));
    setSelectedKyc(null);
    setAdminNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'approved': return <Check className="w-3 h-3" />;
      case 'rejected': return <X className="w-3 h-3" />;
      case 'completed': return <ArrowUpRight className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  // Fetch all users and deposit proofs
  const users = userStorage.getAllUsers();
  const proofs = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('depositProofs') || '[]');
    } catch {
      return [];
    }
  }, []);

  // Map userId to their latest approved deposit
  const userDeposits = useMemo(() => {
    const map: Record<string, any> = {};
    proofs
      .filter((p: any) => p.status === 'approved')
      .forEach((p: any) => {
        if (!map[p.userId] || new Date(p.submittedAt) > new Date(map[p.userId].submittedAt)) {
          map[p.userId] = p;
        }
      });
    return map;
  }, [proofs]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/60">Manage deposits, withdrawals, and user requests</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'deposits'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="w-4 h-4" />
            <span>Deposits</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'withdrawals'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
            <span>Withdrawals</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'subscriptions'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CreditCard className="w-4 h-4" />
            <span>Subscriptions</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('deposit-overview')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'deposit-overview'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <User className="w-4 h-4" />
            <span>Deposit Overview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'kyc'
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <IdCard className="w-4 h-4" />
            <span>KYC Reviews</span>
            </div>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  type="text"
              placeholder="Search by user ID, username, or transaction hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
              </select>
              {activeTab === 'subscriptions' && (
                <button
                  onClick={() => setShowSubscriptionManager(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Manage Subscriptions</span>
                </button>
              )}
        </div>

        {/* Content */}
        {activeTab === 'subscriptions' ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Subscription Management</h3>
              <p className="text-white/60 mb-6">
                Track user subscriptions, manage subscription status, and view subscription analytics.
              </p>
              <button
                onClick={() => setShowSubscriptionManager(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <CreditCard className="w-5 h-5" />
                <span>Open Subscription Manager</span>
              </button>
            </div>
          </div>
        ) : activeTab === 'kyc' ? (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-medium">User</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Full Name</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Document Type</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Document Number</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredKyc.map((kyc) => (
                    <tr key={kyc.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">#{kyc.userId}</p>
                          <p className="text-white/60 text-sm">{kyc.username}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white">{kyc.fullName}</p>
                        <p className="text-white/60 text-sm">{kyc.dateOfBirth} • {kyc.nationality}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white/80 text-sm capitalize">
                          {kyc.documentType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white/80 text-sm font-mono">
                          {kyc.documentNumber}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kyc.status)}`}>
                          {getStatusIcon(kyc.status)}
                          <span className="capitalize">{kyc.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white/60 text-sm">
                          {kyc.submittedAt.toLocaleDateString()}
                        </p>
                        <p className="text-white/40 text-xs">
                          {kyc.submittedAt.toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedKyc(kyc)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {filteredKyc.length === 0 && (
              <div className="text-center py-12">
                <IdCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No KYC verifications found</p>
              </div>
            )}
          </div>
        ) : activeTab === 'deposit-overview' ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-4">Deposit Overview</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-white font-medium">User</th>
                  <th className="px-4 py-2 text-left text-white font-medium">Email</th>
                  <th className="px-4 py-2 text-left text-white font-medium">Has Deposit?</th>
                  <th className="px-4 py-2 text-left text-white font-medium">Last Amount</th>
                  <th className="px-4 py-2 text-left text-white font-medium">Last Date</th>
                  <th className="px-4 py-2 text-left text-white font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const dep = userDeposits[u.id];
                  return (
                    <tr key={u.id} className="hover:bg-white/10">
                      <td className="px-4 py-2 text-white">{u.username}</td>
                      <td className="px-4 py-2 text-white/80">{u.email}</td>
                      <td className="px-4 py-2">{dep ? '✅' : '❌'}</td>
                      <td className="px-4 py-2">{dep ? dep.amount + ' USDT' : '-'}</td>
                      <td className="px-4 py-2">{dep ? new Date(dep.submittedAt).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2">{dep ? dep.status : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-medium">User</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Amount</th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      {activeTab === 'deposits' ? 'Transaction Hash' : 'Wallet Address'}
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {activeTab === 'deposits' ? (
                    filteredProofs.map((proof) => (
                      <tr key={proof.id} className="hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white font-medium">#{proof.userId}</p>
                            <p className="text-white/60 text-sm">{proof.username}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-yellow-400" />
                            <span className="text-white font-medium">{proof.amount} USDT</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            <p className="text-white/80 text-sm font-mono truncate">
                              {proof.transactionHash || 'Not provided'}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proof.status)}`}>
                            {getStatusIcon(proof.status)}
                            <span className="capitalize">{proof.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white/60 text-sm">
                            {proof.submittedAt.toLocaleDateString()}
                          </p>
                          <p className="text-white/40 text-xs">
                            {proof.submittedAt.toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedProof(proof)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredWithdrawals.map((withdraw) => (
                      <tr key={withdraw.id} className="hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white font-medium">#{withdraw.userId}</p>
                            <p className="text-white/60 text-sm">{withdraw.username}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-yellow-400" />
                            <span className="text-white font-medium">{withdraw.amount} USDT</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            <p className="text-white/80 text-sm font-mono truncate">
                              {withdraw.walletAddress}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdraw.status)}`}>
                            {getStatusIcon(withdraw.status)}
                            <span className="capitalize">{withdraw.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white/60 text-sm">
                            {withdraw.requestedAt.toLocaleDateString()}
                          </p>
                          <p className="text-white/40 text-xs">
                            {withdraw.requestedAt.toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedWithdraw(withdraw)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {((activeTab === 'deposits' && filteredProofs.length === 0) || 
              (activeTab === 'withdrawals' && filteredWithdrawals.length === 0)) && (
              <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No {activeTab} found</p>
                </div>
            )}
          </div>
        )}

        {/* Subscription Manager Modal */}
        {showSubscriptionManager && (
          <SubscriptionManager
            onClose={() => setShowSubscriptionManager(false)}
          />
        )}

        {/* Deposit Proof Detail Modal */}
        {selectedProof && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Deposit Proof Details</h2>
                  <button
                    onClick={() => setSelectedProof(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* User Info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">User Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">User ID</p>
                        <p className="text-white font-mono">#{selectedProof.userId}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Username</p>
                        <p className="text-white">{selectedProof.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Transaction Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-white/60">Amount</p>
                        <p className="text-white font-medium">{selectedProof.amount} USDT</p>
                      </div>
                      <div>
                        <p className="text-white/60">Transaction Hash</p>
                        <p className="text-white font-mono break-all">
                          {selectedProof.transactionHash || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">Submitted</p>
                        <p className="text-white">
                          {selectedProof.submittedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Screenshot */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Screenshot Proof</h3>
                    <img
                      src={selectedProof.screenshot}
                      alt="Transaction proof"
                      className="w-full rounded-lg border border-white/20"
                    />
                  </div>

                  {/* Admin Notes */}
                  {selectedProof.status !== 'pending' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Admin Notes</h3>
                      <p className="text-white text-sm">{selectedProof.adminNotes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedProof.status === 'pending' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Admin Notes</h3>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes for approval/rejection..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 text-sm"
                        rows={3}
                      />
                      
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => handleApprove(selectedProof.id)}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(selectedProof.id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Request Detail Modal */}
        {selectedWithdraw && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Withdraw Request Details</h2>
                  <button
                    onClick={() => setSelectedWithdraw(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* User Info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">User Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">User ID</p>
                        <p className="text-white font-mono">#{selectedWithdraw.userId}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Username</p>
                        <p className="text-white">{selectedWithdraw.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Request Info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Request Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-white/60">Amount</p>
                        <p className="text-white font-medium">{selectedWithdraw.amount} USDT</p>
                      </div>
                      <div>
                        <p className="text-white/60">Wallet Address</p>
                        <p className="text-white font-mono break-all">{selectedWithdraw.walletAddress}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Requested</p>
                        <p className="text-white">
                          {selectedWithdraw.requestedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Status and Actions</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-white/60">Current Status</p>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWithdraw.status)}`}>
                          {getStatusIcon(selectedWithdraw.status)}
                          <span className="capitalize">{selectedWithdraw.status}</span>
                        </span>
                      </div>
                      {selectedWithdraw.status === 'pending' && (
                        <div>
                          <p className="text-white/60">Admin Notes</p>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes for approval/rejection..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 text-sm"
                            rows={3}
                          />
                          <div className="flex space-x-3 mt-4">
                            <button
                              onClick={() => handleWithdrawApprove(selectedWithdraw.id)}
                              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleWithdrawReject(selectedWithdraw.id)}
                              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      )}
                      {selectedWithdraw.status === 'approved' && (
                        <div>
                          <p className="text-white/60">Transaction Hash</p>
                          <input
                            type="text"
                            value={withdrawTransactionHash}
                            onChange={(e) => setWithdrawTransactionHash(e.target.value)}
                            placeholder="Enter transaction hash"
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 text-sm"
                          />
                          <div className="flex space-x-3 mt-4">
                            <button
                              onClick={() => handleWithdrawComplete(selectedWithdraw.id)}
                              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                              <span>Mark as Completed</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedWithdraw.status !== 'pending' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Admin Notes</h3>
                      <p className="text-white text-sm">{selectedWithdraw.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KYC Verification Detail Modal */}
        {selectedKyc && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">KYC Verification Details</h2>
                  <button
                    onClick={() => setSelectedKyc(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* User Info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">User Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">User ID</p>
                        <p className="text-white font-mono">#{selectedKyc.userId}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Username</p>
                        <p className="text-white">{selectedKyc.username}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Full Name</p>
                        <p className="text-white">{selectedKyc.fullName}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Date of Birth</p>
                        <p className="text-white">{selectedKyc.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Nationality</p>
                        <p className="text-white">{selectedKyc.nationality}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Document Type</p>
                        <p className="text-white capitalize">{selectedKyc.documentType.replace('_', ' ')}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-white/60">Document Number</p>
                        <p className="text-white font-mono">{selectedKyc.documentNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Document Images */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Document Front</h3>
                      <img
                        src={selectedKyc.documentFront}
                        alt="Document front"
                        className="w-full rounded-lg border border-white/20"
                      />
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Document Back</h3>
                      <img
                        src={selectedKyc.documentBack}
                        alt="Document back"
                        className="w-full rounded-lg border border-white/20"
                      />
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Selfie with Document</h3>
                      <img
                        src={selectedKyc.selfieWithDocument}
                        alt="Selfie with document"
                        className="w-full rounded-lg border border-white/20"
                      />
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Submission Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-white/60">Submitted</p>
                        <p className="text-white">
                          {selectedKyc.submittedAt.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">Current Status</p>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedKyc.status)}`}>
                          {getStatusIcon(selectedKyc.status)}
                          <span className="capitalize">{selectedKyc.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedKyc.status !== 'pending' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Admin Notes</h3>
                      <p className="text-white text-sm">{selectedKyc.adminNotes}</p>
                      {selectedKyc.rejectionReason && (
                        <div className="mt-2">
                          <p className="text-white/60 text-sm">Rejection Reason:</p>
                          <p className="text-red-400 text-sm">{selectedKyc.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedKyc.status === 'pending' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Admin Notes</h3>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes for approval/rejection..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 text-sm"
                        rows={3}
                      />
                      
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => handleKycApprove(selectedKyc.id)}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve KYC</span>
                        </button>
                        <button
                          onClick={() => handleKycReject(selectedKyc.id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject KYC</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 