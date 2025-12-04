// Hook to initialize demo users on first load
export function initializeDemoUsers() {
  const existingUsers = localStorage.getItem('allUsers');
  
  if (!existingUsers || JSON.parse(existingUsers).length === 0) {
    const demoUsers = [
      {
        id: 'consumer_1',
        email: 'demo@consumer.com',
        password: 'pass123',
        name: 'Demo Consumer',
        role: 'consumer',
        createdAt: new Date().toISOString(),
        blocked: false,
      },
      {
        id: 'admin_1',
        email: 'demo@admin.com',
        password: 'pass123',
        name: 'Demo Admin',
        role: 'admin',
        storeId: 'store_1',
        createdAt: new Date().toISOString(),
        blocked: false,
      },
      {
        id: 'superadmin_1',
        email: 'demo@superadmin.com',
        password: 'pass123',
        name: 'Demo Super Admin',
        role: 'super_admin',
        createdAt: new Date().toISOString(),
        blocked: false,
      },
    ];

    localStorage.setItem('allUsers', JSON.stringify(demoUsers));
  }

  // Initialize demo store
  const existingDb = localStorage.getItem('sharporder_db');
  if (!existingDb || JSON.parse(existingDb).stores['store_1'] === undefined) {
    const db = existingDb ? JSON.parse(existingDb) : { orders: {}, stores: {}, blockedConsumers: [] };
    
    db.stores['store_1'] = {
      id: 'store_1',
      name: 'Demo Store',
      description: 'Welcome to our demo store! Browse our products and place orders.',
      adminId: 'admin_1',
      active: true,
      products: [
        {
          id: 'prod_1',
          name: 'Wireless Headphones',
          price: 79.99,
          description: 'Premium quality wireless headphones with noise cancellation',
          category: 'Electronics',
          stock: 25,
        },
        {
          id: 'prod_2',
          name: 'USB-C Cable',
          price: 12.99,
          description: 'Durable 6ft USB-C charging and data cable',
          category: 'Electronics',
          stock: 100,
        },
        {
          id: 'prod_3',
          name: 'Hand-Woven Hat',
          price: 34.99,
          description: 'Beautifully crafted hand-woven straw hat',
          category: 'Clothing',
          stock: 15,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('sharporder_db', JSON.stringify(db));
  }
}
