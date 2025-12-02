import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  getTotalPrice: () => number;
}

const VALID_COUPONS: { [key: string]: number } = {
  SAVE10: 10,
  SAVE20: 20,
  WELCOME: 15,
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  couponCode: '',
  couponDiscount: 0,

  addToCart: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { ...product, quantity, id: product.id || Math.random().toString() },
        ],
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0 }),

  applyCoupon: (code) => {
    const discount = VALID_COUPONS[code];
    if (discount) {
      set({ couponCode: code, couponDiscount: discount });
    }
  },

  removeCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

  getTotalPrice: () => {
    const state = get();
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * state.couponDiscount) / 100;
    return subtotal - discountAmount;
  },
}));

interface WishlistState {
  items: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addToWishlist: (productId) => {
    set((state) => ({
      items: state.items.includes(productId) ? state.items : [...state.items, productId],
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

  clearWishlist: () => set({ items: [] }),
}));
