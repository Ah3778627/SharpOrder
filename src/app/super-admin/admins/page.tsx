'use client';

import { useAuth } from '@/lib/auth-context';
import { StoreDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Trash2, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminInfo {
  id: string;
  email: string;
  name: string;
  storeId: string;
  storeName: string;
  createdAt: string;
}

export default function SuperAdminManageAdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminInfo | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load all users from localStorage
    const usersData = JSON.parse(localStorage.getItem('allUsers') || '[]');
    setAllUsers(usersData);

    // Filter for admins
    const adminUsers = usersData.filter((u: any) => u.role === 'admin');
    const adminList = adminUsers.map((admin: any) => {
      const store = StoreDB.getById(admin.storeId);
      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        storeId: admin.storeId,
        storeName: store?.name || 'No Store',
        createdAt: admin.createdAt || new Date().toISOString(),
      };
    });

    setAdmins(adminList);
    setLoading(false);
  }, [user]);

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin and their store? This action cannot be undone.')) {
      // Find the admin
      const adminToDelete = admins.find((a) => a.id === adminId);
      if (adminToDelete) {
        // Delete the store
        try {
          StoreDB.delete(adminToDelete.storeId);
        } catch (e) {
          // Store may not exist
        }

        // Delete the admin user
        const updatedUsers = allUsers.filter((u) => u.id !== adminId);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));

        setAdmins(admins.filter((a) => a.id !== adminId));
        setSuccess('Admin and associated store deleted successfully');
        setSelectedAdmin(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Admins</h1>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No admins found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Admins List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Admin Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Store</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-gray-900">{admin.name}</td>
                          <td className="py-3 px-4 text-gray-600">{admin.email}</td>
                          <td className="py-3 px-4 text-gray-600">{admin.storeName}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setSelectedAdmin(admin)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Delete Admin"
                              >
                                <Trash2 size={18} />
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

            {/* Admin Details Panel */}
            <div>
              {selectedAdmin ? (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 sticky top-24">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Details</h2>
                    <button
                      onClick={() => setSelectedAdmin(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedAdmin.name}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm text-gray-700 break-all">{selectedAdmin.email}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Admin ID</p>
                      <p className="text-xs font-mono text-gray-600 break-all">{selectedAdmin.id}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Store Name</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedAdmin.storeName}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Store ID</p>
                      <p className="text-xs font-mono text-gray-600 break-all">{selectedAdmin.storeId}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                      <p className="text-sm text-gray-600">{new Date(selectedAdmin.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAdmin(selectedAdmin.id)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                  >
                    Delete Admin & Store
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center sticky top-24">
                  <p className="text-gray-500">Select an admin to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
