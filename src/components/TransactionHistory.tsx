import React, { useState, useMemo } from 'react';
import { Download, Search, TrendingUp, TrendingDown, Wallet, Users, Eye, Play, Gift, DollarSign, Crown, Zap, ChevronDown, ChevronUp, X, DollarSign as DollarIcon, Filter as FilterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'ad_earnings' | 'referral' | 'vip_reward' | 'subscription';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  timestamp: string;
  transactionHash?: string;
  fee?: number;
  network?: string;
}

interface TransactionHistoryProps {
  user: any;
}

interface FilterState {
  type: 'all' | 'deposit' | 'withdrawal' | 'ad_earnings' | 'referral' | 'vip_reward';
  status: 'all' | 'pending' | 'completed' | 'failed' | 'cancelled';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  amountRange: 'all' | 'small' | 'medium' | 'large';
  searchTerm: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ user }) => {
  const [filterState, setFilterState] = useState<FilterState>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    amountRange: 'all',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'type' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Only use real transactions from user, not mock/demo data
  const realTransactions: Transaction[] = user?.transactions || [];

  const filteredTransactions = useMemo(() => {
    let filtered = realTransactions;

    // Filter by type
    if (filterState.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterState.type);
    }

    // Filter by status
    if (filterState.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterState.status);
    }

    // Filter by date range
    if (filterState.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      switch (filterState.dateRange) {
        case 'today':
          filtered = filtered.filter(tx => new Date(tx.timestamp) >= today);
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(tx => new Date(tx.timestamp) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(tx => new Date(tx.timestamp) >= monthAgo);
          break;
        case 'custom':
          if (filterState.startDate && filterState.endDate) {
            const start = new Date(filterState.startDate);
            const end = new Date(filterState.endDate);
            filtered = filtered.filter(tx => {
              const txDate = new Date(tx.timestamp);
              return txDate >= start && txDate <= end;
            });
          }
          break;
      }
    }

    // Filter by amount range
    if (filterState.amountRange !== 'all') {
      switch (filterState.amountRange) {
        case 'small':
          filtered = filtered.filter(tx => Math.abs(tx.amount) <= 5);
          break;
        case 'medium':
          filtered = filtered.filter(tx => Math.abs(tx.amount) > 5 && Math.abs(tx.amount) <= 25);
          break;
        case 'large':
          filtered = filtered.filter(tx => Math.abs(tx.amount) > 25);
          break;
      }
    }

    // Filter by custom amount range
    if (filterState.minAmount !== undefined || filterState.maxAmount !== undefined) {
      filtered = filtered.filter(tx => {
        const amount = Math.abs(tx.amount);
        const min = filterState.minAmount || 0;
        const max = filterState.maxAmount || Infinity;
        return amount >= min && amount <= max;
      });
    }

    // Filter by search term
    if (filterState.searchTerm) {
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        (tx.transactionHash && tx.transactionHash.toLowerCase().includes(filterState.searchTerm.toLowerCase()))
      );
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [realTransactions, filterState, sortBy, sortOrder]);

  // Get transactions to display (first 3 if not expanded, all if expanded)
  const displayedTransactions = isExpanded ? filteredTransactions : filteredTransactions.slice(0, 3);
  const hasMoreTransactions = filteredTransactions.length > 3;



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      case 'cancelled':
        return 'text-slate-400 bg-slate-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Status', 'Description', 'Transaction Hash'],
      ...filteredTransactions.map(tx => [
        new Date(tx.timestamp).toLocaleString(),
        tx.type.replace('_', ' ').toUpperCase(),
        tx.amount.toString(),
        tx.status.toUpperCase(),
        tx.description,
        tx.transactionHash || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilterState({
      type: 'all',
      status: 'all',
      dateRange: 'all',
      amountRange: 'all',
      searchTerm: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filterState.type !== 'all') count++;
    if (filterState.status !== 'all') count++;
    if (filterState.dateRange !== 'all') count++;
    if (filterState.amountRange !== 'all') count++;
    if (filterState.searchTerm) count++;
    if (filterState.minAmount !== undefined || filterState.maxAmount !== undefined) count++;
    return count;
  };

  const totalEarnings = filteredTransactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = filteredTransactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Transaction History
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportTransactions}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showAdvancedFilters 
                ? 'bg-yellow-400/20 border-yellow-400/30 text-yellow-400' 
                : 'bg-white/10 border-white/20 text-white/80 hover:text-white hover:bg-white/20'
            } border`}
          >
            <FilterIcon className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: 'All', value: 'all', icon: <Eye className="w-4 h-4" /> },
          { label: 'Earnings', value: 'ad_earnings', icon: <TrendingUp className="w-4 h-4" /> },
          { label: 'Deposits', value: 'deposit', icon: <DollarIcon className="w-4 h-4" /> },
          { label: 'Withdrawals', value: 'withdrawal', icon: <TrendingDown className="w-4 h-4" /> },
          { label: 'Referrals', value: 'referral', icon: <Users className="w-4 h-4" /> },
          { label: 'VIP', value: 'vip_reward', icon: <Crown className="w-4 h-4" /> }
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterState(prev => ({ ...prev, type: filter.value as any }))}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filterState.type === filter.value
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20'
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                  <select
                    value={filterState.status}
                    onChange={(e) => setFilterState(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    style={{ color: 'white' }}
                  >
                    <option value="all" style={{ backgroundColor: '#1f2937', color: 'white' }}>All Status</option>
                    <option value="completed" style={{ backgroundColor: '#1f2937', color: 'white' }}>Completed</option>
                    <option value="pending" style={{ backgroundColor: '#1f2937', color: 'white' }}>Pending</option>
                    <option value="failed" style={{ backgroundColor: '#1f2937', color: 'white' }}>Failed</option>
                    <option value="cancelled" style={{ backgroundColor: '#1f2937', color: 'white' }}>Cancelled</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Date Range</label>
                  <select
                    value={filterState.dateRange}
                    onChange={(e) => setFilterState(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    style={{ color: 'white' }}
                  >
                    <option value="all" style={{ backgroundColor: '#1f2937', color: 'white' }}>All Time</option>
                    <option value="today" style={{ backgroundColor: '#1f2937', color: 'white' }}>Today</option>
                    <option value="week" style={{ backgroundColor: '#1f2937', color: 'white' }}>Last 7 Days</option>
                    <option value="month" style={{ backgroundColor: '#1f2937', color: 'white' }}>Last 30 Days</option>
                    <option value="custom" style={{ backgroundColor: '#1f2937', color: 'white' }}>Custom Range</option>
                  </select>
                </div>

                {/* Amount Range Filter */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Amount Range</label>
        <select
                    value={filterState.amountRange}
                    onChange={(e) => setFilterState(prev => ({ ...prev, amountRange: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    style={{ color: 'white' }}
                  >
                    <option value="all" style={{ backgroundColor: '#1f2937', color: 'white' }}>All Amounts</option>
                    <option value="small" style={{ backgroundColor: '#1f2937', color: 'white' }}>Small (≤ $5)</option>
                    <option value="medium" style={{ backgroundColor: '#1f2937', color: 'white' }}>Medium ($5 - $25)</option>
                    <option value="large" style={{ backgroundColor: '#1f2937', color: 'white' }}>Large (&gt; $25)</option>
        </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Sort By</label>
                  <div className="flex space-x-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                      style={{ color: 'white' }}
                    >
                      <option value="date" style={{ backgroundColor: '#1f2937', color: 'white' }}>Date</option>
                      <option value="amount" style={{ backgroundColor: '#1f2937', color: 'white' }}>Amount</option>
                      <option value="type" style={{ backgroundColor: '#1f2937', color: 'white' }}>Type</option>
                      <option value="status" style={{ backgroundColor: '#1f2937', color: 'white' }}>Status</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
                </div>
              </div>

              {/* Custom Date Range */}
              {filterState.dateRange === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={filterState.startDate || ''}
                      onChange={(e) => setFilterState(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={filterState.endDate || ''}
                      onChange={(e) => setFilterState(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}

              {/* Custom Amount Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Min Amount (USDT)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filterState.minAmount || ''}
                    onChange={(e) => setFilterState(prev => ({ ...prev, minAmount: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Max Amount (USDT)</label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={filterState.maxAmount || ''}
                    onChange={(e) => setFilterState(prev => ({ ...prev, maxAmount: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
        <input
          type="text"
          placeholder="Search transactions by description, ID, or hash..."
          value={filterState.searchTerm}
          onChange={(e) => setFilterState(prev => ({ ...prev, searchTerm: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
        />
        {filterState.searchTerm && (
          <button
            onClick={() => setFilterState(prev => ({ ...prev, searchTerm: '' }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/60 text-sm">
          Showing {displayedTransactions.length} of {filteredTransactions.length} transactions
          {filteredTransactions.length !== realTransactions.length && (
            <span className="ml-2 text-yellow-400">
              (filtered from {realTransactions.length} total)
            </span>
          )}
        </div>
        {filteredTransactions.length > 0 && (
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-400">+${totalEarnings.toFixed(2)}</span>
            <span className="text-red-400">-${totalWithdrawals.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Activity-style List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-8 h-8 text-white/40 mx-auto mb-2" />
            <p className="text-white/60 text-base">No transactions found</p>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm"
              >
                Clear filters to see all transactions
              </button>
            )}
          </div>
        ) : (
          displayedTransactions.map((tx, index) => (
            <div key={tx.id} className="relative">
              <motion.div
                className={`flex items-center justify-between p-4 bg-white/10 border border-white/10 rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-200 ${
                  !isExpanded && index === 2 ? 'blur-sm opacity-60' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <div className={`p-3 rounded-full shadow-lg ${
                  tx.type === 'ad_earnings' ? 'bg-yellow-400/20' :
                  tx.type === 'referral' ? 'bg-green-500/20' :
                  tx.type === 'withdrawal' ? 'bg-red-500/20' :
                  tx.type === 'deposit' ? 'bg-blue-500/20' :
                  tx.type === 'vip_reward' ? 'bg-purple-500/20' :
                  'bg-gray-500/20'
                }`}>
                  {tx.type === 'ad_earnings' && <Play className="w-6 h-6 text-yellow-400" />}
                  {tx.type === 'referral' && <Gift className="w-6 h-6 text-green-400" />}
                  {tx.type === 'withdrawal' && <DollarSign className="w-6 h-6 text-red-400" />}
                  {tx.type === 'deposit' && <TrendingUp className="w-6 h-6 text-blue-400" />}
                  {tx.type === 'vip_reward' && <Crown className="w-6 h-6 text-purple-400" />}
                  {!['ad_earnings','referral','withdrawal','deposit','vip_reward'].includes(tx.type) && <Zap className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0 ml-4">
                  <p className="text-white text-base truncate">{tx.description}</p>
                  <p className="text-white/60 text-xs mt-1">{tx.type.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-white/40 text-xs mt-1">{formatDate(tx.timestamp)}</p>
                  {tx.transactionHash && (
                    <p className="text-blue-400 text-xs mt-1 break-all">Hash: {tx.transactionHash}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <span className={`font-bold text-base ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} USDT
                  </span>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
              
              {/* Show All Button Overlay for Third Transaction */}
              {!isExpanded && index === 2 && hasMoreTransactions && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center space-x-2 px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-xl shadow-black/20"
                  >
                    <span>Show All ({filteredTransactions.length})</span>
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>



      {/* Show Less Button */}
      {isExpanded && (
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            <span>Show Less</span>
            <ChevronUp className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionHistory; 