// ─────────────────────────────────────────────────────────────────────────────
// Inventory ERP Types
// Append these to your main types/index.ts or import from here.
// ─────────────────────────────────────────────────────────────────────────────

export type StockUnit = 'kg' | 'g' | 'liter' | 'ml' | 'pieces' | 'dozen' | 'packet' | 'box';
export type StockCategory = 'Raw Material' | 'Dairy' | 'Bakery' | 'Beverage' | 'Packaging' | 'Cleaning' | 'Other';
export type StockMoveType = 'restock' | 'usage' | 'waste' | 'transfer' | 'adjustment' | 'return' | 'purchase';
export type POStatus = 'draft' | 'sent' | 'partial' | 'received' | 'cancelled';
export type SupplierStatus = 'active' | 'inactive' | 'blacklisted';

export interface InventoryItem {
  _id:            string;
  name:           string;
  category:       StockCategory;
  sku?:           string;
  barcode?:       string;
  unit:           StockUnit;
  currentStock:   number;
  minimumStock:   number;
  maximumStock:   number;
  reorderPoint:   number;
  costPerUnit:    number;
  totalValue:     number;
  supplier?:      string | Supplier;
  expiryDate?:    string;
  batchNumber?:   string;
  location?:      string;
  isActive:       boolean;
  lastRestocked?: string;
  usageRate?:     number;          // avg units used per day
  daysRemaining?: number;
  notes?:         string;
  createdAt:      string;
  updatedAt:      string;
}

export interface Supplier {
  _id:          string;
  name:         string;
  contactName:  string;
  email:        string;
  phone:        string;
  address:      string;
  city:         string;
  gstin?:       string;
  paymentTerms: string;           // e.g. "Net 30"
  leadTimeDays: number;
  rating:       number;           // 1–5
  status:       SupplierStatus;
  categories:   StockCategory[];
  totalOrders:  number;
  totalSpent:   number;
  notes?:       string;
  createdAt:    string;
}

export interface PurchaseOrderItem {
  inventoryItem: string | InventoryItem;
  name:          string;
  unit:          StockUnit;
  quantity:      number;
  receivedQty:   number;
  unitPrice:     number;
  totalPrice:    number;
}

export interface PurchaseOrder {
  _id:            string;
  poNumber:       string;
  supplier:       string | Supplier;
  status:         POStatus;
  items:          PurchaseOrderItem[];
  subtotal:       number;
  tax:            number;
  shippingCost:   number;
  total:          number;
  expectedDate:   string;
  receivedDate?:  string;
  notes?:         string;
  createdBy:      string;
  createdAt:      string;
  updatedAt:      string;
}

export interface StockMovement {
  _id:           string;
  inventoryItem: string | InventoryItem;
  itemName:      string;
  type:          StockMoveType;
  quantity:      number;
  unitBefore:    number;
  unitAfter:     number;
  costPerUnit?:  number;
  totalCost?:    number;
  reference?:    string;        // PO number, order number, etc.
  note:          string;
  performedBy:   string;
  createdAt:     string;
}

export interface WasteRecord {
  _id:           string;
  inventoryItem: string | InventoryItem;
  itemName:      string;
  quantity:      number;
  unit:          StockUnit;
  reason:        'expired' | 'damaged' | 'spillage' | 'overproduction' | 'theft' | 'other';
  costLoss:      number;
  note?:         string;
  reportedBy:    string;
  createdAt:     string;
}

export interface InventoryStats {
  totalItems:       number;
  totalValue:       number;
  lowStockCount:    number;
  expiringCount:    number;
  todayPurchases:   number;
  todayWaste:       number;
  wasteCostToday:   number;
  topUsedItems:     { name: string; usageRate: number; unit: StockUnit }[];
  supplierCount:    number;
  pendingPOs:       number;
}
