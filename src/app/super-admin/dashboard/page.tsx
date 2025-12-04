'use client';

import { useAuth } from '@/lib/auth-context';
import { StoreDB, AnalyticsDB, BlockedConsumerDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BarChart3, Users, Store, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SuperAdminDashboardPage() {
  const { user } = useAuth();
  const [systemAnalytics, setSystemAnalytics] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyticsData = AnalyticsDB.getSystemAnalytics();
    setSystemAnalytics(analyticsData);

    const allStores = StoreDB.getAll();
    setStores(allStores);

    const blocked = BlockedConsumerDB.getAll();
    setBlockedCount(blocked.length);

    setLoading(false);
  }, [user]);

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">System-wide analytics and management</p>

        {loading ? (
          <div className="text-center py-12">Loading dashboard...</div>
        ) : (
          <>
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Stores</p>
                    <p className="text-3xl font-bold text-gray-900">{systemAnalytics?.totalStores || 0}</p>
                  </div>
                  <Store size={40} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Consumers</p>
                    <p className="text-3xl font-bold text-gray-900">{systemAnalytics?.totalConsumers || 0}</p>
                  </div>
                  <Users size={40} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">System Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${(systemAnalytics?.totalRevenue || 0).toFixed(2)}</p>
                  </div>
                  <BarChart3 size={40} className="text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Blocked Consumers</p>
                    <p className="text-3xl font-bold text-gray-900">{blockedCount}</p>
                  </div>
                  <AlertCircle size={40} className="text-red-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <a
                href="/super-admin/admins"
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition"
              >
                <Users className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900">Manage Admins</p>
                <p className="text-sm text-gray-600">View and manage admin accounts</p>
              </a>

              <a
                href="/super-admin/consumers"
                className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition"
              >
                <AlertCircle className="text-green-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900">Manage Consumers</p>
                <p className="text-sm text-gray-600">Block or unblock consumers</p>
              </a>

              <a
                href="/super-admin/analytics"
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition"
              >
                <BarChart3 className="text-purple-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900">System Analytics</p>
                <p className="text-sm text-gray-600">Platform-wide metrics</p>
              </a>
            </div>

            {/* Active Stores */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Stores</h2>
              {stores.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No stores created yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stores.map((store) => (
                    <div key={store.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <p className="font-semibold text-gray-900">{store.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{store.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Admin: {store.adminId}</span>
                        <span className={`px-2 py-1 rounded ${store.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {store.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Platform Status</span>
                    <span className="text-green-600 font-semibold">Operational</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Database</span>
                    <span className="text-green-600 font-semibold">Connected</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">API Services</span>
                    <span className="text-green-600 font-semibold">Running</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Last Updated</span>
                    <span className="text-gray-600 text-sm">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Total Orders</span>
                    <span className="font-semibold text-gray-900">{systemAnalytics?.totalOrders || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Avg Order Value</span>
                    <span className="font-semibold text-gray-900">${(systemAnalytics?.avgOrderValue || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Conversion Rate</span>
                    <span className="font-semibold text-gray-900">
                      {systemAnalytics?.totalOrders ? ((systemAnalytics.totalOrders / 100) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Active Admins</span>
                    <span className="font-semibold text-gray-900">{stores.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
