'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { Star, ShoppingCart, Check, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-[400px] md:h-[500px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>

          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold mb-4 ${
                product.category === 'electronics' ? 'bg-blue-500' : 'bg-purple-500'
              }`}
            >
              {product.category === 'electronics' ? '⚡ Electronics' : '🎩 Hat'}
            </span>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-gray-700 text-lg mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              {product.price > 50 && (
                <p className="text-green-600 text-sm mt-2">✓ Free shipping on this item</p>
              )}
            </div>

            <div className="mb-6">
              {product.inStock ? (
                <p className="text-green-600 font-semibold">✓ In Stock</p>
              ) : (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>

            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={20} /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Why Choose This Product?</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ High quality and durability</li>
                <li>✓ 30-day money-back guarantee</li>
                <li>✓ Fast and secure shipping</li>
                <li>✓ Excellent customer reviews</li>
              </ul>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{p.name}</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-2">${p.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
