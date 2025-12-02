import { create } from 'zustand';
import { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// Valid coupon codes for demo
const VALID_COUPONS: Record<string, number> = {
  'SAVE10': 0.10,
  'SAVE20': 0.20,
  'WELCOME': 0.15,
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  couponCode: null,
  couponDiscount: 0,

  addToCart: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity }],
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [], couponCode: null, couponDiscount: 0 });
  },

  applyCoupon: (code) => {
    const discount = VALID_COUPONS[code.toUpperCase()];
    if (discount) {
      set({ couponCode: code.toUpperCase(), couponDiscount: discount });
      return true;
    }
    return false;
  },

  removeCoupon: () => {
    set({ couponCode: null, couponDiscount: 0 });
  },

  getTotalPrice: () => {
    const subtotal = get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return subtotal * (1 - get().couponDiscount);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));

// Wishlist store
interface WishlistStore {
  items: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addToWishlist: (productId) => {
    set((state) => ({
      items: [...new Set([...state.items, productId])],
    }));
  },

  removeFromWishlist: (productId) => {
    set((state) => ({
      items: state.items.filter((id) => id !== productId),
    }));
  },

  isInWishlist: (productId) => {
    return get().items.includes(productId);
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
