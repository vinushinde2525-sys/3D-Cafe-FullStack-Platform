import type {
  InventoryItem, Supplier, PurchaseOrder, StockMovement, WasteRecord, InventoryStats
} from '@/types/inventory';

const now = new Date().toISOString();
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); };
const daysAhead = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString(); };

// ── Suppliers ─────────────────────────────────────────────────────────────────
export const MOCK_SUPPLIERS: Supplier[] = [
  { _id: 'sup-1', name: 'Bean Bros Co.',      contactName: 'Raj Sharma',   email: 'raj@beanbros.in',    phone: '+91 98765 43210', address: '12 Coffee Lane', city: 'Coorg',     gstin: '29AAPFB1234C1ZV', paymentTerms: 'Net 30', leadTimeDays: 3, rating: 4.8, status: 'active',    categories: ['Raw Material'],        totalOrders: 48, totalSpent: 284000, notes: 'Premium single-origin supplier', createdAt: daysAgo(180) },
  { _id: 'sup-2', name: 'Farm Fresh Dairy',   contactName: 'Priya Menon',  email: 'priya@farmfresh.in', phone: '+91 87654 32109', address: '8 Dairy Road',   city: 'Pune',      gstin: '27AABFF5678D2ZW', paymentTerms: 'Net 15', leadTimeDays: 1, rating: 4.5, status: 'active',    categories: ['Dairy'],               totalOrders: 120, totalSpent: 96000, notes: 'Daily delivery 6am', createdAt: daysAgo(200) },
  { _id: 'sup-3', name: 'Artisan Bakes',      contactName: 'Suresh Kumar', email: 'info@artisanbakes.in', phone: '+91 76543 21098', address: '3 Baker St',   city: 'Mumbai',    gstin: '27AABFA9012E3ZX', paymentTerms: 'Net 7',  leadTimeDays: 1, rating: 4.2, status: 'active',    categories: ['Bakery'],              totalOrders: 90,  totalSpent: 54000, notes: 'Fresh daily bread 7am', createdAt: daysAgo(150) },
  { _id: 'sup-4', name: 'Spice Route Pvt.',   contactName: 'Anita Rao',    email: 'anita@spiceroute.in', phone: '+91 65432 10987', address: '22 Spice Market', city: 'Chennai', gstin: '33AABFS3456F4ZY', paymentTerms: 'Net 30', leadTimeDays: 5, rating: 3.9, status: 'active',    categories: ['Raw Material','Other'], totalOrders: 24, totalSpent: 18000, createdAt: daysAgo(100) },
  { _id: 'sup-5', name: 'GreenLeaf Organics', contactName: 'Dev Joshi',    email: 'dev@greenleaf.in',   phone: '+91 54321 09876', address: '7 Organic Farm', city: 'Nashik',   paymentTerms: 'Net 45', leadTimeDays: 4, rating: 4.6, status: 'active', categories: ['Raw Material','Beverage'], totalOrders: 36, totalSpent: 62000, createdAt: daysAgo(90) },
];

// ── Inventory Items ───────────────────────────────────────────────────────────
export const MOCK_INVENTORY: InventoryItem[] = [
  { _id: 'inv-1',  name: 'Ethiopian Coffee Beans',  category: 'Raw Material', sku: 'RM-001', unit: 'kg',     currentStock: 12,  minimumStock: 5,   maximumStock: 50, reorderPoint: 8,  costPerUnit: 480,  totalValue: 5760,  supplier: 'sup-1', expiryDate: daysAhead(90),  batchNumber: 'BT-2024-01', location: 'Storage A1', isActive: true, usageRate: 0.8, daysRemaining: 15, lastRestocked: daysAgo(3),  createdAt: daysAgo(180), updatedAt: daysAgo(1) },
  { _id: 'inv-2',  name: 'Full Fat Milk',           category: 'Dairy',        sku: 'DA-001', unit: 'liter',  currentStock: 3,   minimumStock: 10,  maximumStock: 80, reorderPoint: 15, costPerUnit: 62,   totalValue: 186,   supplier: 'sup-2', expiryDate: daysAhead(3),   location: 'Fridge 1',   isActive: true, usageRate: 8,   daysRemaining: 0,  lastRestocked: daysAgo(1),  createdAt: daysAgo(200), updatedAt: daysAgo(0) },
  { _id: 'inv-3',  name: 'Sourdough Bread Loaves',  category: 'Bakery',       sku: 'BK-001', unit: 'pieces', currentStock: 8,   minimumStock: 5,   maximumStock: 30, reorderPoint: 7,  costPerUnit: 85,   totalValue: 680,   supplier: 'sup-3', expiryDate: daysAhead(2),   location: 'Bread Rack', isActive: true, usageRate: 6,   daysRemaining: 1,  lastRestocked: daysAgo(0),  createdAt: daysAgo(150), updatedAt: daysAgo(0) },
  { _id: 'inv-4',  name: 'Matcha Green Tea Powder', category: 'Beverage',     sku: 'BV-001', unit: 'kg',     currentStock: 2.5, minimumStock: 1,   maximumStock: 10, reorderPoint: 2,  costPerUnit: 1200, totalValue: 3000,  supplier: 'sup-5', expiryDate: daysAhead(180), batchNumber: 'MT-2024-03', location: 'Dry Store', isActive: true, usageRate: 0.1, daysRemaining: 25, lastRestocked: daysAgo(14), createdAt: daysAgo(60),  updatedAt: daysAgo(5) },
  { _id: 'inv-5',  name: 'Oat Milk (Barista)',      category: 'Dairy',        sku: 'DA-002', unit: 'liter',  currentStock: 18,  minimumStock: 10,  maximumStock: 60, reorderPoint: 15, costPerUnit: 95,   totalValue: 1710,  supplier: 'sup-2', expiryDate: daysAhead(14),  location: 'Fridge 2',   isActive: true, usageRate: 3,   daysRemaining: 6,  lastRestocked: daysAgo(2),  createdAt: daysAgo(90),  updatedAt: daysAgo(2) },
  { _id: 'inv-6',  name: 'Wagyu Beef Patties',      category: 'Raw Material', sku: 'RM-002', unit: 'kg',     currentStock: 6,   minimumStock: 3,   maximumStock: 20, reorderPoint: 5,  costPerUnit: 1800, totalValue: 10800, supplier: 'sup-4', expiryDate: daysAhead(5),   batchNumber: 'WG-2024-02', location: 'Freezer A', isActive: true, usageRate: 1.2, daysRemaining: 5, lastRestocked: daysAgo(2),  createdAt: daysAgo(30),  updatedAt: daysAgo(1) },
  { _id: 'inv-7',  name: 'San Marzano Tomatoes',    category: 'Raw Material', sku: 'RM-003', unit: 'kg',     currentStock: 14,  minimumStock: 5,   maximumStock: 40, reorderPoint: 8,  costPerUnit: 220,  totalValue: 3080,  supplier: 'sup-4', expiryDate: daysAhead(7),   location: 'Cold Room',  isActive: true, usageRate: 2,   daysRemaining: 7,  lastRestocked: daysAgo(3),  createdAt: daysAgo(45),  updatedAt: daysAgo(2) },
  { _id: 'inv-8',  name: 'Buffalo Mozzarella',      category: 'Dairy',        sku: 'DA-003', unit: 'kg',     currentStock: 4,   minimumStock: 2,   maximumStock: 15, reorderPoint: 3,  costPerUnit: 680,  totalValue: 2720,  supplier: 'sup-2', expiryDate: daysAhead(4),   location: 'Fridge 1',   isActive: true, usageRate: 0.8, daysRemaining: 5, lastRestocked: daysAgo(4),  createdAt: daysAgo(50),  updatedAt: daysAgo(3) },
  { _id: 'inv-9',  name: 'Cardamom Pods',           category: 'Raw Material', sku: 'RM-004', unit: 'g',      currentStock: 400, minimumStock: 100, maximumStock: 1000, reorderPoint: 150, costPerUnit: 1.8, totalValue: 720, supplier: 'sup-4', expiryDate: daysAhead(365), location: 'Spice Rack', isActive: true, usageRate: 15, daysRemaining: 27, lastRestocked: daysAgo(10), createdAt: daysAgo(80), updatedAt: daysAgo(8) },
  { _id: 'inv-10', name: 'Alphonso Mango Pulp',     category: 'Raw Material', sku: 'RM-005', unit: 'liter',  currentStock: 2,   minimumStock: 3,   maximumStock: 20, reorderPoint: 4,  costPerUnit: 340,  totalValue: 680,   supplier: 'sup-5', expiryDate: daysAhead(30),  location: 'Cold Room',  isActive: true, usageRate: 0.5, daysRemaining: 4,  lastRestocked: daysAgo(7),  createdAt: daysAgo(20),  updatedAt: daysAgo(5) },
  { _id: 'inv-11', name: 'Packaging Cups (12oz)',   category: 'Packaging',    sku: 'PK-001', unit: 'pieces', currentStock: 450, minimumStock: 100, maximumStock: 1000, reorderPoint: 150, costPerUnit: 4.5, totalValue: 2025, supplier: 'sup-4', expiryDate: undefined, location: 'Store Room', isActive: true, usageRate: 40, daysRemaining: 11, lastRestocked: daysAgo(5), createdAt: daysAgo(100), updatedAt: daysAgo(4) },
  { _id: 'inv-12', name: 'Mascarpone Cheese',       category: 'Dairy',        sku: 'DA-004', unit: 'kg',     currentStock: 3.5, minimumStock: 1,   maximumStock: 10, reorderPoint: 2,  costPerUnit: 420,  totalValue: 1470,  supplier: 'sup-2', expiryDate: daysAhead(10),  location: 'Fridge 2',   isActive: true, usageRate: 0.4, daysRemaining: 9,  lastRestocked: daysAgo(6),  createdAt: daysAgo(40),  updatedAt: daysAgo(5) },
];

// ── Purchase Orders ───────────────────────────────────────────────────────────
export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    _id: 'po-1', poNumber: 'PO-2024-001', supplier: 'sup-2', status: 'received',
    items: [
      { inventoryItem: 'inv-2', name: 'Full Fat Milk',     unit: 'liter', quantity: 50, receivedQty: 50, unitPrice: 62,  totalPrice: 3100 },
      { inventoryItem: 'inv-5', name: 'Oat Milk (Barista)',unit: 'liter', quantity: 20, receivedQty: 20, unitPrice: 95,  totalPrice: 1900 },
      { inventoryItem: 'inv-8', name: 'Buffalo Mozzarella',unit: 'kg',    quantity: 5,  receivedQty: 5,  unitPrice: 680, totalPrice: 3400 },
    ],
    subtotal: 8400, tax: 756, shippingCost: 0, total: 9156,
    expectedDate: daysAgo(3), receivedDate: daysAgo(2),
    notes: 'Weekly dairy order', createdBy: 'demo-admin', createdAt: daysAgo(5), updatedAt: daysAgo(2),
  },
  {
    _id: 'po-2', poNumber: 'PO-2024-002', supplier: 'sup-1', status: 'sent',
    items: [
      { inventoryItem: 'inv-1', name: 'Ethiopian Coffee Beans', unit: 'kg', quantity: 20, receivedQty: 0, unitPrice: 480, totalPrice: 9600 },
    ],
    subtotal: 9600, tax: 864, shippingCost: 200, total: 10664,
    expectedDate: daysAhead(2), notes: 'Monthly coffee restock',
    createdBy: 'demo-admin', createdAt: daysAgo(1), updatedAt: daysAgo(1),
  },
  {
    _id: 'po-3', poNumber: 'PO-2024-003', supplier: 'sup-5', status: 'draft',
    items: [
      { inventoryItem: 'inv-4',  name: 'Matcha Green Tea Powder', unit: 'kg',    quantity: 3, receivedQty: 0, unitPrice: 1200, totalPrice: 3600 },
      { inventoryItem: 'inv-10', name: 'Alphonso Mango Pulp',     unit: 'liter', quantity: 10, receivedQty: 0, unitPrice: 340,  totalPrice: 3400 },
    ],
    subtotal: 7000, tax: 630, shippingCost: 150, total: 7780,
    expectedDate: daysAhead(5),
    createdBy: 'demo-admin', createdAt: now, updatedAt: now,
  },
];

// ── Stock Movements ───────────────────────────────────────────────────────────
export const MOCK_MOVEMENTS: StockMovement[] = [
  { _id: 'mv-1',  inventoryItem: 'inv-1', itemName: 'Ethiopian Coffee Beans',  type: 'usage',     quantity: 0.8,  unitBefore: 12.8, unitAfter: 12,   note: 'Morning service',  performedBy: 'demo-staff', createdAt: daysAgo(0) },
  { _id: 'mv-2',  inventoryItem: 'inv-2', itemName: 'Full Fat Milk',           type: 'restock',   quantity: 50,   unitBefore: 2,    unitAfter: 52,   costPerUnit: 62,  totalCost: 3100, note: 'PO-2024-001 received', reference: 'PO-2024-001', performedBy: 'demo-admin', createdAt: daysAgo(2) },
  { _id: 'mv-3',  inventoryItem: 'inv-3', itemName: 'Sourdough Bread Loaves',  type: 'waste',     quantity: 2,    unitBefore: 10,   unitAfter: 8,    costPerUnit: 85,  totalCost: 170,  note: 'End of day — stale', performedBy: 'demo-staff', createdAt: daysAgo(0) },
  { _id: 'mv-4',  inventoryItem: 'inv-6', itemName: 'Wagyu Beef Patties',      type: 'usage',     quantity: 1.2,  unitBefore: 7.2,  unitAfter: 6,    note: 'Lunch service',    performedBy: 'demo-staff', createdAt: daysAgo(0) },
  { _id: 'mv-5',  inventoryItem: 'inv-5', itemName: 'Oat Milk (Barista)',      type: 'restock',   quantity: 20,   unitBefore: 1,    unitAfter: 21,   costPerUnit: 95,  totalCost: 1900, note: 'PO-2024-001 received', reference: 'PO-2024-001', performedBy: 'demo-admin', createdAt: daysAgo(2) },
  { _id: 'mv-6',  inventoryItem: 'inv-9', itemName: 'Cardamom Pods',           type: 'usage',     quantity: 15,   unitBefore: 415,  unitAfter: 400,  note: 'Chai production',  performedBy: 'demo-staff', createdAt: daysAgo(0) },
  { _id: 'mv-7',  inventoryItem: 'inv-4', itemName: 'Matcha Green Tea Powder', type: 'adjustment',quantity: -0.1, unitBefore: 2.6,  unitAfter: 2.5,  note: 'Stock count correction', performedBy: 'demo-admin', createdAt: daysAgo(1) },
  { _id: 'mv-8',  inventoryItem: 'inv-7', itemName: 'San Marzano Tomatoes',    type: 'usage',     quantity: 2,    unitBefore: 16,   unitAfter: 14,   note: 'Pizza prep',       performedBy: 'demo-staff', createdAt: daysAgo(0) },
];

// ── Waste Records ─────────────────────────────────────────────────────────────
export const MOCK_WASTE: WasteRecord[] = [
  { _id: 'w-1', inventoryItem: 'inv-3', itemName: 'Sourdough Bread Loaves',  quantity: 2,   unit: 'pieces', reason: 'expired',         costLoss: 170,   note: 'Day-old bread', reportedBy: 'demo-staff', createdAt: daysAgo(0) },
  { _id: 'w-2', inventoryItem: 'inv-2', itemName: 'Full Fat Milk',           quantity: 1.5, unit: 'liter',  reason: 'spillage',        costLoss: 93,    note: 'Barista accident', reportedBy: 'demo-staff', createdAt: daysAgo(1) },
  { _id: 'w-3', inventoryItem: 'inv-8', itemName: 'Buffalo Mozzarella',      quantity: 0.2, unit: 'kg',     reason: 'damaged',         costLoss: 136,   note: 'Packaging torn', reportedBy: 'demo-admin', createdAt: daysAgo(2) },
  { _id: 'w-4', inventoryItem: 'inv-7', itemName: 'San Marzano Tomatoes',    quantity: 1,   unit: 'kg',     reason: 'overproduction',  costLoss: 220,   note: 'Excess sauce prep', reportedBy: 'demo-staff', createdAt: daysAgo(3) },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
export const MOCK_INVENTORY_STATS: InventoryStats = {
  totalItems:      MOCK_INVENTORY.length,
  totalValue:      MOCK_INVENTORY.reduce((s, i) => s + i.totalValue, 0),
  lowStockCount:   MOCK_INVENTORY.filter(i => i.currentStock <= i.minimumStock).length,
  expiringCount:   MOCK_INVENTORY.filter(i => i.daysRemaining !== undefined && i.daysRemaining <= 7).length,
  todayPurchases:  13256,
  todayWaste:      MOCK_WASTE.filter(w => w.createdAt > daysAgo(1)).reduce((s, w) => s + w.costLoss, 0),
  wasteCostToday:  263,
  topUsedItems: [
    { name: 'Full Fat Milk',          usageRate: 8,    unit: 'liter' },
    { name: 'Packaging Cups (12oz)',  usageRate: 40,   unit: 'pieces'},
    { name: 'Ethiopian Coffee Beans', usageRate: 0.8,  unit: 'kg'   },
    { name: 'Sourdough Bread Loaves', usageRate: 6,    unit: 'pieces'},
  ],
  supplierCount:  MOCK_SUPPLIERS.length,
  pendingPOs:     MOCK_PURCHASE_ORDERS.filter(p => p.status === 'sent' || p.status === 'draft').length,
};
