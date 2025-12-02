'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">⚡</div>
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">SharpOrder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/products?category=electronics" className="text-gray-700 hover:text-blue-600 transition">
              Electronics
            </Link>
            <Link href="/products?category=hats" className="text-gray-700 hover:text-blue-600 transition">
              Hand-Woven Hats
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
              All Products
            </Link>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products?category=electronics"
              className="block text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Electronics
            </Link>
            <Link
              href="/products?category=hats"
              className="block text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hand-Woven Hats
            </Link>
            <Link
              href="/products"
              className="block text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
