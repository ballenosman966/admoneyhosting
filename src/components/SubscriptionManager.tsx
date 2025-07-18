import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Eye,
  Plus,
  X,
  Check,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Search,
  BarChart3,
  CreditCard,
  Crown,
  Star
} from 'lucide-react';
import { userStorage } from '../utils/userStorage';
import { User, SubscriptionRecord } from '../utils/userStorage';

interface SubscriptionManagerProps {
  onClose: () => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'add-subscription'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'cancelled'>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Add subscription form state
  const [subscriptionForm, setSubscriptionForm] = useState({
    type: 'basic' as 'basic' | 'premium' | 'vip',
    amount: '',
    duration: '30',
    paymentMethod: '',
    transactionId: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = () => {
    // Check for expired subscriptions
    userStorage.checkExpiredSubscriptions();
    
    // Load stats
    const subscriptionStats = userStorage.getSubscriptionStats();
    setStats(subscriptionStats);
    
    // Load subscribers
    const allUsers = userStorage.getAllUsers();
    const usersWithSubscriptions = allUsers.filter(user => 
      user.subscriptionHistory && user.subscriptionHistory.length > 0
    );
    setSubscribers(usersWithSubscriptions);
  };

  const handleAddSubscription = () => {
    if (!selectedUser) return;
    
    try {
      userStorage.addSubscription(selectedUser.id, {
        type: subscriptionForm.type,
        amount: parseFloat(subscriptionForm.amount),
        duration: parseInt(subscriptionForm.duration),
        paymentMethod: subscriptionForm.paymentMethod || undefined,
        transactionId: subscriptionForm.transactionId || undefined,
        notes: subscriptionForm.notes || undefined
      });
      
      // Reset form and reload data
      setSubscriptionForm({
        type: 'basic',
        amount: '',
        duration: '30',
        paymentMethod: '',
        transactionId: '',
        notes: ''
      });
      setSelectedUser(null);
      setActiveTab('overview');
      loadData();
      
      alert('Subscription added successfully!');
    } catch (error) {
      alert(`Error adding subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancelSubscription = (userId: string, reason?: string) => {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      try {
        userStorage.cancelSubscription(userId, reason);
        loadData();
        alert('Subscription cancelled successfully!');
      } catch (error) {
        alert(`Error cancelling subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const filteredSubscribers = subscribers.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.subscriptionStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getSubscriptionTypeIcon = (type: string) => {
    switch (type) {
      case 'vip': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'premium': return <Star className="w-4 h-4 text-purple-400" />;
      default: return <CreditCard className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const exportSubscriptionData = () => {
    const data = filteredSubscribers.map(user => ({
      username: user.username,
      email: user.email,
      subscriptionType: user.subscriptionType,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      totalSubscriptions: user.subscriptionHistory?.length || 0
    }));
    
    const csv = [
      ['Username', 'Email', 'Subscription Type', 'Status', 'Start Date', 'End Date', 'Total Subscriptions'],
      ...data.map(row => [
        row.username,
        row.email,
        row.subscriptionType || 'N/A',
        row.subscriptionStatus || 'N/A',
        row.subscriptionStartDate || 'N/A',
        row.subscriptionEndDate || 'N/A',
        row.totalSubscriptions.toString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Subscription Manager</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'subscribers' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Subscribers
          </button>
          <button
            onClick={() => setActiveTab('add-subscription')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'add-subscription' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Subscription
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Total Subscribers</p>
                      <p className="text-2xl font-bold text-white">{stats.totalSubscribers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-green-400">{stats.activeSubscriptions}</p>
                    </div>
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Expired</p>
                      <p className="text-2xl font-bold text-red-400">{stats.expiredSubscriptions}</p>
                    </div>
                    <Clock className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        ${Object.values(stats.revenueByType).reduce((a: number, b: number) => a + b, 0).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue by Subscription Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Basic</p>
                    <p className="text-xl font-bold text-white">${stats.revenueByType.basic.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Premium</p>
                    <p className="text-xl font-bold text-white">${stats.revenueByType.premium.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">VIP</p>
                    <p className="text-xl font-bold text-white">${stats.revenueByType.vip.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Recent Subscriptions */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Subscriptions (Last 30 Days)</h3>
                <div className="space-y-3">
                  {stats.recentSubscriptions.slice(0, 5).map((sub: SubscriptionRecord) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getSubscriptionTypeIcon(sub.type)}
                        <div>
                          <p className="text-white font-medium">{sub.type.toUpperCase()}</p>
                          <p className="text-white/60 text-sm">
                            {new Date(sub.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${sub.amount}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {stats.recentSubscriptions.length === 0 && (
                    <p className="text-white/60 text-center py-4">No recent subscriptions</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search subscribers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40"
                    />
                  </div>
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <button
                  onClick={exportSubscriptionData}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              {/* Subscribers Table */}
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-white font-medium">User</th>
                        <th className="px-4 py-3 text-left text-white font-medium">Subscription</th>
                        <th className="px-4 py-3 text-left text-white font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-white font-medium">Start Date</th>
                        <th className="px-4 py-3 text-left text-white font-medium">End Date</th>
                        <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredSubscribers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-medium">{user.username}</p>
                              <p className="text-white/60 text-sm">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              {getSubscriptionTypeIcon(user.subscriptionType || 'basic')}
                              <span className="text-white capitalize">{user.subscriptionType || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.subscriptionStatus || '')}`}>
                              {user.subscriptionStatus || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-white/80 text-sm">
                              {user.subscriptionStartDate ? new Date(user.subscriptionStartDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-white/80 text-sm">
                              {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActiveTab('add-subscription');
                                }}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                Edit
                              </button>
                              {user.subscriptionStatus === 'active' && (
                                <button
                                  onClick={() => handleCancelSubscription(user.id, 'Admin cancelled')}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Cancel
                                </button>
                              )}
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

          {activeTab === 'add-subscription' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-xl font-bold text-white">
                {selectedUser ? `Add Subscription for ${selectedUser.username}` : 'Add New Subscription'}
              </h3>

              {!selectedUser && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <label className="block text-white font-medium mb-2">Select User</label>
                  <select
                    onChange={(e) => {
                      const user = subscribers.find(u => u.id === e.target.value);
                      setSelectedUser(user || null);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select a user...</option>
                    {subscribers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedUser && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Subscription Type</label>
                    <select
                      value={subscriptionForm.type}
                      onChange={(e) => setSubscriptionForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Amount (USDT)</label>
                    <input
                      type="number"
                      value={subscriptionForm.amount}
                      onChange={(e) => setSubscriptionForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={subscriptionForm.duration}
                      onChange={(e) => setSubscriptionForm(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="30"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Payment Method (optional)</label>
                    <input
                      type="text"
                      value={subscriptionForm.paymentMethod}
                      onChange={(e) => setSubscriptionForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      placeholder="USDT, Credit Card, etc."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Transaction ID (optional)</label>
                    <input
                      type="text"
                      value={subscriptionForm.transactionId}
                      onChange={(e) => setSubscriptionForm(prev => ({ ...prev, transactionId: e.target.value }))}
                      placeholder="Transaction hash or ID"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Notes (optional)</label>
                    <textarea
                      value={subscriptionForm.notes}
                      onChange={(e) => setSubscriptionForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddSubscription}
                      disabled={!subscriptionForm.amount || !subscriptionForm.duration}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Subscription
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setSubscriptionForm({
                          type: 'basic',
                          amount: '',
                          duration: '30',
                          paymentMethod: '',
                          transactionId: '',
                          notes: ''
                        });
                      }}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 