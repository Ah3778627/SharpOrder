'use client';

import { useAuth } from '@/lib/auth-context';
import { BlockedConsumerDB, OrderDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Lock, Unlock, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConsumerInfo {
  id: string;
  email: string;
  name: string;
  blocked: boolean;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function SuperAdminConsumersPage() {
  const { user } = useAuth();
  const [consumers, setConsumers] = useState<ConsumerInfo[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsumer, setSelectedConsumer] = useState<ConsumerInfo | null>(null);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load all users from localStorage
    const usersData = JSON.parse(localStorage.getItem('allUsers') || '[]');
    setAllUsers(usersData);

    // Filter for consumers
    const consumerUsers = usersData.filter((u: any) => u.role === 'consumer');
    const blockedList = BlockedConsumerDB.getAll();

    const consumerList = consumerUsers.map((consumer: any) => {
      const orders = OrderDB.getByConsumer(consumer.id);
      const totalSpent = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
      return {
        id: consumer.id,
        email: consumer.email,
        name: consumer.name,
        blocked: blockedList.includes(consumer.id),
        orderCount: orders.length,
        totalSpent: totalSpent,
        createdAt: consumer.createdAt || new Date().toISOString(),
      };
    });

    setConsumers(consumerList);
    setLoading(false);
  }, [user]);

  const filteredConsumers = consumers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = (consumerId: string, isCurrentlyBlocked: boolean) => {
    if (isCurrentlyBlocked) {
      BlockedConsumerDB.remove(consumerId);
      setSuccess('Consumer unblocked successfully');
    } else {
      BlockedConsumerDB.add(consumerId);
      setSuccess('Consumer blocked successfully');
    }

    // Update local state
    setConsumers(
      consumers.map((c) =>
        c.id === consumerId ? { ...c, blocked: !isCurrentlyBlocked } : c
      )
    );

    if (selectedConsumer?.id === consumerId) {
      setSelectedConsumer({ ...selectedConsumer, blocked: !isCurrentlyBlocked });
    }

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteConsumer = (consumerId: string) => {
    if (confirm('Are you sure you want to permanently delete this consumer account?')) {
      // Delete from users
      const updatedUsers = allUsers.filter((u) => u.id !== consumerId);
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));

      // Unblock if blocked
      BlockedConsumerDB.remove(consumerId);

      setConsumers(consumers.filter((c) => c.id !== consumerId));
      setSuccess('Consumer account deleted successfully');
      setSelectedConsumer(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Consumers</h1>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading consumers...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consumers List */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {filteredConsumers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    {searchTerm ? 'No consumers found matching your search' : 'No consumers found'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Consumer Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Orders</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Spent</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConsumers.map((consumer) => (
                          <tr key={consumer.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold text-gray-900">{consumer.name}</td>
                            <td className="py-3 px-4 text-gray-600 text-xs break-all">{consumer.email}</td>
                            <td className="py-3 px-4 text-center text-gray-600">{consumer.orderCount}</td>
                            <td className="py-3 px-4 text-center font-semibold text-gray-900">
                              ${consumer.totalSpent.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  consumer.blocked
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {consumer.blocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => setSelectedConsumer(consumer)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleToggleBlock(consumer.id, consumer.blocked)}
                                  className={`p-2 rounded ${
                                    consumer.blocked
                                      ? 'text-green-600 hover:bg-green-50'
                                      : 'text-orange-600 hover:bg-orange-50'
                                  }`}
                                  title={consumer.blocked ? 'Unblock' : 'Block'}
                                >
                                  {consumer.blocked ? <Unlock size={18} /> : <Lock size={18} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Consumer Details Panel */}
            <div>
              {selectedConsumer ? (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 sticky top-24">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Consumer Details</h2>
                    <button
                      onClick={() => setSelectedConsumer(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedConsumer.name}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm text-gray-700 break-all">{selectedConsumer.email}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Consumer ID</p>
                      <p className="text-xs font-mono text-gray-600 break-all">{selectedConsumer.id}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedConsumer.orderCount}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">${selectedConsumer.totalSpent.toFixed(2)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                      <p
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          selectedConsumer.blocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {selectedConsumer.blocked ? 'Blocked' : 'Active'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                      <p className="text-sm text-gray-600">{new Date(selectedConsumer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleToggleBlock(selectedConsumer.id, selectedConsumer.blocked)}
                      className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition ${
                        selectedConsumer.blocked
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      {selectedConsumer.blocked ? 'Unblock Consumer' : 'Block Consumer'}
                    </button>
                    <button
                      onClick={() => handleDeleteConsumer(selectedConsumer.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center sticky top-24">
                  <p className="text-gray-500">Select a consumer to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
