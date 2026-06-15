import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeftRight, Package, Truck, ClipboardList, Trash2, Clock, Upload, Download } from 'lucide-react';
import { MotionButton } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { InventoryTable } from '@/components/admin/inventory/InventoryTable';
import { InventoryItemEditor } from '@/components/admin/inventory/InventoryItemEditor';
import { StockAdjustmentModal } from '@/components/admin/inventory/StockAdjustmentModal';
import { StockTransferModal } from '@/components/admin/inventory/StockTransferModal';
import { InventoryStats } from '@/components/admin/inventory/InventoryStats';
import { LowStockWidget } from '@/components/admin/inventory/LowStockWidget';
import { ExpiringProductsWidget } from '@/components/admin/inventory/ExpiringProductsWidget';
import { SupplierTable } from '@/components/admin/inventory/SupplierTable';
import { SupplierEditor } from '@/components/admin/inventory/SupplierEditor';
import { PurchaseOrderTable } from '@/components/admin/inventory/PurchaseOrderTable';
import { PurchaseOrderEditor } from '@/components/admin/inventory/PurchaseOrderEditor';
import { WasteTracker } from '@/components/admin/inventory/WasteTracker';
import { InventoryTimeline } from '@/components/admin/inventory/InventoryTimeline';
import { ExcelImportModal } from '@/components/admin/excel/ExcelImportModal';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { auditLogService } from '@/services/auditLogService';
import { Modal } from '@/components/ui/Modal';
import { formatPrice, formatDate } from '@/utils/format';
import {
  inventoryERP, supplierService, purchaseOrderService, movementService, wasteService,
} from '@/services/inventoryERPService';
import toast from 'react-hot-toast';
import type {
  InventoryItem, InventoryStats as InventoryStatsType, Supplier,
  PurchaseOrder, StockMovement, WasteRecord,
} from '@/types/inventory';

type Tab = 'items' | 'suppliers' | 'orders' | 'waste' | 'history';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'items',     label: 'Inventory',       icon: <Package size={14} /> },
  { key: 'suppliers', label: 'Suppliers',        icon: <Truck size={14} /> },
  { key: 'orders',    label: 'Purchase Orders',  icon: <ClipboardList size={14} /> },
  { key: 'waste',     label: 'Waste',            icon: <Trash2 size={14} /> },
  { key: 'history',   label: 'Stock History',    icon: <Clock size={14} /> },
];

export default function InventoryManagementPage() {
  const [tab, setTab] = useState<Tab>('items');
  const [loading, setLoading] = useState(true);

  const [items, setItems]     = useState<InventoryItem[]>([]);
  const [stats, setStats]     = useState<InventoryStatsType | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders]   = useState<PurchaseOrder[]>([]);
  const [waste, setWaste]     = useState<WasteRecord[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Modal state
  const [editingItem, setEditingItem]   = useState<InventoryItem | null>(null);
  const [itemEditorOpen, setItemEditorOpen] = useState(false);
  const [adjustItem, setAdjustItem]     = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType]     = useState<'restock' | 'usage'>('restock');
  const [transferItem, setTransferItem] = useState<InventoryItem | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierEditorOpen, setSupplierEditorOpen] = useState(false);
  const [poEditorOpen, setPoEditorOpen] = useState(false);
  const [viewingPO, setViewingPO]       = useState<PurchaseOrder | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [i, s, sup, po, w, mv] = await Promise.all([
        inventoryERP.getAll(),
        inventoryERP.getStats(),
        supplierService.getAll(),
        purchaseOrderService.getAll(),
        wasteService.getAll(),
        movementService.getAll(),
      ]);
      setItems(i); setStats(s); setSuppliers(sup); setOrders(po); setWaste(w); setMovements(mv);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this inventory item?')) return;
    const item = items.find(i => i._id === id);
    try {
      await inventoryERP.delete(id);
      toast.success('Item deleted');
      auditLogService.record({ action: 'delete', module: 'inventory', target: item?.name ?? id, performedBy: 'admin' });
      fetchAll();
    }
    catch { toast.error('Delete failed'); }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;
    try { await supplierService.delete(id); toast.success('Supplier deleted'); fetchAll(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Inventory ERP</h1>
        <div className="flex gap-2">
          {tab === 'items' && (
            <>
              <MotionButton onClick={() => setImportOpen(true)} variant="cream" size="sm" pill leftIcon={<Upload size={14} />}>
                Import
              </MotionButton>
              <MotionButton onClick={() => setExportOpen(true)} variant="cream" size="sm" pill leftIcon={<Download size={14} />}>
                Export
              </MotionButton>
              <MotionButton onClick={() => setTransferItem(items[0] ?? null)} variant="cream" size="sm" pill leftIcon={<ArrowLeftRight size={14} />}>
                Transfer Stock
              </MotionButton>
              <MotionButton onClick={() => { setEditingItem(null); setItemEditorOpen(true); }} variant="espresso" size="sm" pill leftIcon={<Plus size={14} />}>
                Add Item
              </MotionButton>
            </>
          )}
          {tab === 'suppliers' && (
            <MotionButton onClick={() => { setEditingSupplier(null); setSupplierEditorOpen(true); }} variant="espresso" size="sm" pill leftIcon={<Plus size={14} />}>
              Add Supplier
            </MotionButton>
          )}
          {tab === 'orders' && (
            <MotionButton onClick={() => setPoEditorOpen(true)} variant="espresso" size="sm" pill leftIcon={<Plus size={14} />}>
              New Purchase Order
            </MotionButton>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && <InventoryStats stats={stats} />}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-beige/40 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-display text-xs whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key ? 'border-espresso text-espresso' : 'border-transparent text-ink-3 hover:text-ink-2'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? <DashboardSkeleton /> : (
        <>
          {tab === 'items' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LowStockWidget items={items} />
                <ExpiringProductsWidget items={items} />
              </div>
              <div className="card-premium overflow-hidden p-5">
                <InventoryTable
                  items={items}
                  onEdit={(item) => { setEditingItem(item); setItemEditorOpen(true); }}
                  onDelete={handleDeleteItem}
                  onAdjust={(item, type) => { setAdjustItem(item); setAdjustType(type); }}
                />
              </div>
            </div>
          )}

          {tab === 'suppliers' && (
            <div className="card-premium overflow-hidden p-5">
              <SupplierTable
                suppliers={suppliers}
                onEdit={(s) => { setEditingSupplier(s); setSupplierEditorOpen(true); }}
                onDelete={handleDeleteSupplier}
              />
            </div>
          )}

          {tab === 'orders' && (
            <div className="card-premium overflow-hidden p-5">
              <PurchaseOrderTable orders={orders} onView={setViewingPO} onUpdate={fetchAll} />
            </div>
          )}

          {tab === 'waste' && (
            <div className="card-premium overflow-hidden p-5">
              <WasteTracker records={waste} inventoryItems={items} onUpdate={fetchAll} />
            </div>
          )}

          {tab === 'history' && (
            <div className="card-premium overflow-hidden p-5">
              <InventoryTimeline movements={movements} />
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <InventoryItemEditor item={editingItem} isOpen={itemEditorOpen} onClose={() => setItemEditorOpen(false)} onSuccess={fetchAll} />
      <StockAdjustmentModal item={adjustItem} type={adjustType} isOpen={!!adjustItem} onClose={() => setAdjustItem(null)} onSuccess={fetchAll} />
      <StockTransferModal item={transferItem} isOpen={!!transferItem} onClose={() => setTransferItem(null)} onSuccess={fetchAll} />
      <SupplierEditor supplier={editingSupplier} isOpen={supplierEditorOpen} onClose={() => setSupplierEditorOpen(false)} onSuccess={fetchAll} />
      <PurchaseOrderEditor isOpen={poEditorOpen} onClose={() => setPoEditorOpen(false)} onSuccess={fetchAll} inventoryItems={items} />
      <ExcelImportModal isOpen={importOpen} onClose={() => { setImportOpen(false); fetchAll(); }} type="inventory" />
      <ExcelExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} type="stock" data={items} label="Stock Inventory" />

      {/* PO detail view */}
      <Modal isOpen={!!viewingPO} onClose={() => setViewingPO(null)} title={viewingPO ? `Purchase Order ${viewingPO.poNumber}` : ''} size="lg">
        {viewingPO && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><p className="font-display text-[10px] text-ink-3 uppercase">Status</p><p className="font-display text-espresso capitalize">{viewingPO.status}</p></div>
              <div><p className="font-display text-[10px] text-ink-3 uppercase">Expected</p><p className="font-display text-espresso">{formatDate(viewingPO.expectedDate)}</p></div>
              <div><p className="font-display text-[10px] text-ink-3 uppercase">Total</p><p className="font-display text-espresso font-semibold">{formatPrice(viewingPO.total)}</p></div>
            </div>
            <div className="rounded-xl border border-beige/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-canvas-2"><tr>
                  <th className="px-3 py-2 text-left font-display text-[10px] text-ink-3 uppercase">Item</th>
                  <th className="px-3 py-2 text-left font-display text-[10px] text-ink-3 uppercase">Qty</th>
                  <th className="px-3 py-2 text-left font-display text-[10px] text-ink-3 uppercase">Unit ₹</th>
                  <th className="px-3 py-2 text-left font-display text-[10px] text-ink-3 uppercase">Total</th>
                </tr></thead>
                <tbody className="divide-y divide-beige/20">
                  {viewingPO.items.map((it, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-sans text-xs text-espresso">{it.name}</td>
                      <td className="px-3 py-2 font-sans text-xs text-ink-2">{it.quantity} {it.unit}</td>
                      <td className="px-3 py-2 font-sans text-xs text-ink-2">{formatPrice(it.unitPrice)}</td>
                      <td className="px-3 py-2 font-sans text-xs text-espresso font-medium">{formatPrice(it.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {viewingPO.notes && <p className="font-sans text-xs text-ink-3">Notes: {viewingPO.notes}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
