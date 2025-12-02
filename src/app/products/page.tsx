import { Suspense } from 'react';
import ProductsContent from './content';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
