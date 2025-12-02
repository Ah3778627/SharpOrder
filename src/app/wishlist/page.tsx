'use client';

import Link from 'next/link';
import { products } from '@/lib/products';
import { useWishlistStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Heart } from 'lucide-react';

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((state) => state.items);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-8">
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart size={32} className="text-red-500 fill-red-500" />
          <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
        </div>
        <p className="text-gray-600">
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Start adding products to save them for later</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
