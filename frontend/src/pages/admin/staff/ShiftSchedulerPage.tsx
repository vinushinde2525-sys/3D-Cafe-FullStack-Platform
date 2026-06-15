import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { ShiftCalendar } from '@/components/admin/staff/ShiftCalendar';
import { ShiftEditorModal } from '@/components/admin/staff/ShiftEditorModal';
import { ExcelExportModal } from '@/components/admin/excel/ExcelExportModal';
import { FoodGridSkeleton } from '@/components/common/Skeletons';
import { shiftService, staffService } from '@/services/staffService';
import toast from 'react-hot-toast';
import type { Shift, Employee } from '@/types/staff';

export default function ShiftSchedulerPage() {
  const [shifts,    setShifts]    = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Shift | null>(null);
  const [targetDate,setTargetDate]= useState<string | undefined>(undefined);
  const [exportOpen,setExportOpen]= useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, e] = await Promise.all([shiftService.getAll(), staffService.getAll()]);
      setShifts(s); setEmployees(e);
    } catch { toast.error('Failed to load shifts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = (date: string) => { setEditing(null); setTargetDate(date); setShowModal(true); };
  const openEdit = (shift: Shift) => { setEditing(shift); setTargetDate(undefined); setShowModal(true); };

  const deleteShift = async (id: string) => {
    if (!confirm('Delete this shift?')) return;
    try { await shiftService.delete(id); toast.success('Shift deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  // Summary stats
  const totalStaffScheduled = new Set(shifts.flatMap(s => s.employees)).size;
  const shiftCounts = shifts.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1; return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Shift Scheduler</h1>
          <p className="font-sans text-sm text-ink-3">{shifts.length} shifts · {totalStaffScheduled} staff scheduled</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={load} className="btn-secondary h-9 px-3">
            <RefreshCw size={13} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setExportOpen(true)} className="btn-secondary h-9 px-4 text-sm gap-2">
            <Download size={13} /> Export
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => openAdd(new Date().toISOString().split('T')[0])}
            className="btn-primary h-9 px-4 text-sm gap-2">
            <Plus size={13} /> Add Shift
          </motion.button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(shiftCounts).map(([type, count]) => (
          <div key={type} className="flex items-center gap-2 px-3 py-1.5 bg-canvas-2 rounded-full">
            <span className="font-display text-xs text-espresso font-semibold">{count}</span>
            <span className="font-sans text-xs text-ink-3 capitalize">{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 rounded-full">
          <span className="font-display text-xs text-gold font-semibold">{totalStaffScheduled}</span>
          <span className="font-sans text-xs text-ink-3">staff scheduled</span>
        </div>
      </div>

      {loading
        ? <FoodGridSkeleton count={3} />
        : (
          <ShiftCalendar
            shifts={shifts}
            employees={employees}
            onAddShift={openAdd}
            onEditShift={openEdit}
          />
        )
      }

      <ShiftEditorModal
        shift={editing}
        date={targetDate}
        employees={employees}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); load(); }}
        onDelete={async (id) => { await deleteShift(id); setShowModal(false); }}
      />

      <ExcelExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} type="shifts" data={shifts} label="Shift Schedule" />
    </div>
  );
}
