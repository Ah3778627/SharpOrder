"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Filter, Search } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  image?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  storeId?: string;
};

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const storeIdParam = searchParams.get('storeId');
  const initSearch = searchParams.get('search') || '';
  const initSort = searchParams.get('sort') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initSearch);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [sort, setSort] = useState<string>(initSort);

  const initPage = parseInt(searchParams.get('page') || '1', 10) || 1;
  const [page, setPage] = useState<number>(initPage);
  const [limit] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params: string[] = [];
    if (storeIdParam) params.push(`storeId=${encodeURIComponent(storeIdParam)}`);
    if (categoryFilter) params.push(`category=${encodeURIComponent(categoryFilter)}`);
    if (sort) params.push(`sort=${encodeURIComponent(sort)}`);
    if (debouncedSearch) params.push(`search=${encodeURIComponent(debouncedSearch)}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);

    const qs = params.length ? `?${params.join('&')}` : '';

    fetch(`/api/products${qs}`)
      .then((r) => r.json())
      .then((data: any) => {
        if (Array.isArray(data)) {
          setProducts(data as Product[]);
          setTotal(data.length);
          setTotalPages(1);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products as Product[]);
          setTotal(typeof data.total === 'number' ? data.total : data.products.length);
          setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 1);
        } else {
          setProducts([]);
          setTotal(0);
          setTotalPages(1);
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [storeIdParam, categoryFilter, page, limit, sort, debouncedSearch]);

  // debounce searchQuery -> debouncedSearch (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // persist debouncedSearch -> URL and reset page to 1
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // persist sort -> URL and refresh page 1
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (sort) {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // keep page state in sync with URL (detect back/forward)
  useEffect(() => {
    const sp = searchParams.get('page');
    const p = sp ? parseInt(sp, 10) : 1;
    const normalized = Number.isFinite(p) && p > 0 ? p : 1;
    if (normalized !== page) setPage(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // when category/storeId changes, reset page to 1 and update URL
  useEffect(() => {
    const current = parseInt(searchParams.get('page') || '1', 10) || 1;
    if (current !== 1) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, storeIdParam]);

  const filteredProducts = useMemo(() => {
    let result = products || [];

    // category is already filtered server-side; keep client-side search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {categoryFilter === 'electronics'
          ? '⚡ Electronics'
          : categoryFilter === 'hats'
            ? '🎩 Hand-Woven Hats'
            : storeIdParam
              ? 'Store Products'
              : 'All Products'}
      </h1>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Filter size={20} /> More Filters
          </button>

          <label className="text-sm text-gray-600">Sort:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1 border rounded"
          >
            <option value="">Relevance</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">Failed to load products</div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}

          {/* Pagination controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {total} products
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(next));
                  router.push(`${pathname}?${params.toString()}`);
                  setPage(next);
                }}
                disabled={page <= 1}
                className="px-3 py-1 rounded border bg-white disabled:opacity-50"
              >
                Previous
              </button>

              {/* Numbered page buttons with sliding window + first/last + ellipses */}
              {(() => {
                const maxButtons = 7; // must be odd for symmetry
                const half = Math.floor(maxButtons / 2);
                let start = Math.max(1, page - half);
                let end = Math.min(totalPages, page + half);
                // adjust window when near edges
                if (end - start + 1 < maxButtons) {
                  if (start === 1) {
                    end = Math.min(totalPages, start + maxButtons - 1);
                  } else if (end === totalPages) {
                    start = Math.max(1, end - maxButtons + 1);
                  }
                }

                const items: React.ReactNode[] = [];

                function pushPage(n: number, isFirstOrLast: boolean = false) {
                  items.push(
                    <button
                      key={`p-${n}`}
                      onClick={() => {
                        const params = new URLSearchParams(Array.from(searchParams.entries()));
                        params.set('page', String(n));
                        router.push(`${pathname}?${params.toString()}`);
                        setPage(n);
                      }}
                      aria-current={n === page ? 'page' : undefined}
                      className={`px-2 py-1 rounded border text-sm transition-colors ${
                        n === page
                          ? 'bg-slate-900 text-white'
                          : isFirstOrLast
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {n}
                    </button>
                  );
                }

                if (start > 1) {
                  pushPage(1, true);
                  if (start > 2) {
                    items.push(
                      <span key="e-start" className="px-1 text-gray-400 font-light">…</span>
                    );
                  }
                }

                for (let i = start; i <= end; i++) pushPage(i, false);

                if (end < totalPages) {
                  if (end < totalPages - 1) {
                    items.push(
                      <span key="e-end" className="px-1 text-gray-400 font-light">…</span>
                    );
                  }
                  pushPage(totalPages, true);
                }

                return items;
              })()}

              <div className="text-sm">
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => {
                  const next = Math.min(totalPages, page + 1);
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(next));
                  router.push(`${pathname}?${params.toString()}`);
                  setPage(next);
                }}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
