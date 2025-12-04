'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, ShoppingBag, Heart, User, BarChart3, Users, Store } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { user, logout, hasRole } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  if (!user) return null;

  const navItems = [
    { label: 'Home', href: '/', visible: true },
    { label: 'Products', href: '/products', visible: true },
    { label: 'Cart', href: '/cart', visible: hasRole('consumer') },
    { label: 'Wishlist', href: '/wishlist', visible: hasRole('consumer') },
    { label: 'Orders', href: '/consumer/orders', visible: hasRole('consumer') },
    { label: 'Admin Dashboard', href: '/admin/dashboard', visible: hasRole('admin') },
    { label: 'Admin Analytics', href: '/admin/analytics', visible: hasRole('admin') },
    { label: 'Admin Orders', href: '/admin/orders', visible: hasRole('admin') },
    { label: 'Super Admin', href: '/super-admin/dashboard', visible: hasRole('super_admin') },
    { label: 'Manage Admins', href: '/super-admin/admins', visible: hasRole('super_admin') },
    { label: 'System Analytics', href: '/super-admin/analytics', visible: hasRole('super_admin') },
  ];

  return (
    <nav className="bg-white border-b border-transparent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <ShoppingBag className="text-black" size={22} />
            <span className="text-lg font-semibold text-black">SharpOrder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map(
              (item) =>
                item.visible && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted hover:text-black transition"
                  >
                    {item.label}
                  </Link>
                )
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-semibold text-black">{user.name}</p>
              <p className="text-xs text-muted capitalize">{user.role.replace('_', ' ')}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:opacity-95 transition"
              >
                <User size={18} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                  >
                    <Settings size={16} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
