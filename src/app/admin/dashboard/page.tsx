'use client';

import { useAuth } from '@/lib/auth-context';
import { StoreDB, OrderDB, AnalyticsDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BarChart3, Package, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Order } from '@/lib/database';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [store, setStore] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.storeId) {
      const storeData = StoreDB.getById(user.storeId);
      setStore(storeData);

      const analyticsData = AnalyticsDB.getStoreAnalytics(user.storeId);
      setAnalytics(analyticsData);

      const orders = OrderDB.getByStore(user.storeId);
      setRecentOrders(orders.slice(0, 5));

      setLoading(false);
    }
  }, [user]);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        {store && <p className="text-gray-600 mb-8">Welcome back to {store.name}</p>}

        {loading ? (
          <div className="text-center py-12">Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalOrders || 0}</p>
                  </div>
                  <ShoppingCart size={40} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${(analytics?.totalRevenue || 0).toFixed(2)}</p>
                  </div>
                  <DollarSign size={40} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-900">${(analytics?.avgOrderValue || 0).toFixed(2)}</p>
                  </div>
                  <TrendingUp size={40} className="text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{store?.products?.length || 0}</p>
                  </div>
                  <Package size={40} className="text-orange-500" />
                </div>
              </div>
            </div>

            {/* Store Info Card */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Store Name</p>
                  <p className="text-lg font-semibold text-gray-900">{store?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Store ID</p>
                  <p className="text-sm font-mono text-gray-600">{store?.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm text-gray-900">{store?.description || 'No description'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`text-sm font-semibold ${store?.active ? 'text-green-600' : 'text-red-600'}`}>
                    {store?.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <a
                href="/admin/products"
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition"
              >
                <Package className="text-blue-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-600">Add, edit, or delete products</p>
              </a>

              <a
                href="/admin/orders"
                className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition"
              >
                <ShoppingCart className="text-green-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900">Manage Orders</p>
                <p className="text-sm text-gray-600">View and update order status</p>
              </a>

              <a
                href="/admin/analytics"
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition"
              >
                <BarChart3 className="text-purple-600 mb-2" size={24} />
                <p className="font-semibold text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">Detailed sales and revenue data</p>
              </a>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-gray-600">{order.id.substring(0, 8)}</td>
                          <td className="py-3 px-4 text-gray-900 font-semibold">${order.totalPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-gray-600">{order.items.length}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
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
              <a
                href="/admin/orders"
                className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View All Orders →
              </a>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
