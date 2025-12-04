'use client';

import Link from 'next/link';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProducts = products.slice(0, 6);
  const electronics = products.filter((p) => p.category === 'electronics').slice(0, 4);
  const hats = products.filter((p) => p.category === 'hats').slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Shop Premium Products with Ease
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                Discover curated electronics and exquisite hand-woven hats. Shop with confidence, 
                style, and seamless checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 transition gap-2"
                >
                  Shop Now <ArrowRight size={20} />
                </Link>
                <div className="flex gap-2">
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 border-slate-900 text-slate-900 hover:bg-slate-50 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative w-full h-80 bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🛍️</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900">Featured Products</h2>
          <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition">
            View All <ArrowRight size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Electronics Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">⚡ Electronics</h2>
              <p className="text-slate-600 mt-2 text-lg">High-quality tech products for your needs</p>
            </div>
            <Link href="/products?category=electronics" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition">
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {electronics.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Hats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">🎩 Hand-Woven Hats</h2>
              <p className="text-slate-600 mt-2 text-lg">Exquisite handcrafted hats for style and comfort</p>
            </div>
            <Link href="/products?category=hats" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition">
              View All <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hats.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Free Shipping', desc: 'On orders over $50' },
              { title: '30-Day Returns', desc: 'Hassle-free returns policy' },
              { title: '24/7 Support', desc: 'Customer support team ready to help' },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
