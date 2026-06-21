const bcrypt = require('bcrypt');

const db = {
  users: [],
  listings: [],
  messages: [],
  nextId: { users: 1, listings: 1, messages: 1 },
};

const seed = async () => {
  const hash = await bcrypt.hash('password123', 10);

  db.users.push(
    { id: 1, name: 'Alex', email: 'alex@example.com', password_hash: hash, location: 'Berlin' },
    { id: 2, name: 'Maria', email: 'maria@example.com', password_hash: hash, location: 'Munich' },
    { id: 3, name: 'Jonas', email: 'jonas@example.com', password_hash: hash, location: 'Hamburg' }
  );
  db.nextId.users = 4;

  db.listings.push(
    { id: 1, title: 'iPhone 14 Pro Max 256GB', brand: 'Apple', model: 'iPhone 14 Pro Max', price: 750, condition: 'Like New', storage: '256GB', color: 'Black', description: 'Bought Jan 2023, used 8 months. No scratches, always had a case. Original box included.', location: 'Berlin', status: 'active', views: 128, seller_id: 1, image: '/images/iphone_14_pro_max.webp', created_at: new Date('2024-01-15') },
    { id: 2, title: 'Samsung Galaxy S23 Ultra', brand: 'Samsung', model: 'Galaxy S23 Ultra', price: 680, condition: 'Good', storage: '512GB', color: 'Black', description: 'Great phone, minor wear on back. S-pen included. Battery health 91%.', location: 'Munich', status: 'active', views: 94, seller_id: 2, image: '/images/samsung_s23_ultra.webp', created_at: new Date('2024-01-20') },
    { id: 3, title: 'Google Pixel 7 Pro', brand: 'Google', model: 'Pixel 7 Pro', price: 480, condition: 'Good', storage: '128GB', color: 'Black', description: 'Excellent camera phone. Small scratch on corner, not visible with case. Unlocked.', location: 'Hamburg', status: 'active', views: 67, seller_id: 3, image: '/images/google_pixel_7_pro.jpeg', created_at: new Date('2024-02-01') },
    { id: 4, title: 'iPhone 13 128GB', brand: 'Apple', model: 'iPhone 13', price: 420, condition: 'Good', storage: '128GB', color: 'Blue', description: 'Well maintained, battery at 88%. Comes with original accessories.', location: 'Berlin', status: 'active', views: 210, seller_id: 1, image: '/images/iphone_13.jpg', created_at: new Date('2024-02-05') },
    { id: 5, title: 'OnePlus 11 256GB', brand: 'OnePlus', model: 'OnePlus 11', price: 390, condition: 'Like New', storage: '256GB', color: 'Black', description: 'Used for 3 months only. Comes with original box and 100W charger.', location: 'Munich', status: 'active', views: 45, seller_id: 2, image: '/images/oneplus_11.jpg', created_at: new Date('2024-02-10') },
    { id: 6, title: 'Samsung Galaxy A54', brand: 'Samsung', model: 'Galaxy A54', price: 220, condition: 'Fair', storage: '128GB', color: 'Black', description: 'Minor wear on back but screen is perfect. Everything works flawlessly.', location: 'Hamburg', status: 'active', views: 33, seller_id: 3, image: '/images/samsung_a54.webp', created_at: new Date('2024-02-12') }
  );
  db.nextId.listings = 7;
};

seed();
module.exports = db;
