import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  ArrowLeft,
  Crown,
  BarChart3,
  Activity,
  Shield,
  UserCheck,
  Wallet,
  CreditCard,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Star,
  Gift,
  Zap,
  Target,
  Award,
  TrendingDown,
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  PlusCircle,
  X,
  Play,
  Video,
  Link,
  FileVideo,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { userStorage, User, ReferralRecord, SubscriptionRecord } from '../utils/userStorage';
import Aurora from './Aurora';

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

interface AdminDashboardProps {
  onLogout: () => void;
  onBack: () => void;
}

interface AdminAd {
  id: string;
  title: string;
  description: string;
  youtubeId?: string;
  videoFile?: string; // Base64 or file URL
  duration: number; // in seconds
  reward: number; // USDT reward
  category: 'gaming' | 'tech' | 'lifestyle' | 'finance' | 'education';
  thumbnail: string;
  requiredWatchTime: number; // minimum seconds to watch
  isActive: boolean;
  createdAt: string;
  publishedAt?: string;
  views: number;
  totalEarnings: number; // total USDT paid out
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'deposits' | 'withdrawals' | 'subscriptions' | 'referrals' | 'ads' | 'kyc'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDepositOverview, setShowDepositOverview] = useState(false);
  const [kycVerifications, setKycVerifications] = useState<KYCVerification[]>([]);
  const [selectedKyc, setSelectedKyc] = useState<KYCVerification | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Ad management states
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [editingAd, setEditingAd] = useState<AdminAd | null>(null);
  const [newAd, setNewAd] = useState<Partial<AdminAd> & { youtubeUrl?: string }>({
    title: '',
    description: '',
    youtubeUrl: '',
    youtubeId: '',
    duration: 30,
    reward: 0.05,
    category: 'gaming',
    requiredWatchTime: 25,
    isActive: true
  });

  // Remove the top sticky nav and replace with a left sidebar
  // Add sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFolded, setSidebarFolded] = useState(false);

  // Load users and ads on component mount
  useEffect(() => {
    loadUsers();
    loadAds();
    loadKycData();
  }, []);

  // Reload KYC data when KYC tab is clicked
  useEffect(() => {
    if (activeTab === 'kyc') {
      loadKycData();
    }
  }, [activeTab]);

  const loadUsers = () => {
    const allUsers = userStorage.getAllUsers();
    setUsers(allUsers);
  };

  const loadAds = () => {
    const savedAds = localStorage.getItem('adminAds');
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    }
  };

  const loadKycData = () => {
    console.log('=== loadKycData called ===');
    const savedKyc = localStorage.getItem('kycVerifications');
    console.log('Raw KYC data from localStorage:', savedKyc);
    
    if (savedKyc) {
      try {
        const parsed = JSON.parse(savedKyc);
        console.log('Parsed KYC data:', parsed);
        console.log('Number of KYC entries:', parsed.length);
        
        const kyc = parsed.map((verification: any) => ({
          ...verification,
          submittedAt: verification.submittedAt ? new Date(verification.submittedAt) : new Date(),
          processedAt: verification.processedAt ? new Date(verification.processedAt) : undefined
        }));
        
        setKycVerifications(kyc);
        console.log('Processed KYC data:', kyc);
        console.log('State updated with KYC verifications:', kyc.length);
      } catch (error) {
        console.error('Error loading KYC data:', error);
        setKycVerifications([]);
      }
    } else {
      console.log('No KYC data found in localStorage');
      setKycVerifications([]);
    }
  };

  const saveAds = (adsList: AdminAd[]) => {
    localStorage.setItem('adminAds', JSON.stringify(adsList));
    setAds(adsList);
  };

  // Extract YouTube ID from URL
  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // Generate thumbnail from YouTube ID
  const generateYouTubeThumbnail = (youtubeId: string): string => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  // Handle YouTube URL input
  const handleYouTubeUrlChange = (url: string) => {
    setNewAd(prev => ({
      ...prev,
      youtubeUrl: url
    }));
  };

  // Handle adding new ad
  const handleAddAd = () => {
    if (!newAd.title || !newAd.description || (!newAd.youtubeUrl && !newAd.videoFile)) {
      alert('Please fill in all required fields');
      return;
    }
    const youtubeId = newAd.youtubeUrl ? extractYouTubeId(newAd.youtubeUrl) : undefined;
    const ad: AdminAd = {
      id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newAd.title!,
      description: newAd.description!,
      youtubeId: youtubeId,
      videoFile: newAd.videoFile,
      duration: newAd.duration!,
      reward: newAd.reward!,
      category: newAd.category!,
      thumbnail: youtubeId ? generateYouTubeThumbnail(youtubeId) : newAd.videoFile || '',
      requiredWatchTime: newAd.requiredWatchTime!,
      isActive: newAd.isActive!,
      createdAt: new Date().toISOString(),
      views: 0,
      totalEarnings: 0
    };
    const updatedAds = [...ads, ad];
    saveAds(updatedAds);
    setShowAddAdModal(false);
    setNewAd({
      title: '',
      description: '',
      youtubeUrl: '',
      youtubeId: '',
      duration: 30,
      reward: 0.05,
      category: 'gaming',
      requiredWatchTime: 25,
      isActive: true
    });
  };

  // Handle editing ad
  const handleEditAd = (ad: AdminAd) => {
    setEditingAd(ad);
    setNewAd({
      title: ad.title,
      description: ad.description,
      youtubeUrl: ad.youtubeId ? `https://www.youtube.com/watch?v=${ad.youtubeId}` : '',
      youtubeId: ad.youtubeId,
      videoFile: ad.videoFile,
      duration: ad.duration,
      reward: ad.reward,
      category: ad.category,
      requiredWatchTime: ad.requiredWatchTime,
      isActive: ad.isActive
    });
    setShowAddAdModal(true);
  };

  // Handle updating ad
  const handleUpdateAd = () => {
    if (!editingAd || !newAd.title || !newAd.description) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedAd: AdminAd = {
      ...editingAd,
      title: newAd.title,
      description: newAd.description,
      youtubeId: newAd.youtubeId,
      videoFile: newAd.videoFile,
      duration: newAd.duration!,
      reward: newAd.reward!,
      category: newAd.category!,
      thumbnail: newAd.youtubeId ? generateYouTubeThumbnail(newAd.youtubeId) : newAd.videoFile || editingAd.thumbnail,
      requiredWatchTime: newAd.requiredWatchTime!,
      isActive: newAd.isActive!
    };

    const updatedAds = ads.map(ad => ad.id === editingAd.id ? updatedAd : ad);
    saveAds(updatedAds);
    setShowAddAdModal(false);
    setEditingAd(null);
    setNewAd({
      title: '',
      description: '',
      youtubeUrl: '',
      youtubeId: '',
      duration: 30,
      reward: 0.05,
      category: 'gaming',
      requiredWatchTime: 25,
      isActive: true
    });
  };

  // Handle deleting ad
  const handleDeleteAd = (adId: string) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      const updatedAds = ads.filter(ad => ad.id !== adId);
      saveAds(updatedAds);
    }
  };

  // Handle toggling ad status
  const handleToggleAdStatus = (adId: string) => {
    const updatedAds = ads.map(ad => 
      ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad
    );
    saveAds(updatedAds);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewAd(prev => ({
          ...prev,
          videoFile: result,
          thumbnail: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Get category color
  const getCategoryColor = (category: AdminAd['category']) => {
    switch (category) {
      case 'gaming': return 'bg-purple-500';
      case 'tech': return 'bg-blue-500';
      case 'lifestyle': return 'bg-green-500';
      case 'finance': return 'bg-yellow-500';
      case 'education': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.balance > 0) ||
                         (filterStatus === 'inactive' && user.balance === 0);
    return matchesSearch && matchesStatus;
  });

  // Get deposit proofs from localStorage
  const getDepositProofs = () => {
    const proofs = localStorage.getItem('depositProofs');
    return proofs ? JSON.parse(proofs) : [];
  };

  // Get withdrawal requests from localStorage
  const getWithdrawalRequests = () => {
    const requests = localStorage.getItem('withdrawRequests');
    return requests ? JSON.parse(requests) : [];
  };

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalBalance: users.reduce((sum, user) => sum + user.balance, 0),
    totalEarned: users.reduce((sum, user) => sum + user.totalEarned, 0),
    activeUsers: users.filter(user => user.balance > 0).length,
    pendingDeposits: getDepositProofs().filter((p: any) => p.status === 'pending').length,
    pendingWithdrawals: getWithdrawalRequests().filter((r: any) => r.status === 'pending').length,
    totalDeposits: getDepositProofs().reduce((sum: number, p: any) => sum + p.amount, 0),
    totalWithdrawals: getWithdrawalRequests().reduce((sum: number, r: any) => sum + r.amount, 0)
  };

  // Handle user balance update
  const handleBalanceUpdate = (userId: string, amount: number, action: 'add' | 'subtract') => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newBalance = action === 'add' ? user.balance + amount : Math.max(0, user.balance - amount);
      const updatedUser = { ...user, balance: newBalance };
      userStorage.updateUser(updatedUser);
      loadUsers();
    }
  };

  // Handle user reset (balance only)
  const handleUserBalanceReset = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && window.confirm(`Reset balance for ${user.username}?`)) {
      const updatedUser = { ...user, balance: 0, totalEarned: 0 };
      userStorage.updateUser(updatedUser);
      loadUsers();
    }
  };

  // Handle add balance to user
  const handleAddBalance = (userId: string) => {
    const amountStr = window.prompt('Enter amount to add:');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }
    handleBalanceUpdate(userId, amount, 'add');
  };

  // Handle reset all balances
  const handleResetAllBalances = () => {
    if (window.confirm('Are you sure you want to reset ALL user balances and earnings to zero?')) {
      userStorage.resetAllBalances();
      loadUsers();
      alert('All balances and earnings have been reset.');
    }
  };

  // Handle user reset
  const handleUserReset = (username: string) => {
    if (window.confirm(`Are you sure you want to reset ${username}'s account? This will clear their balance and earnings.`)) {
      userStorage.resetUserAccount(username);
      loadUsers();
    }
  };

  // Handle deposit approval
  const handleDepositApproval = (proofId: string, approved: boolean) => {
    const proofs = getDepositProofs();
    const proofIndex = proofs.findIndex((p: any) => p.id === proofId);
    if (proofIndex !== -1) {
      if (approved) {
        proofs[proofIndex].status = 'approved';
        proofs[proofIndex].processedAt = new Date();
        proofs[proofIndex].adminNotes = 'Approved by admin';
        // Add balance to user
        userStorage.handleDeposit(proofs[proofIndex].userId, proofs[proofIndex].amount);
      } else {
        proofs[proofIndex].status = 'rejected';
        proofs[proofIndex].processedAt = new Date();
        proofs[proofIndex].adminNotes = 'Rejected by admin';
      }
      localStorage.setItem('depositProofs', JSON.stringify(proofs));
      loadUsers();
    }
  };

  // Handle withdrawal approval
  const handleWithdrawalApproval = (requestId: string, approved: boolean) => {
    const requests = getWithdrawalRequests();
    const requestIndex = requests.findIndex((r: any) => r.id === requestId);
    if (requestIndex !== -1) {
      const request = requests[requestIndex];
      
      if (approved) {
        requests[requestIndex].status = 'approved';
        requests[requestIndex].processedAt = new Date();
        requests[requestIndex].adminNotes = 'Approved by admin';
        // Subtract balance from user
        const user = users.find(u => u.id === request.userId);
        if (user) {
          const updatedUser = { ...user, balance: Math.max(0, user.balance - request.amount) };
          userStorage.updateUser(updatedUser);
        }
        
        // Send notification to user
        userStorage.addWithdrawalApprovalNotification(request.userId, request.amount);
      } else {
        requests[requestIndex].status = 'rejected';
        requests[requestIndex].processedAt = new Date();
        requests[requestIndex].adminNotes = 'Rejected by admin';
        
        // Send notification to user
        userStorage.addWithdrawalRejectionNotification(request.userId, request.amount, 'Rejected by admin');
      }
      localStorage.setItem('withdrawRequests', JSON.stringify(requests));
      loadUsers();
    }
  };

  // Handle KYC approval
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
    localStorage.setItem('kycVerifications', JSON.stringify(kycVerifications));
  };

  // Handle KYC rejection
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
    localStorage.setItem('kycVerifications', JSON.stringify(kycVerifications));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3Icon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'deposits', label: 'Deposits', icon: DollarSignIcon },
    { id: 'withdrawals', label: 'Withdrawals', icon: ActivityIcon },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'referrals', label: 'Referrals', icon: Gift },
    { id: 'ads', label: 'Ads', icon: Video },
    { id: 'kyc', label: 'KYC Reviews', icon: CreditCard }
  ];

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar (desktop & mobile) */}
      <div>
        {/* Hamburger for mobile */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <span className="block w-6 h-0.5 bg-white mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-white mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
        </button>
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <aside
          className={`glass-card border border-white/20 shadow-2xl rounded-r-3xl p-3 flex flex-col items-start bg-white/10 backdrop-blur-xl transition-all duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${sidebarFolded ? 'w-20' : 'w-64'}
            h-screen z-50
            lg:translate-x-0 lg:static lg:rounded-3xl lg:block`}
          style={{ minWidth: sidebarFolded ? '5rem' : '16rem' }}
        >
          {/* Logo and Fold Button */}
          <div className="mb-10 w-full flex items-center justify-between">
            <span className={`text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent select-none transition-opacity duration-200 ${sidebarFolded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>Admin</span>
            <button
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition ml-2"
              onClick={() => setSidebarFolded(f => !f)}
              aria-label={sidebarFolded ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarFolded ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col gap-2 w-full">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id as any); setSidebarOpen(false); }}
                className={`flex items-center gap-x-4 justify-start px-2 py-3 rounded-xl w-full text-left font-semibold transition-all duration-200
                  ${activeTab === id
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className={`transition-all duration-200 ${sidebarFolded ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 w-auto ml-2'}`}>{label}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>
      {/* Main content shifted right on desktop */}
      <main className="flex-1 w-full min-h-screen relative flex flex-col transition-all duration-300">
        {/* Aurora Animated Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
        </div>
        {/* Tab Content Panel */}
        <section className="relative z-10 w-full max-w-6xl mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Balance</p>
                    <p className="text-2xl font-bold text-green-400">${stats.totalBalance.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Earned</p>
                    <p className="text-2xl font-bold text-yellow-400">${stats.totalEarned.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Active Users</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.activeUsers}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>
            {/* Reset All Balances Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleResetAllBalances}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition"
              >
                Reset All Balances
              </button>
            </div>
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('deposits')}
                  className="flex items-center space-x-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Upload className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <p className="text-white font-semibold">Review Deposits</p>
                    <p className="text-white/60 text-sm">{stats.pendingDeposits} pending</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('withdrawals')}
                  className="flex items-center space-x-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <Download className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <p className="text-white font-semibold">Review Withdrawals</p>
                    <p className="text-white/60 text-sm">{stats.pendingWithdrawals} pending</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowDepositOverview(true)}
                  className="flex items-center space-x-3 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-white font-semibold">Deposit Overview</p>
                    <p className="text-white/60 text-sm">View all users</p>
                  </div>
                </button>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {getDepositProofs().slice(-5).reverse().map((proof: any) => (
                  <div key={proof.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${proof.status === 'approved' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <div>
                        <p className="text-white font-medium">{proof.username}</p>
                        <p className="text-white/60 text-sm">Deposit: ${proof.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">{new Date(proof.submittedAt).toLocaleDateString()}</p>
                      <p className={`text-xs ${proof.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {proof.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>
                <button
                  onClick={loadUsers}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            {/* Users Table */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Total Earned</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                                <span className="text-white font-semibold">{user.username.charAt(0).toUpperCase()}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.username}</div>
                              <div className="text-sm text-white/60">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">${user.balance.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">${user.totalEarned.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white/60">{new Date(user.joinDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowUserDetails(user.id)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserReset(user.username)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserBalanceReset(user.id)}
                              className="text-red-500 hover:text-red-600"
                              title="Reset Balance"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddBalance(user.id)}
                              className="text-green-400 hover:text-green-300"
                              title="Add Balance"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'deposits' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Deposit Proofs</h2>
              <div className="space-y-4">
                {getDepositProofs().map((proof: any) => (
                  <div key={proof.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{proof.username}</h3>
                        <p className="text-white/60 text-sm">Amount: ${proof.amount}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proof.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                        proof.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {proof.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-white/60 text-sm">Transaction Hash:</p>
                        <p className="text-white text-sm font-mono">{proof.transactionHash || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Submitted:</p>
                        <p className="text-white text-sm">{new Date(proof.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {proof.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDepositApproval(proof.id, true)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleDepositApproval(proof.id, false)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Withdrawal Requests</h2>
              <div className="space-y-4">
                {getWithdrawalRequests().map((request: any) => (
                  <div key={request.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{request.username}</h3>
                        <p className="text-white/60 text-sm">Amount: ${request.amount}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                        request.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {request.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-white/60 text-sm">Wallet Address:</p>
                        <p className="text-white text-sm font-mono">{request.walletAddress}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Requested:</p>
                        <p className="text-white text-sm">{new Date(request.requestedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleWithdrawalApproval(request.id, true)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleWithdrawalApproval(request.id, false)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Subscription Management</h2>
              <div className="space-y-4">
                {users.filter(user => user.subscriptionHistory && user.subscriptionHistory.length > 0).map(user => (
                  <div key={user.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{user.username}</h3>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.subscriptionStatus === 'active' ? 'bg-green-500/20 text-green-400' : 
                        user.subscriptionStatus === 'expired' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.subscriptionStatus || 'No subscription'}
                      </div>
                    </div>
                    {user.subscriptionHistory && user.subscriptionHistory.length > 0 && (
                      <div className="space-y-2">
                        {user.subscriptionHistory.map((sub: SubscriptionRecord) => (
                          <div key={sub.id} className="bg-white/5 rounded p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">{sub.type} - ${sub.amount}</p>
                                <p className="text-white/60 text-sm">
                                  {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                sub.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                                sub.status === 'expired' ? 'bg-red-500/20 text-red-400' : 
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {sub.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Referral System</h2>
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{user.username}</h3>
                        <p className="text-white/60 text-sm">Referral Code: {user.referralCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{user.referralCount} referrals</p>
                        <p className="text-white/60 text-sm">${user.referralEarnings.toFixed(2)} earned</p>
                      </div>
                    </div>
                    {user.referralHistory && user.referralHistory.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-white/60 text-sm font-medium">Recent Referrals:</p>
                        {user.referralHistory.slice(-3).map((ref: ReferralRecord) => (
                          <div key={ref.id} className="bg-white/5 rounded p-2 flex justify-between items-center">
                            <div>
                              <p className="text-white text-sm">{ref.referredUsername}</p>
                              <p className="text-white/60 text-xs">{new Date(ref.joinDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">${ref.earnings.toFixed(2)}</p>
                              <span className={`px-2 py-1 rounded text-xs ${
                                ref.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {ref.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            {/* Move the add buttons to the top and center them */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => {
                  setNewAd({
                    title: '',
                    description: '',
                    youtubeUrl: '',
                    youtubeId: '',
                    videoFile: undefined,
                    duration: 30,
                    reward: 0.05,
                    category: 'gaming',
                    requiredWatchTime: 25,
                    isActive: true,
                    thumbnail: ''
                  });
                  setEditingAd(null);
                  setShowAddAdModal(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition"
              >
                Add YouTube Ad
              </button>
              <button
                onClick={() => {
                  setNewAd({
                    title: '',
                    description: '',
                    youtubeUrl: '',
                    youtubeId: '',
                    videoFile: 'dummy', // Will be replaced by upload
                    duration: 30,
                    reward: 0.05,
                    category: 'gaming',
                    requiredWatchTime: 25,
                    isActive: true,
                    thumbnail: ''
                  });
                  setEditingAd(null);
                  setShowAddAdModal(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition"
              >
                Add Video Upload Ad
              </button>
            </div>
            {/* Filter ads into active and history */}
            {(() => {
              const now = Date.now();
              const activeAds = ads.filter(ad => now - new Date(ad.createdAt).getTime() < 24 * 60 * 60 * 1000);
              const historyAds = ads.filter(ad => now - new Date(ad.createdAt).getTime() >= 24 * 60 * 60 * 1000);
              return <>
                <div className="flex justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 w-full">
                    <h2 className="text-xl font-bold text-white mb-4 text-center">Ad Management</h2>
                    <div className="space-y-4">
                      {activeAds.length === 0 && (
                        <div className="text-center text-white/60 py-8">No active ads. Add a new ad above.</div>
                      )}
                      {activeAds.map(ad => (
                        <div key={ad.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-white font-semibold">{ad.title}</h3>
                              <p className="text-white/60 text-sm">{ad.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">{ad.views} views</p>
                              <p className="text-white/60 text-sm">${ad.totalEarnings.toFixed(2)} earned</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAd(ad)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleAdStatus(ad.id)}
                              className={`text-${ad.isActive ? 'green' : 'red'}-400 hover:text-${ad.isActive ? 'green' : 'red'}-300`}
                            >
                              {ad.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Ads History Section */}
                <div className="flex justify-center mt-10">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 w-full">
                    <h2 className="text-lg font-bold text-white mb-4 text-center">Ads History (Expired after 24h)</h2>
                    <div className="space-y-4">
                      {historyAds.length === 0 && (
                        <div className="text-center text-white/40 py-8">No expired ads yet.</div>
                      )}
                      {historyAds.map(ad => (
                        <div key={ad.id} className="bg-white/10 rounded-lg p-4 border border-white/10 opacity-70">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-white font-semibold">{ad.title}</h3>
                              <p className="text-white/60 text-sm">{ad.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">{ad.views} views</p>
                              <p className="text-white/60 text-sm">${ad.totalEarnings.toFixed(2)} earned</p>
                            </div>
                          </div>
                          <div className="text-xs text-white/40">Published: {new Date(ad.createdAt).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>;
            })()}
          </div>
        )}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">KYC Verification Reviews</h2>
                <button
                  onClick={loadKycData}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
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
                    {kycVerifications.map((kyc) => (
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
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            kyc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            kyc.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {kyc.status === 'pending' ? <Clock className="w-3 h-3" /> :
                             kyc.status === 'approved' ? <Check className="w-3 h-3" /> :
                             <X className="w-3 h-3" />}
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
              {kycVerifications.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No KYC verifications found</p>
                  <button
                    onClick={() => {
                      console.log('Current localStorage kycVerifications:', localStorage.getItem('kycVerifications'));
                      console.log('Current kycVerifications state:', kycVerifications);
                      loadKycData();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Debug: Check KYC Data
                  </button>
                  <button
                    onClick={() => {
                      console.log('=== Port Persistence Debug ===');
                      console.log('Current port:', window.location.port || '3000');
                      console.log('Has port backup:', userStorage.hasPortBackup());
                      const backupInfo = userStorage.getBackupInfo();
                      console.log('Backup info:', backupInfo);
                      if (backupInfo.hasBackup) {
                        console.log('Restoring from backup...');
                        const restored = userStorage.restoreFromPortBackup();
                        console.log('Restore successful:', restored);
                        if (restored) {
                          loadUsers();
                          alert('Data restored from backup!');
                        }
                      } else {
                        console.log('No backup available');
                        alert('No backup data available');
                      }
                    }}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Debug: Port Persistence
                  </button>
                  <button
                    onClick={() => {
                      const testKyc = {
                        id: `kyc_${Date.now()}_test123`,
                        userId: 'test_user_123',
                        username: 'testuser',
                        fullName: 'Test User',
                        dateOfBirth: '1990-01-01',
                        nationality: 'United States',
                        documentType: 'passport',
                        documentNumber: '123456789',
                        documentFront: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                        documentBack: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                        selfieWithDocument: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                        status: 'pending',
                        submittedAt: new Date().toISOString(),
                        adminNotes: undefined,
                        rejectionReason: undefined
                      };
                      
                      const existingKyc = localStorage.getItem('kycVerifications');
                      const kycList = existingKyc ? JSON.parse(existingKyc) : [];
                      kycList.push(testKyc);
                      localStorage.setItem('kycVerifications', JSON.stringify(kycList));
                      
                      console.log('Test KYC data added:', testKyc);
                      loadKycData();
                    }}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Debug: Add Test KYC Data
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        </section>
      </main>
        {/* Deposit Overview Modal */}
        {showDepositOverview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Deposit Overview</h2>
                <button
                  onClick={() => setShowDepositOverview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {users.map(user => {
                  const userProofs = getDepositProofs().filter((p: any) => p.userId === user.id);
                  const hasApprovedDeposit = userProofs.some((p: any) => p.status === 'approved');
                  const lastDeposit = userProofs[userProofs.length - 1];
                  
                  return (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.username}</h3>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            hasApprovedDeposit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {hasApprovedDeposit ? 'Has Deposit' : 'No Deposit'}
                          </div>
                        </div>
                      </div>
                      {lastDeposit && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Last deposit: ${lastDeposit.amount} on {new Date(lastDeposit.submittedAt).toLocaleDateString()}
                          </p>
                          <p className={`text-xs ${
                            lastDeposit.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            Status: {lastDeposit.status}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* Add Ad Modal */}
        {showAddAdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  {editingAd ? 'Edit Ad' : (newAd.videoFile ? 'Add Video Upload Ad' : 'Add YouTube Ad')}
                </h2>
                <button
                  onClick={() => setShowAddAdModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Only show the video source toggle if editing an ad, not when adding new */}
                {editingAd && (
                  <div className="flex space-x-4 mb-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSource"
                        checked={!newAd.videoFile}
                        onChange={() => setNewAd(prev => ({ ...prev, videoFile: undefined }))}
                        className="form-radio text-purple-500"
                      />
                      <span>YouTube Link</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSource"
                        checked={!!newAd.videoFile}
                        onChange={() => setNewAd(prev => ({ ...prev, youtubeId: '', thumbnail: '' }))}
                        className="form-radio text-purple-500"
                      />
                      <span>Upload Video</span>
                    </label>
                  </div>
                )}
                {/* YouTube Link Input (show only if not videoFile) */}
                {!newAd.videoFile && (
                  <input
                    type="text"
                    placeholder="YouTube URL"
                    value={newAd.youtubeUrl}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  />
                )}
                {/* Video Upload Input (show only if videoFile and not adding YouTube Ad) */}
                {newAd.videoFile && editingAd && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 cursor-pointer">
                      <Video className="w-4 h-4" />
                      <span>Upload Video</span>
                    </label>
                    {newAd.videoFile && (
                      <video src={newAd.videoFile} controls className="w-full max-h-48 rounded-lg mt-2" />
                    )}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Title"
                  value={newAd.title}
                  onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <textarea
                  placeholder="Description"
                  value={newAd.description}
                  onChange={(e) => setNewAd(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <select
                  value={newAd.category}
                  onChange={(e) => setNewAd(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <option value="gaming">Gaming</option>
                  <option value="tech">Tech</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                </select>
                <input
                  type="number"
                  placeholder="Duration (seconds)"
                  value={newAd.duration}
                  onChange={(e) => setNewAd(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
                  className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <input
                  type="number"
                  placeholder="Reward (USDT)"
                  value={newAd.reward}
                  onChange={(e) => setNewAd(prev => ({ ...prev, reward: parseFloat(e.target.value) }))}
                  className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <input
                  type="number"
                  placeholder="Required Watch Time (seconds)"
                  value={newAd.requiredWatchTime}
                  onChange={(e) => setNewAd(prev => ({ ...prev, requiredWatchTime: parseFloat(e.target.value) }))}
                  className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  value={newAd.thumbnail}
                  onChange={(e) => setNewAd(prev => ({ ...prev, thumbnail: e.target.value }))}
                  className="w-full pl-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={editingAd ? handleUpdateAd : handleAddAd}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition"
                  >
                    {editingAd ? 'Update Ad' : 'Add Ad'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* KYC Verification Detail Modal */}
        {selectedKyc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">KYC Verification Details</h2>
                <button
                  onClick={() => setSelectedKyc(null)}
                  className="text-gray-400 hover:text-gray-200"
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
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedKyc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        selectedKyc.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {selectedKyc.status === 'pending' ? <Clock className="w-3 h-3" /> :
                         selectedKyc.status === 'approved' ? <Check className="w-3 h-3" /> :
                         <X className="w-3 h-3" />}
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
        )}
    </div>
  );
}; 