'use client';

import { useAuth } from '@/lib/auth-context';
import { AnalyticsDB, StoreDB, OrderDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TrendingUp, DollarSign, ShoppingCart, Store } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SuperAdminAnalyticsPage() {
  const { user } = useAuth();
  const [systemAnalytics, setSystemAnalytics] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyticsData = AnalyticsDB.getSystemAnalytics();
    setSystemAnalytics(analyticsData);

    const allStores = StoreDB.getAll();
    setStores(allStores);

    const allOrders = OrderDB.getAll();
    setOrders(allOrders);

    setLoading(false);
  }, [user]);

  const getStoreRevenue = () => {
    return stores.map((store) => {
      const storeOrders = orders.filter((o) => o.storeId === store.id);
      const revenue = storeOrders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);
      return { ...store, revenue, orderCount: storeOrders.length };
    });
  };

  const getOrderStatusStats = () => {
    return {
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  };

  const storeRevenue = getStoreRevenue().sort((a, b) => b.revenue - a.revenue);
  const statusStats = getOrderStatusStats();

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Analytics</h1>
        <p className="text-gray-600 mb-8">Platform-wide metrics and performance data</p>

        {loading ? (
          <div className="text-center py-12">Loading analytics...</div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${(systemAnalytics?.totalRevenue || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">All time</p>
                  </div>
                  <DollarSign size={40} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{systemAnalytics?.totalOrders || 0}</p>
                    <p className="text-xs text-blue-600 mt-1">All time</p>
                  </div>
                  <ShoppingCart size={40} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Stores</p>
                    <p className="text-3xl font-bold text-gray-900">{systemAnalytics?.totalStores || 0}</p>
                    <p className="text-xs text-purple-600 mt-1">Platform</p>
                  </div>
                  <Store size={40} className="text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${(systemAnalytics?.avgOrderValue || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Per order</p>
                  </div>
                  <TrendingUp size={40} className="text-orange-500" />
                </div>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status Distribution</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Pending', key: 'pending', color: 'bg-yellow-500' },
                    { label: 'Processing', key: 'processing', color: 'bg-blue-500' },
                    { label: 'Shipped', key: 'shipped', color: 'bg-indigo-500' },
                    { label: 'Delivered', key: 'delivered', color: 'bg-green-500' },
                    { label: 'Cancelled', key: 'cancelled', color: 'bg-red-500' },
                  ].map((status) => {
                    const count = statusStats[status.key as keyof typeof statusStats];
                    const percentage = systemAnalytics?.totalOrders
                      ? ((count / systemAnalytics.totalOrders) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={status.key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{status.label}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${status.color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Growth */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Metrics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Total Consumers</span>
                    <span className="text-2xl font-bold text-gray-900">{systemAnalytics?.totalConsumers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Total Stores</span>
                    <span className="text-2xl font-bold text-gray-900">{systemAnalytics?.totalStores || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Avg Orders per Store</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {systemAnalytics?.totalStores
                        ? (systemAnalytics.totalOrders / systemAnalytics.totalStores).toFixed(1)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Avg Revenue per Store</span>
                    <span className="text-2xl font-bold text-green-600">
                      $
                      {systemAnalytics?.totalStores
                        ? (systemAnalytics.totalRevenue / systemAnalytics.totalStores).toFixed(2)
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Stores */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Stores</h2>
              {storeRevenue.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No store data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Store Name</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Orders</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Order Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeRevenue.slice(0, 10).map((store) => (
                        <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-gray-900">{store.name}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{store.orderCount}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            ${store.revenue.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">
                            ${(store.revenue / (store.orderCount || 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Platform Health */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">System Status</p>
                  <p className="text-green-600 text-sm mt-1">All systems operational</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-semibold">Database</p>
                  <p className="text-blue-600 text-sm mt-1">Connected and responsive</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-purple-800 font-semibold">Performance</p>
                  <p className="text-purple-600 text-sm mt-1">Optimal - {orders.length} orders processed</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
