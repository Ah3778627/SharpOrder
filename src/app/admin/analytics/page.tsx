'use client';

import { useAuth } from '@/lib/auth-context';
import { OrderDB, AnalyticsDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Order } from '@/lib/database';

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user && user.storeId) {
      const analyticsData = AnalyticsDB.getStoreAnalytics(user.storeId);
      setAnalytics(analyticsData);

      const storeOrders = OrderDB.getByStore(user.storeId);
      setOrders(storeOrders);

      setLoading(false);
    }
  }, [user]);

  const getStatusStats = () => {
    const stats = {
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
    return stats;
  };

  const getProductStats = () => {
    const productStats: { [key: string]: { count: number; revenue: number } } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productStats[item.name]) {
          productStats[item.name] = { count: 0, revenue: 0 };
        }
        productStats[item.name].count += item.quantity;
        productStats[item.name].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const statusStats = getStatusStats();
  const productStats = getProductStats();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

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
                    <p className="text-3xl font-bold text-gray-900">${(analytics?.totalRevenue || 0).toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-1">+12% from last period</p>
                  </div>
                  <DollarSign size={40} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalOrders || 0}</p>
                    <p className="text-xs text-blue-600 mt-1">+8% from last period</p>
                  </div>
                  <ShoppingCart size={40} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-900">${(analytics?.avgOrderValue || 0).toFixed(2)}</p>
                    <p className="text-xs text-purple-600 mt-1">-2% from last period</p>
                  </div>
                  <TrendingUp size={40} className="text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.totalOrders ? ((analytics.totalOrders / 100) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Based on orders</p>
                  </div>
                  <BarChart3 size={40} className="text-orange-500" />
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
                    const percentage = analytics?.totalOrders ? ((count / analytics.totalOrders) * 100).toFixed(1) : 0;
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

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Top 5 Products</h2>
                {productStats.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No product data available</p>
                ) : (
                  <div className="space-y-4">
                    {productStats.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.count} units sold</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${product.revenue.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            {((product.revenue / (analytics?.totalRevenue || 1)) * 100).toFixed(1)}% of revenue
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders Summary</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Discount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-gray-600">{order.id.substring(0, 8)}</td>
                          <td className="py-3 px-4 text-gray-600">{order.items.length}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-green-600 font-medium">-${order.discount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
