'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { Star, ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden transition-shadow duration-300 card">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold ${
              product.category === 'electronics' ? 'bg-black' : 'bg-gray-700'
            }`}
          >
            {product.category === 'electronics' ? 'Electronics' : 'Hat'}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-black line-clamp-2 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-muted text-sm mt-1 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Price and Action */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-black">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isAdded
                ? 'bg-green-500 text-white'
                : product.inStock
                  ? 'bg-black text-white hover:opacity-95'
                  : 'bg-gray-100 text-muted cursor-not-allowed'
            }`}
          >
            {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
