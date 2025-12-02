"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { useWishlistStore } from "@/lib/store";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/components/Toast";

export default function WishlistPage() {
  const wishlist = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addToCart = useCartStore((s) => s.addToCart);
  const addToast = useToastStore((s) => s.addToast);

  const items = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addToCart(product, 1);
    addToast(`${product.name} added to cart`, "success");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-gray-600 mb-8">You haven't added any items yet.</p>
        <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />
            <div className="mt-2 flex gap-2 justify-between">
              <button
                onClick={() => handleAddToCart(product.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add to cart
              </button>
              <button
                onClick={() => { removeFromWishlist(product.id); addToast(`${product.name} removed`, 'info'); }}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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
