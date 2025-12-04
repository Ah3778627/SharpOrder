export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'hats';
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}
export const products: Product[] = [];
