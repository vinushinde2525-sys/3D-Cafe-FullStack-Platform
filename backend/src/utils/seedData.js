require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Coupon = require('../models/Coupon');
const Inventory = require('../models/Inventory');

const users = [
  { name: 'Admin User', email: 'admin@cafe3d.com', password: 'Admin@1234', role: 'admin', isVerified: true },
  { name: 'Staff Member', email: 'staff@cafe3d.com', password: 'Staff@1234', role: 'staff', isVerified: true },
  { name: 'John Doe', email: 'customer@cafe3d.com', password: 'Customer@1234', role: 'customer', isVerified: true },
];

const foodItems = [
  { name: 'Espresso Royale', description: 'Rich, bold espresso with a golden crema, sourced from Ethiopian single-origin beans. A perfect morning ritual.', price: 180, category: 'Coffee', isVegetarian: true, isFeatured: true, isSpecial: true, preparationTime: 5, rating: 4.8, reviewCount: 124, orderCount: 890, tags: ['bestseller', 'hot', 'strong'], nutrition: { calories: 5, protein: 0, carbs: 0, fat: 0 }, images: [{ url: '/images/grilli/hero-bg.jpg', publicId: 'seed_1' }] },
  { name: 'Caramel Cloud Latte', description: 'Velvety steamed oat milk layered over espresso with housemade caramel drizzle and a dusting of fleur de sel.', price: 320, discountPrice: 280, category: 'Coffee', isVegetarian: true, isFeatured: true, preparationTime: 8, rating: 4.9, reviewCount: 230, orderCount: 1200, tags: ['popular', 'sweet', 'cold-friendly'], images: [{ url: '/images/grilli/service-1.jpg', publicId: 'seed_2' }] },
  { name: 'Wagyu Smash Burger', description: 'Double wagyu beef smash patties, aged cheddar, crispy shallots, truffle aioli on a toasted brioche bun.', price: 680, category: 'Burgers', isFeatured: true, isSpecial: true, preparationTime: 18, rating: 4.7, reviewCount: 87, orderCount: 560, tags: ['premium', 'meaty', 'indulgent'], images: [{ url: '/images/foodie/hero-bg.jpg', publicId: 'seed_3' }] },
  { name: 'Truffle Margherita Pizza', description: 'San Marzano tomatoes, buffalo mozzarella, fresh basil, black truffle oil on a stone-baked sourdough crust.', price: 820, category: 'Pizza', isFeatured: true, preparationTime: 22, rating: 4.6, reviewCount: 63, orderCount: 340, tags: ['vegetarian', 'premium', 'wood-fired'], isVegetarian: true, images: [{ url: '/images/grilli/service-3.jpg', publicId: 'seed_4' }] },
  { name: 'Matcha Ceremonial Latte', description: 'Premium ceremonial-grade Japanese matcha whisked with steamed almond milk, lightly sweetened with honey.', price: 290, category: 'Tea', isVegetarian: true, isVegan: true, preparationTime: 7, rating: 4.5, reviewCount: 45, orderCount: 280, tags: ['healthy', 'antioxidant', 'trending'], images: [{ url: '/images/grilli/service-2.jpg', publicId: 'seed_5' }] },
  { name: 'Tiramisu Classico', description: 'Authentic Italian tiramisu with mascarpone cream, espresso-soaked savoiardi, fine cocoa powder.', price: 380, category: 'Desserts', isVegetarian: true, isFeatured: true, preparationTime: 5, rating: 4.9, reviewCount: 156, orderCount: 720, tags: ['classic', 'sweet', 'italian'], images: [{ url: '/images/grilli/about.jpg', publicId: 'seed_6' }] },
  { name: 'Avocado Club Sandwich', description: 'Toasted sourdough, smashed avocado, grilled chicken, sun-dried tomatoes, pesto mayo, microgreens.', price: 450, category: 'Sandwiches', preparationTime: 12, rating: 4.4, reviewCount: 38, orderCount: 195, tags: ['healthy', 'light', 'lunch'], images: [{ url: '/images/foodie/about.jpg', publicId: 'seed_7' }] },
  { name: 'Cold Brew Float', description: 'Slow-steeped 18-hour cold brew topped with vanilla bean ice cream and a salted caramel swirl.', price: 350, category: 'Beverages', isVegetarian: true, preparationTime: 3, rating: 4.7, reviewCount: 92, orderCount: 480, tags: ['cold', 'refreshing', 'summer'], images: [{ url: '/images/grilli/menu-1.jpg', publicId: 'seed_8' }] },
  { name: 'Penne Arrabbiata', description: 'Al dente penne pasta in a fiery San Marzano tomato sauce with garlic, chilli, parsley and pecorino.', price: 480, category: 'Pasta', isVegetarian: true, isSpicy: true, preparationTime: 20, rating: 4.3, reviewCount: 27, orderCount: 143, tags: ['spicy', 'italian', 'vegetarian'], images: [{ url: '/images/grilli/menu-2.jpg', publicId: 'seed_9' }] },
  { name: 'Full Café Breakfast', description: 'Two eggs your way, turkey bacon, grilled mushrooms, sourdough toast, roasted cherry tomatoes, baked beans.', price: 620, category: 'Breakfast', preparationTime: 20, rating: 4.6, reviewCount: 74, orderCount: 315, tags: ['filling', 'morning', 'classic'], images: [{ url: '/images/grilli/menu-3.jpg', publicId: 'seed_10' }] },
  { name: 'Mango Sunrise Smoothie', description: 'Alphonso mango, passionfruit, coconut water, turmeric, and a squeeze of lime. Zero added sugar.', price: 260, category: 'Beverages', isVegetarian: true, isVegan: true, isGlutenFree: true, preparationTime: 5, rating: 4.5, reviewCount: 51, orderCount: 267, tags: ['healthy', 'vegan', 'refreshing'], images: [{ url: '/images/foodie/menu-1.jpg', publicId: 'seed_11' }] },
  { name: 'Burnt Basque Cheesecake', description: 'Creamy, custardy centre with a deeply caramelised top. Served slightly warm with fresh berries.', price: 340, category: 'Desserts', isVegetarian: true, preparationTime: 5, rating: 4.8, reviewCount: 108, orderCount: 590, tags: ['trending', 'sweet', 'bestseller'], isSpecial: true, images: [{ url: '/images/foodie/menu-2.jpg', publicId: 'seed_12' }] },
];

const coupons = [
  { code: 'WELCOME20', description: '20% off your first order', discountType: 'percentage', discountValue: 20, minOrderAmount: 300, maxDiscountAmount: 200, usageLimit: 1000, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  { code: 'FLAT100', description: '₹100 off on orders above ₹800', discountType: 'fixed', discountValue: 100, minOrderAmount: 800, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
  { code: 'FREESHIP', description: 'Free delivery on any order', discountType: 'fixed', discountValue: 40, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
];

const inventoryItems = [
  { ingredient: 'Arabica Coffee Beans', unit: 'kg', currentStock: 25, minimumStock: 5, costPerUnit: 1200, category: 'dry_goods' },
  { ingredient: 'Whole Milk', unit: 'liter', currentStock: 30, minimumStock: 10, costPerUnit: 65, category: 'dairy' },
  { ingredient: 'Oat Milk', unit: 'liter', currentStock: 8, minimumStock: 5, costPerUnit: 120, category: 'dairy' },
  { ingredient: 'Eggs', unit: 'dozen', currentStock: 6, minimumStock: 3, costPerUnit: 90, category: 'dairy' },
  { ingredient: 'Wagyu Beef Patties', unit: 'kg', currentStock: 4, minimumStock: 2, costPerUnit: 2200, category: 'meat' },
  { ingredient: 'Sourdough Bread', unit: 'pieces', currentStock: 3, minimumStock: 10, costPerUnit: 80, category: 'dry_goods' },
  { ingredient: 'Mascarpone Cheese', unit: 'kg', currentStock: 5, minimumStock: 2, costPerUnit: 650, category: 'dairy' },
  { ingredient: 'San Marzano Tomatoes', unit: 'kg', currentStock: 12, minimumStock: 4, costPerUnit: 180, category: 'produce' },
  { ingredient: 'Vanilla Ice Cream', unit: 'liter', currentStock: 6, minimumStock: 3, costPerUnit: 280, category: 'dairy' },
  { ingredient: 'Alphonso Mango', unit: 'kg', currentStock: 10, minimumStock: 5, costPerUnit: 160, category: 'produce' },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...');

    await Promise.all([User.deleteMany({}), FoodItem.deleteMany({}), Coupon.deleteMany({}), Inventory.deleteMany({})]);
    console.log('🗑️  Cleared existing data');

    await User.create(users);
    console.log(`✅ Created ${users.length} users`);

    await FoodItem.create(foodItems);
    console.log(`✅ Created ${foodItems.length} food items`);

    await Coupon.create(coupons);
    console.log(`✅ Created ${coupons.length} coupons`);

    await Inventory.create(inventoryItems);
    console.log(`✅ Created ${inventoryItems.length} inventory items`);

    console.log('\n🎉 Seed complete!\n');
    console.log('─────────────────────────────────');
    console.log('Admin   : admin@cafe3d.com   / Admin@1234');
    console.log('Staff   : staff@cafe3d.com   / Staff@1234');
    console.log('Customer: customer@cafe3d.com / Customer@1234');
    console.log('─────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
