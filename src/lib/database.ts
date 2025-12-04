// Simulated database layer using localStorage
// In production, replace with actual database (PostgreSQL, MongoDB, etc.)

export interface Order {
  id: string;
  consumerId: string;
  consumerEmail: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  discount: number;
  coupon?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  adminId: string;
  name: string;
  description: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  products: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    stock: number;
  }>;
  createdAt: string;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrders: Order[];
}

const DB_KEY = 'sharporder_db';

function getDB() {
  const stored = localStorage.getItem(DB_KEY);
  return stored ? JSON.parse(stored) : {
    orders: {},
    stores: {},
    blockedConsumers: [],
  };
}

function saveDB(db: any) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Orders
export const OrderDB = {
  create: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const db = getDB();
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.orders[newOrder.id] = newOrder;
    saveDB(db);
    return newOrder;
  },

  getById: (id: string): Order | null => {
    const db = getDB();
    return db.orders[id] || null;
  },

  getByConsumer: (consumerId: string): Order[] => {
    const db = getDB();
    return (Object.values(db.orders) as Order[]).filter(
      (o) => o.consumerId === consumerId
    );
  },

  getByStore: (storeId: string): Order[] => {
    const db = getDB();
    return (Object.values(db.orders) as Order[]).filter(
      (o) => o.storeId === storeId
    );
  },

  getAll: (): Order[] => {
    const db = getDB();
    return Object.values(db.orders) as Order[];
  },

  update: (id: string, updates: Partial<Order>): Order => {
    const db = getDB();
    const order = db.orders[id];
    if (!order) throw new Error('Order not found');
    
    const updated = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.orders[id] = updated;
    saveDB(db);
    return updated;
  },

  delete: (id: string) => {
    const db = getDB();
    delete db.orders[id];
    saveDB(db);
  },
};

// Stores
export const StoreDB = {
  create: (store: Omit<Store, 'id' | 'createdAt'>): Store => {
    const db = getDB();
    const newStore: Store = {
      ...store,
      id: `store_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.stores[newStore.id] = newStore;
    saveDB(db);
    return newStore;
  },

  getById: (id: string): Store | null => {
    const db = getDB();
    return db.stores[id] || null;
  },

  getByAdmin: (adminId: string): Store | null => {
    const db = getDB();
    return (Object.values(db.stores) as Store[]).find(
      (s) => s.adminId === adminId
    ) || null;
  },

  getAll: (): Store[] => {
    const db = getDB();
    return Object.values(db.stores) as Store[];
  },

  update: (id: string, updates: Partial<Store>): Store => {
    const db = getDB();
    const store = db.stores[id];
    if (!store) throw new Error('Store not found');
    
    const updated = { ...store, ...updates };
    db.stores[id] = updated;
    saveDB(db);
    return updated;
  },

  delete: (id: string) => {
    const db = getDB();
    delete db.stores[id];
    saveDB(db);
  },
};

// Blocked Consumers
export const BlockedConsumerDB = {
  add: (consumerId: string) => {
    const db = getDB();
    if (!db.blockedConsumers.includes(consumerId)) {
      db.blockedConsumers.push(consumerId);
      saveDB(db);
    }
  },

  remove: (consumerId: string) => {
    const db = getDB();
    db.blockedConsumers = db.blockedConsumers.filter((id: string) => id !== consumerId);
    saveDB(db);
  },

  isBlocked: (consumerId: string): boolean => {
    const db = getDB();
    return db.blockedConsumers.includes(consumerId);
  },

  getAll: (): string[] => {
    const db = getDB();
    return db.blockedConsumers;
  },
};

// Analytics
export const AnalyticsDB = {
  getStoreAnalytics: (storeId: string): Analytics => {
    const orders = OrderDB.getByStore(storeId);
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice - o.discount), 0);
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      recentOrders: orders.slice(-10),
    };
  },

  getSystemAnalytics: (): Analytics & { totalStores: number; totalConsumers: number; totalBlocked: number } => {
    const allOrders = OrderDB.getAll();
    const allStores = StoreDB.getAll();
    const blockedCount = BlockedConsumerDB.getAll().length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalPrice - o.discount), 0);
    const consumers = new Set(allOrders.map(o => o.consumerId)).size;

    return {
      totalOrders: allOrders.length,
      totalRevenue,
      averageOrderValue: allOrders.length > 0 ? totalRevenue / allOrders.length : 0,
      recentOrders: allOrders.slice(-20),
      totalStores: allStores.length,
      totalConsumers: consumers,
      totalBlocked: blockedCount,
    };
  },
};
