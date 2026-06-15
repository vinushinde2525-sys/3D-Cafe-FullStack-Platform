/**
 * inventoryERPService.ts
 * Wraps backend API calls with offline fallback to mock data.
 */
import api from '@/api/axios';
import { isBackendOnline } from '@/services/backendStatus';
import {
  MOCK_INVENTORY, MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS,
  MOCK_MOVEMENTS, MOCK_WASTE, MOCK_INVENTORY_STATS,
} from '@/services/mockInventory';
import type {
  InventoryItem, Supplier, PurchaseOrder, StockMovement, WasteRecord, InventoryStats
} from '@/types/inventory';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// ── Inventory Items ───────────────────────────────────────────────────────────
export const inventoryERP = {
  async getAll(filters?: Record<string, string>): Promise<InventoryItem[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_INVENTORY; }
    try {
      const { data } = await api.get('/inventory', { params: filters });
      return data.data;
    } catch { return MOCK_INVENTORY; }
  },

  async getById(id: string): Promise<InventoryItem> {
    if (!isBackendOnline()) { await delay(); return MOCK_INVENTORY.find(i => i._id === id) ?? MOCK_INVENTORY[0]; }
    try { const { data } = await api.get(`/inventory/${id}`); return data.data; }
    catch { return MOCK_INVENTORY.find(i => i._id === id) ?? MOCK_INVENTORY[0]; }
  },

  async create(payload: Partial<InventoryItem>): Promise<InventoryItem> {
    if (!isBackendOnline()) { await delay(400); return { ...MOCK_INVENTORY[0], ...payload, _id: `inv-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as InventoryItem; }
    const { data } = await api.post('/inventory', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<InventoryItem>): Promise<InventoryItem> {
    if (!isBackendOnline()) { await delay(300); return { ...MOCK_INVENTORY.find(i => i._id === id)!, ...payload }; }
    const { data } = await api.patch(`/inventory/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    if (!isBackendOnline()) { await delay(300); return; }
    await api.delete(`/inventory/${id}`);
  },

  async adjustStock(id: string, quantity: number, type: string, note: string): Promise<void> {
    if (!isBackendOnline()) { await delay(400); return; }
    await api.patch(`/inventory/${id}/stock`, { quantity, type, note });
  },

  async getLowStock(): Promise<InventoryItem[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_INVENTORY.filter(i => i.currentStock <= i.minimumStock); }
    try { const { data } = await api.get('/inventory/low-stock'); return data.data; }
    catch { return MOCK_INVENTORY.filter(i => i.currentStock <= i.minimumStock); }
  },

  async getExpiring(days = 7): Promise<InventoryItem[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_INVENTORY.filter(i => i.daysRemaining !== undefined && i.daysRemaining <= days); }
    try { const { data } = await api.get('/inventory/expiring', { params: { days } }); return data.data; }
    catch { return MOCK_INVENTORY.filter(i => i.daysRemaining !== undefined && i.daysRemaining <= days); }
  },

  async getStats(): Promise<InventoryStats> {
    if (!isBackendOnline()) { await delay(); return MOCK_INVENTORY_STATS; }
    try { const { data } = await api.get('/inventory/stats'); return data.data; }
    catch { return MOCK_INVENTORY_STATS; }
  },
};

// ── Suppliers ─────────────────────────────────────────────────────────────────
export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_SUPPLIERS; }
    try { const { data } = await api.get('/suppliers'); return data.data; }
    catch { return MOCK_SUPPLIERS; }
  },

  async create(payload: Partial<Supplier>): Promise<Supplier> {
    if (!isBackendOnline()) { await delay(400); return { ...payload, _id: `sup-${Date.now()}`, totalOrders: 0, totalSpent: 0, createdAt: new Date().toISOString() } as Supplier; }
    const { data } = await api.post('/suppliers', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Supplier>): Promise<Supplier> {
    if (!isBackendOnline()) { await delay(300); return { ...MOCK_SUPPLIERS.find(s => s._id === id)!, ...payload }; }
    const { data } = await api.patch(`/suppliers/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    if (!isBackendOnline()) { await delay(300); return; }
    await api.delete(`/suppliers/${id}`);
  },
};

// ── Purchase Orders ───────────────────────────────────────────────────────────
export const purchaseOrderService = {
  async getAll(): Promise<PurchaseOrder[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_PURCHASE_ORDERS; }
    try { const { data } = await api.get('/purchase-orders'); return data.data; }
    catch { return MOCK_PURCHASE_ORDERS; }
  },

  async create(payload: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    if (!isBackendOnline()) {
      await delay(500);
      return { ...payload, _id: `po-${Date.now()}`, poNumber: `PO-${Date.now().toString(36).toUpperCase()}`, status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as PurchaseOrder;
    }
    const { data } = await api.post('/purchase-orders', payload);
    return data.data;
  },

  async updateStatus(id: string, status: string, receivedQty?: Record<string, number>): Promise<void> {
    if (!isBackendOnline()) { await delay(400); return; }
    await api.patch(`/purchase-orders/${id}/status`, { status, receivedQty });
  },
};

// ── Movements ─────────────────────────────────────────────────────────────────
export const movementService = {
  async getAll(filters?: Record<string, string>): Promise<StockMovement[]> {
    if (!isBackendOnline()) {
      await delay();
      const items = MOCK_MOVEMENTS;
      if (filters?.type) return items.filter(m => m.type === filters.type);
      return items;
    }
    try { const { data } = await api.get('/inventory/movements', { params: filters }); return data.data; }
    catch { return MOCK_MOVEMENTS; }
  },
};

// ── Waste ─────────────────────────────────────────────────────────────────────
export const wasteService = {
  async getAll(): Promise<WasteRecord[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_WASTE; }
    try { const { data } = await api.get('/inventory/waste'); return data.data; }
    catch { return MOCK_WASTE; }
  },

  async create(payload: Partial<WasteRecord>): Promise<WasteRecord> {
    if (!isBackendOnline()) { await delay(400); return { ...payload, _id: `w-${Date.now()}`, createdAt: new Date().toISOString() } as WasteRecord; }
    const { data } = await api.post('/inventory/waste', payload);
    return data.data;
  },
};
