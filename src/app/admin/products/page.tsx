'use client';

import { useAuth } from '@/lib/auth-context';
import { StoreDB } from '@/lib/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Package, Trash2, Edit2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  storeId?: string;
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && user.storeId) {
      const storeData = StoreDB.getById(user.storeId);
      setStore(storeData);
      // fetch products for this store from server
      fetch(`/api/products?storeId=${encodeURIComponent(user.storeId)}`)
        .then((r) => r.json())
        .then((list: Product[]) => {
          setProducts(list || []);
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAddProduct = () => {
    setError('');

    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      setError('All fields are required');
      return;
    }

    const id = editingId ? editingId : `prod_${Date.now()}`;
    const newProduct: Product = {
      id,
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      stock: parseInt(formData.stock),
      storeId: user?.storeId,
    };

    // Send to server API first: POST for new, PUT for edit
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = '/api/products' + (editingId ? '' : '');
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: newProduct }),
    })
      .then((res) => res.json())
      .then((created) => {
        if (created && created.id) {
          if (editingId) {
            // If editing, update via PUT response
            setProducts(products.map((p) => (p.id === editingId ? { ...created, id: editingId } : p)));
            setSuccess('Product updated successfully');
            setEditingId(null);
          } else {
            setProducts([...products, created]);
            setSuccess('Product added successfully');
          }

          // Update store in local simulated DB so client reflects the change
          if (user && user.storeId) {
            const updatedStore = { ...store, products: editingId ? products.map(p => p.id === editingId ? {...created, id: editingId} : p) : [...products, created] };
            StoreDB.update(user.storeId, updatedStore);
            setStore(updatedStore);
          }

          setFormData({ name: '', price: '', description: '', category: '', stock: '' });
          setShowForm(false);
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to save product');
        }
      })
      .catch(() => setError('Failed to save product'));
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
        // Call server API to delete (include storeId to ensure scoping)
        const storeId = user?.storeId;
        if (!storeId) {
          setError('Store not found');
          return;
        }
        fetch(`/api/products?id=${encodeURIComponent(id)}&storeId=${encodeURIComponent(storeId)}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((resp) => {
          if (resp && resp.success) {
            const updatedProducts = products.filter((p) => p.id !== id);
            setProducts(updatedProducts);
            if (user && user.storeId) {
              const updatedStore = { ...store, products: updatedProducts };
              StoreDB.update(user.storeId, updatedStore);
              setStore(updatedStore);
            }
            setSuccess('Product deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setError('Failed to delete product');
          }
        })
        .catch(() => setError('Failed to delete product'));
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: '', price: '', description: '', category: '', stock: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <>
            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Books">Books</option>
                      <option value="Food">Food</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', price: '', description: '', category: '', stock: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Products Table */}
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No products yet. Click "Add Product" to get started.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-gray-900">{product.name}</td>
                          <td className="py-3 px-4 text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 text-gray-900 font-semibold">${product.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-gray-600">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
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
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
