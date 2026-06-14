import type { FoodItem, User, Order } from '@/types';
import { getFoodImage } from '@/utils/foodImage';

// ── Category hero images — use real uploaded images ───────────────────────────
export const CATEGORY_IMAGES: Record<string, string> = {
  Coffee:     '/images/menu/espresso-royale.webp',
  Tea:        '/images/menu/matcha-ceremonial.png',
  Burgers:    '/images/menu/mushroom-swiss-burger.png',
  Pizza:      '/images/menu/truffle-margherita-image.png',
  Sandwiches: '/images/menu/avocado-club-sandwich.png',
  Desserts:   '/images/menu/tiramisu-classico.webp',
  Beverages:  '/images/menu/mango-sunrise-smoothie.png',
  Breakfast:  '/images/menu/eggs-benedict.png',
  Pasta:      '/images/menu/penne-arrabbiata.png',
  Salads:     '/images/menu/food-menu-5.png',
};

// ── Per-item images — all mapped to real uploaded files ───────────────────────
const IMG: Record<string, string> = {
  'Espresso Royale':        '/images/menu/espresso-royale.webp',
  'Caramel Cloud Latte':    '/images/menu/caramel-cloud-latte.webp',
  'Iced Matcha Latte':      '/images/menu/matcha-ceremonial.png',
  'Cappuccino Classico':    '/images/menu/cappuccino-classico.png',
  'Cold Brew Float':        '/images/menu/cold-brew-float.jpg',
  'Flat White':             '/images/menu/flat-white.png',
  'Matcha Ceremonial':      '/images/menu/matcha-ceremonial.png',
  'Masala Chai':            '/images/menu/masala-chai.png',
  'Earl Grey Supreme':      '/images/menu/earl-grey-supreme.png',
  'Wagyu Smash Burger':     '/images/menu/wagyu-smash-burger.png',
  'Crispy Chicken Burger':  '/images/menu/crispy-chiken-burger.png',
  'Mushroom Swiss Burger':  '/images/menu/mushroom-swiss-burger.png',
  'Truffle Margherita':     '/images/menu/truffle-margherita.png',
  'BBQ Chicken Pizza':      '/images/menu/bbq-chicken-pizza.png',
  'Peri Peri Paneer Pizza': '/images/menu/peri-peri-paneer-pizza.png',
  'Avocado Club Sandwich':  '/images/menu/avocado-club-sandwich.png',
  'BLT Classic':            '/images/menu/food-menu-4.png',
  'Tiramisu Classico':      '/images/menu/tiramisu-classico.webp',
  'Burnt Basque Cheesecake':'/images/menu/burnt-basque-cheesecake.png',
  'Mango Panna Cotta':      '/images/menu/food-menu-5.png',
  'Mango Sunrise Smoothie': '/images/menu/mango-sunrise-smoothie.png',
  'Cold Brew Lemonade':     '/images/menu/cold-brew-lemonade.png',
  'Café Breakfast Platter': '/images/menu/caf-breakfast-platter.png',
  'Eggs Benedict':          '/images/menu/eggs-benedict.png',
  'Penne Arrabbiata':       '/images/menu/penne-arrabbiata.png',
  'Truffle Mac & Cheese':   '/images/menu/truffle-mac-cheese.png',
};

export function getItemImage(name: string, category: string): string {
  return IMG[name] || getFoodImage(name, category);
}

// ── Full mock food catalogue ───────────────────────────────────────────────────
export const MOCK_FOOD_ITEMS: FoodItem[] = [
  // ── Coffee ──────────────────────────────────────────────────────────────
  { _id:'c1', name:'Espresso Royale',     category:'Coffee',   price:180,                  description:'Rich, bold espresso with golden crema from Ethiopian single-origin beans.',    images:[{url:IMG['Espresso Royale'],publicId:''}],    isVegetarian:true,  isVegan:true,  isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:true,  isSpecial:false, rating:4.8, reviewCount:124, orderCount:890,  preparationTime:5,  tags:['bestseller','hot'],   createdAt:'' },
  { _id:'c2', name:'Caramel Cloud Latte', category:'Coffee',   price:320, discountPrice:280, description:'Velvety oat milk over espresso with housemade caramel and fleur de sel.',      images:[{url:IMG['Caramel Cloud Latte'],publicId:''}], isVegetarian:true,  isVegan:false, isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:true,  isSpecial:false, rating:4.9, reviewCount:230, orderCount:1200, preparationTime:8,  tags:['popular','sweet'],    createdAt:'' },
  { _id:'c3', name:'Iced Matcha Latte',   category:'Coffee',   price:290,                  description:'Ceremonial matcha blended with cold oat milk over ice. Earthy and refreshing.', images:[{url:IMG['Iced Matcha Latte'],publicId:''}],   isVegetarian:true,  isVegan:true,  isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.6, reviewCount:88,  orderCount:420,  preparationTime:6,  tags:['trending','iced'],    createdAt:'' },
  { _id:'c4', name:'Cappuccino Classico', category:'Coffee',   price:220,                  description:'Perfect balance of espresso, steamed milk, and thick velvety foam.',             images:[{url:IMG['Cappuccino Classico'],publicId:''}], isVegetarian:true,  isVegan:false, isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.7, reviewCount:156, orderCount:670,  preparationTime:6,  tags:['classic','hot'],      createdAt:'' },
  { _id:'c5', name:'Cold Brew Float',     category:'Coffee',   price:350,                  description:'18-hour cold brew topped with vanilla ice cream and salted caramel swirl.',      images:[{url:IMG['Cold Brew Float'],publicId:''}],     isVegetarian:true,  isVegan:false, isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:true,  rating:4.7, reviewCount:92,  orderCount:480,  preparationTime:3,  tags:['cold'],               createdAt:'' },
  { _id:'c6', name:'Flat White',          category:'Coffee',   price:240,                  description:'Double ristretto with microfoam milk. Intense, velvety, and smooth.',            images:[{url:IMG['Flat White'],publicId:''}],          isVegetarian:true,  isVegan:false, isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.6, reviewCount:71,  orderCount:310,  preparationTime:5,  tags:['strong'],             createdAt:'' },

  // ── Tea ─────────────────────────────────────────────────────────────────
  { _id:'t1', name:'Matcha Ceremonial',   category:'Tea',      price:290,                  description:'Ceremonial-grade Japanese matcha with almond milk and honey.',                  images:[{url:IMG['Matcha Ceremonial'],publicId:''}],  isVegetarian:true,  isVegan:true,  isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:true,  isSpecial:false, rating:4.5, reviewCount:45,  orderCount:280,  preparationTime:7,  tags:['healthy'],            createdAt:'' },
  { _id:'t2', name:'Masala Chai',         category:'Tea',      price:160,                  description:'Spiced tea brewed with cardamom, ginger, cinnamon and whole milk.',              images:[{url:IMG['Masala Chai'],publicId:''}],         isVegetarian:true,  isVegan:false, isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.4, reviewCount:63,  orderCount:340,  preparationTime:8,  tags:['spiced','warm'],      createdAt:'' },
  { _id:'t3', name:'Earl Grey Supreme',   category:'Tea',      price:200,                  description:'Bergamot black tea with lavender, served with a lemon wedge.',                  images:[{url:IMG['Earl Grey Supreme'],publicId:''}],   isVegetarian:true,  isVegan:true,  isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.3, reviewCount:38,  orderCount:190,  preparationTime:5,  tags:['floral'],             createdAt:'' },

  // ── Burgers ──────────────────────────────────────────────────────────────
  { _id:'b1', name:'Wagyu Smash Burger',    category:'Burgers', price:680,                  description:'Double wagyu smash patties, aged cheddar, truffle aioli on brioche bun.',      images:[{url:IMG['Wagyu Smash Burger'],publicId:''}],    isVegetarian:false, isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:true,  isSpecial:true,  rating:4.7, reviewCount:87,  orderCount:560,  preparationTime:18, tags:['premium'],            createdAt:'' },
  { _id:'b2', name:'Crispy Chicken Burger', category:'Burgers', price:480,                  description:'Southern-fried chicken, sriracha slaw, jalapeños, chipotle mayo.',             images:[{url:IMG['Crispy Chicken Burger'],publicId:''}], isVegetarian:false, isVegan:false, isGlutenFree:false, isSpicy:true,  isAvailable:true, isFeatured:false, isSpecial:false, rating:4.5, reviewCount:54,  orderCount:310,  preparationTime:15, tags:['spicy','crispy'],     createdAt:'' },
  { _id:'b3', name:'Mushroom Swiss Burger', category:'Burgers', price:440,                  description:'Wild mushrooms, gruyère, caramelised onions, garlic aioli.',                  images:[{url:IMG['Mushroom Swiss Burger'],publicId:''}], isVegetarian:true,  isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.4, reviewCount:41,  orderCount:220,  preparationTime:14, tags:['vegetarian'],         createdAt:'' },

  // ── Pizza ─────────────────────────────────────────────────────────────────
  { _id:'p1', name:'Truffle Margherita',      category:'Pizza', price:820,                  description:'San Marzano tomatoes, buffalo mozzarella, black truffle oil on sourdough.',  images:[{url:IMG['Truffle Margherita'],publicId:''}],      isVegetarian:true,  isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:true,  isSpecial:false, rating:4.6, reviewCount:63,  orderCount:340,  preparationTime:22, tags:['premium','veg'],      createdAt:'' },
  { _id:'p2', name:'BBQ Chicken Pizza',        category:'Pizza', price:740,                  description:'Smoky BBQ base, grilled chicken, red onions, jalapeños, smoked gouda.',      images:[{url:IMG['BBQ Chicken Pizza'],publicId:''}],        isVegetarian:false, isVegan:false, isGlutenFree:false, isSpicy:true,  isAvailable:true, isFeatured:false, isSpecial:false, rating:4.5, reviewCount:48,  orderCount:260,  preparationTime:20, tags:['spicy','smoky'],      createdAt:'' },
  { _id:'p3', name:'Peri Peri Paneer Pizza',   category:'Pizza', price:680,                  description:'Peri peri sauce, tandoori paneer, capsicum, onions, mozzarella.',           images:[{url:IMG['Peri Peri Paneer Pizza'],publicId:''}],   isVegetarian:true,  isVegan:false, isGlutenFree:false, isSpicy:true,  isAvailable:true, isFeatured:false, isSpecial:false, rating:4.4, reviewCount:35,  orderCount:180,  preparationTime:20, tags:['spicy','veg'],        createdAt:'' },

  // ── Sandwiches ────────────────────────────────────────────────────────────
  { _id:'s1', name:'Avocado Club Sandwich', category:'Sandwiches', price:450,               description:'Sourdough, smashed avocado, grilled chicken, pesto mayo, microgreens.',     images:[{url:IMG['Avocado Club Sandwich'],publicId:''}], isVegetarian:false, isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.4, reviewCount:38,  orderCount:195,  preparationTime:12, tags:['healthy','light'],    createdAt:'' },
  { _id:'s2', name:'BLT Classic',           category:'Sandwiches', price:380,               description:'Turkey bacon, butter lettuce, beefsteak tomato, garlic aioli on toast.',    images:[{url:IMG['BLT Classic'],publicId:''}],          isVegetarian:false, isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.3, reviewCount:29,  orderCount:140,  preparationTime:10, tags:['classic','quick'],    createdAt:'' },

  // ── Desserts ──────────────────────────────────────────────────────────────
  { _id:'d1', name:'Tiramisu Classico',       category:'Desserts', price:380,               description:'Authentic Italian tiramisu, mascarpone, espresso-soaked savoiardi.',        images:[{url:IMG['Tiramisu Classico'],publicId:''}],       isVegetarian:true,  isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:true,  isSpecial:false, rating:4.9, reviewCount:156, orderCount:720,  preparationTime:5,  tags:['classic','sweet'],    createdAt:'' },
  { _id:'d2', name:'Burnt Basque Cheesecake', category:'Desserts', price:340,               description:'Creamy custardy centre with deeply caramelised top, served warm.',          images:[{url:IMG['Burnt Basque Cheesecake'],publicId:''}], isVegetarian:true,  isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:true,  rating:4.8, reviewCount:108, orderCount:590,  preparationTime:5,  tags:['trending','sweet'],   createdAt:'' },
  { _id:'d3', name:'Mango Panna Cotta',       category:'Desserts', price:280,               description:'Silky vanilla panna cotta with Alphonso mango coulis and fresh mint.',      images:[{url:IMG['Mango Panna Cotta'],publicId:''}],       isVegetarian:true,  isVegan:false, isGlutenFree:true,  isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.5, reviewCount:44,  orderCount:230,  preparationTime:3,  tags:['fruity','light'],     createdAt:'' },

  // ── Beverages ─────────────────────────────────────────────────────────────
  { _id:'bv1', name:'Mango Sunrise Smoothie', category:'Beverages', price:260,              description:'Alphonso mango, passionfruit, coconut water, turmeric, lime. No added sugar.', images:[{url:IMG['Mango Sunrise Smoothie'],publicId:''}], isVegetarian:true, isVegan:true, isGlutenFree:true, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.5, reviewCount:51, orderCount:267, preparationTime:5,  tags:['healthy','vegan'],    createdAt:'' },
  { _id:'bv2', name:'Cold Brew Lemonade',      category:'Beverages', price:240,              description:'Cold brew coffee meets fresh lemon juice and rosemary syrup over ice.',       images:[{url:IMG['Cold Brew Lemonade'],publicId:''}],      isVegetarian:true, isVegan:true, isGlutenFree:true, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.6, reviewCount:63, orderCount:310, preparationTime:3,  tags:['refreshing','iced'],  createdAt:'' },

  // ── Breakfast ─────────────────────────────────────────────────────────────
  { _id:'br1', name:'Café Breakfast Platter', category:'Breakfast', price:620,              description:'Two eggs, turkey bacon, grilled mushrooms, sourdough toast, baked beans.',  images:[{url:IMG['Café Breakfast Platter'],publicId:''}], isVegetarian:false, isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.6, reviewCount:74, orderCount:315, preparationTime:20, tags:['filling','morning'],  createdAt:'' },
  { _id:'br2', name:'Eggs Benedict',           category:'Breakfast', price:520,              description:'Poached eggs on English muffin with smoked salmon and hollandaise.',          images:[{url:IMG['Eggs Benedict'],publicId:''}],          isVegetarian:false, isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.5, reviewCount:58, orderCount:250, preparationTime:18, tags:['classic','brunch'],   createdAt:'' },

  // ── Pasta ─────────────────────────────────────────────────────────────────
  { _id:'pa1', name:'Penne Arrabbiata',    category:'Pasta', price:480,                     description:'Al dente penne in fiery San Marzano tomato sauce with garlic and pecorino.',  images:[{url:IMG['Penne Arrabbiata'],publicId:''}],    isVegetarian:true,  isVegan:true,  isGlutenFree:false, isSpicy:true,  isAvailable:true, isFeatured:false, isSpecial:false, rating:4.3, reviewCount:27, orderCount:143, preparationTime:20, tags:['spicy','italian'],    createdAt:'' },
  { _id:'pa2', name:'Truffle Mac & Cheese', category:'Pasta', price:580,                     description:'Cavatappi in four-cheese sauce with black truffle shavings and panko crust.', images:[{url:IMG['Truffle Mac & Cheese'],publicId:''}], isVegetarian:true,  isVegan:false, isGlutenFree:false, isSpicy:false, isAvailable:true, isFeatured:false, isSpecial:false, rating:4.5, reviewCount:39, orderCount:190, preparationTime:18, tags:['premium','comfort'],  createdAt:'' },
];

// ── Filtering ─────────────────────────────────────────────────────────────────
export interface MockFilters {
  category?: string;
  search?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export function filterMockItems(filters: MockFilters): FoodItem[] {
  let items = [...MOCK_FOOD_ITEMS];
  if (filters.category && filters.category !== 'all')
    items = items.filter(i => i.category === filters.category);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.tags?.some(t => t.toLowerCase().includes(q))
    );
  }
  if (filters.isVegetarian) items = items.filter(i => i.isVegetarian);
  if (filters.isVegan)      items = items.filter(i => i.isVegan);
  if (filters.isGlutenFree) items = items.filter(i => i.isGlutenFree);
  if (filters.isSpicy)      items = items.filter(i => i.isSpicy);
  if (filters.minPrice)     items = items.filter(i => (i.discountPrice ?? i.price) >= filters.minPrice!);
  if (filters.maxPrice)     items = items.filter(i => (i.discountPrice ?? i.price) <= filters.maxPrice!);
  return items;
}

// ── Demo users ────────────────────────────────────────────────────────────────
export const DEMO_USERS: (User & { password: string })[] = [
  { _id:'demo-admin',    name:'Admin User', email:'admin@cafe3d.com',    password:'Admin@1234',    role:'admin',    isVerified:true,  isBlocked:false, addresses:[], loyaltyPoints:500, totalOrders:0,  totalSpent:0,    createdAt:new Date().toISOString() },
  { _id:'demo-customer', name:'John Doe',   email:'customer@cafe3d.com', password:'Customer@1234', role:'customer', isVerified:true,  isBlocked:false, addresses:[{_id:'addr1',label:'Home',street:'12 Artisan Lane',city:'Pune',state:'Maharashtra',zipCode:'411001',country:'India',isDefault:true}], loyaltyPoints:120, totalOrders:5, totalSpent:2400, createdAt:new Date().toISOString() },
  { _id:'demo-staff',    name:'Staff Member',email:'staff@cafe3d.com',   password:'Staff@1234',    role:'staff',    isVerified:true,  isBlocked:false, addresses:[], loyaltyPoints:0,   totalOrders:0,  totalSpent:0,    createdAt:new Date().toISOString() },
];

export function findDemoUser(email: string, password: string) {
  return DEMO_USERS.find(u => u.email === email && u.password === password) ?? null;
}

export function makeMockToken(userId: string): string {
  const h = btoa(JSON.stringify({ alg:'HS256', typ:'JWT' }));
  const p = btoa(JSON.stringify({ id:userId, exp:Date.now()/1000+86400 }));
  return `${h}.${p}.demo`;
}

export function makeMockOrder(userId: string, items: any[], subtotal: number): Order {
  const id = `mock-${Date.now()}`;
  const tax = Math.round(subtotal * 0.05);
  const fee = subtotal >= 500 ? 0 : 40;
  return {
    _id: id,
    orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
    user: userId,
    items,
    status: 'pending',
    statusHistory: [{ status: 'pending', timestamp: new Date().toISOString(), note: 'Demo order placed' }],
    orderType: 'delivery',
    subtotal,
    tax,
    deliveryFee: fee,
    discount: 0,
    couponDiscount: 0,
    total: subtotal + tax + fee,
    paymentStatus: 'pending',
    paymentMethod: 'stripe',
    createdAt: new Date().toISOString(),
  };
}

export function findDemoUserByEmail(email: string) {
  const found = DEMO_USERS.find(u => u.email === email);
  if (!found) return null;
  const { password: _pw, ...user } = found;
  return user;
}
