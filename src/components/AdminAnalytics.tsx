import React, { useState, useEffect } from 'react';

interface AdAnalytics {
  id: string;
  title: string;
  views: number;
  earnings: number;
  completionRate: number;
  averageWatchTime: number;
  createdAt: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}

interface UserAnalytics {
  id: string;
  email: string;
  totalEarnings: number;
  adsWatched: number;
  isVIP: boolean;
  lastActive: string;
  joinDate: string;
}

const AdminAnalytics: React.FC = () => {
  const [ads, setAds] = useState<AdAnalytics[]>([]);
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [showScheduling, setShowScheduling] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdAnalytics | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeframe]);

  const loadAnalytics = () => {
    const adsData = JSON.parse(localStorage.getItem('ads') || '[]');
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');

    // Calculate analytics for ads
    const adsWithAnalytics = adsData.map((ad: any) => ({
      id: ad.id,
      title: ad.title,
      views: ad.views || 0,
      earnings: (ad.views || 0) * (ad.reward || 0),
      completionRate: ad.completionRate || 85,
      averageWatchTime: ad.averageWatchTime || 45,
      createdAt: ad.createdAt,
      scheduledStart: ad.scheduledStart,
      scheduledEnd: ad.scheduledEnd
    }));

    // Calculate analytics for users
    const usersWithAnalytics = usersData.map((user: any) => ({
      id: user.id,
      email: user.email,
      totalEarnings: user.totalEarnings || 0,
      adsWatched: user.adsWatched || 0,
      isVIP: user.isVIP || false,
      lastActive: user.lastActive || new Date().toISOString(),
      joinDate: user.joinDate || new Date().toISOString()
    }));

    setAds(adsWithAnalytics);
    setUsers(usersWithAnalytics);
  };

  const getTotalStats = () => {
    const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
    const totalEarnings = ads.reduce((sum, ad) => sum + ad.earnings, 0);
    const totalUsers = users.length;
    const vipUsers = users.filter(user => user.isVIP).length;
    const averageCompletionRate = ads.length > 0 ? ads.reduce((sum, ad) => sum + ad.completionRate, 0) / ads.length : 0;

    return {
      totalViews,
      totalEarnings,
      totalUsers,
      vipUsers,
      averageCompletionRate: Math.round(averageCompletionRate)
    };
  };

  const handleScheduleAd = (ad: AdAnalytics) => {
    setSelectedAd(ad);
    setShowScheduling(true);
  };

  const handleSaveSchedule = (startDate: string, endDate: string) => {
    if (!selectedAd) return;

    const adsData = JSON.parse(localStorage.getItem('ads') || '[]');
    const updatedAds = adsData.map((ad: any) => 
      ad.id === selectedAd.id 
        ? { ...ad, scheduledStart: startDate, scheduledEnd: endDate }
        : ad
    );
    
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    loadAnalytics();
    setShowScheduling(false);
    setSelectedAd(null);
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Analytics</h1>
            <p className="text-gray-400">Comprehensive platform insights and performance metrics</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400 mb-2">{stats.totalViews.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Views</div>
            <div className="text-green-400 text-xs mt-2">+12% vs last period</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400 mb-2">{stats.totalEarnings.toFixed(2)} USDT</div>
            <div className="text-gray-400 text-sm">Total Earnings</div>
            <div className="text-green-400 text-xs mt-2">+8% vs last period</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-purple-400 mb-2">{stats.totalUsers}</div>
            <div className="text-gray-400 text-sm">Total Users</div>
            <div className="text-green-400 text-xs mt-2">+5% vs last period</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.vipUsers}</div>
            <div className="text-gray-400 text-sm">VIP Users</div>
            <div className="text-green-400 text-xs mt-2">+15% vs last period</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-orange-400 mb-2">{stats.averageCompletionRate}%</div>
            <div className="text-gray-400 text-sm">Avg Completion</div>
            <div className="text-green-400 text-xs mt-2">+3% vs last period</div>
          </div>
        </div>

        {/* Ad Analytics Table */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Ad Performance Analytics</h2>
            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Manage Ads
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Ad Title</th>
                  <th className="text-left py-3 px-4">Views</th>
                  <th className="text-left py-3 px-4">Earnings</th>
                  <th className="text-left py-3 px-4">Completion Rate</th>
                  <th className="text-left py-3 px-4">Avg Watch Time</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4">{ad.title}</td>
                    <td className="py-3 px-4">{ad.views.toLocaleString()}</td>
                    <td className="py-3 px-4">{ad.earnings.toFixed(2)} USDT</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: `${ad.completionRate}%` }}
                          />
                        </div>
                        <span>{ad.completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{ad.averageWatchTime}s</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ad.scheduledStart && ad.scheduledEnd 
                          ? 'bg-yellow-600 text-yellow-100' 
                          : 'bg-green-600 text-green-100'
                      }`}>
                        {ad.scheduledStart && ad.scheduledEnd ? 'Scheduled' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleScheduleAd(ad)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Analytics */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">User Analytics</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Total Earnings</th>
                  <th className="text-left py-3 px-4">Ads Watched</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Last Active</th>
                  <th className="text-left py-3 px-4">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.totalEarnings.toFixed(2)} USDT</td>
                    <td className="py-3 px-4">{user.adsWatched}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isVIP ? 'bg-purple-600 text-purple-100' : 'bg-gray-600 text-gray-100'
                      }`}>
                        {user.isVIP ? 'VIP' : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center">
              <p className="text-gray-400">Chart placeholder - Revenue over time</p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center">
              <p className="text-gray-400">Chart placeholder - User growth over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling Modal */}
      {showScheduling && selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Schedule Ad: {selectedAd.title}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  defaultValue={selectedAd.scheduledStart || ''}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  defaultValue={selectedAd.scheduledEnd || ''}
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setShowScheduling(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const startInput = document.querySelector('input[type="datetime-local"]:first-of-type') as HTMLInputElement;
                  const endInput = document.querySelector('input[type="datetime-local"]:last-of-type') as HTMLInputElement;
                  handleSaveSchedule(startInput.value, endInput.value);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics; 