'use client';

import { useAuth } from '@/lib/auth-context';
import { OrderDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Order } from '@/lib/database';

export default function ConsumerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setOrders(OrderDB.getByConsumer(user.id));
      setLoading(false);
    }
  }, [user]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'processing':
        return <Package className="text-blue-500" size={20} />;
      case 'shipped':
        return <Truck className="text-indigo-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <ProtectedRoute requiredRole="consumer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        {loading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{order.id}</p>
                    <p className="font-semibold text-gray-900">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-lg font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discount</p>
                    <p className="text-lg font-bold text-green-600">-${order.discount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  {order.coupon && (
                    <div>
                      <p className="text-sm text-gray-500">Coupon Applied</p>
                      <p className="text-sm font-semibold text-blue-600">{order.coupon}</p>
                    </div>
                  )}
                </div>

                <details className="cursor-pointer">
                  <summary className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View Items ({order.items.length})
                  </summary>
                  <ul className="mt-3 space-y-2 text-sm">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-gray-600">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
