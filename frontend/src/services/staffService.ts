import api from '@/api/axios';
import { isBackendOnline } from '@/services/backendStatus';
import {
  MOCK_EMPLOYEES, MOCK_ATTENDANCE, MOCK_SHIFTS,
  MOCK_LEAVES, MOCK_PAYROLL, MOCK_PERFORMANCE, MOCK_STAFF_STATS,
} from './mockStaff';
import type {
  Employee, Attendance, Shift, LeaveRequest,
  PayrollRecord, PerformanceReview, StaffHRStats,
} from '@/types/staff';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// ── Employees ─────────────────────────────────────────────────────────────────
export const staffService = {
  async getAll(params?: Record<string, string>): Promise<Employee[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_EMPLOYEES; }
    try { const { data } = await api.get('/staff', { params }); return data.data; }
    catch { return MOCK_EMPLOYEES; }
  },

  async getById(id: string): Promise<Employee> {
    if (!isBackendOnline()) { await delay(); return MOCK_EMPLOYEES.find(e => e._id === id) ?? MOCK_EMPLOYEES[0]; }
    try { const { data } = await api.get(`/staff/${id}`); return data.data; }
    catch { return MOCK_EMPLOYEES.find(e => e._id === id) ?? MOCK_EMPLOYEES[0]; }
  },

  async create(payload: Partial<Employee>): Promise<Employee> {
    if (!isBackendOnline()) {
      await delay(400);
      const emp: Employee = {
        ...MOCK_EMPLOYEES[0], ...payload,
        _id: `emp-${Date.now()}`,
        employeeId: `EMP-${String(MOCK_EMPLOYEES.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      } as Employee;
      return emp;
    }
    const { data } = await api.post('/staff', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Employee>): Promise<Employee> {
    if (!isBackendOnline()) { await delay(300); return { ...MOCK_EMPLOYEES.find(e => e._id === id)!, ...payload }; }
    const { data } = await api.patch(`/staff/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    if (!isBackendOnline()) { await delay(300); return; }
    await api.delete(`/staff/${id}`);
  },

  async getStats(): Promise<StaffHRStats> {
    if (!isBackendOnline()) { await delay(); return MOCK_STAFF_STATS; }
    try { const { data } = await api.get('/staff/stats'); return data.data; }
    catch { return MOCK_STAFF_STATS; }
  },

  async clockIn(id: string): Promise<void> {
    if (!isBackendOnline()) { await delay(300); return; }
    await api.post(`/staff/${id}/clock-in`);
  },

  async clockOut(id: string): Promise<void> {
    if (!isBackendOnline()) { await delay(300); return; }
    await api.post(`/staff/${id}/clock-out`);
  },
};

// ── Attendance ─────────────────────────────────────────────────────────────────
export const attendanceService = {
  async getAll(params?: Record<string, string>): Promise<Attendance[]> {
    if (!isBackendOnline()) {
      await delay();
      let list = [...MOCK_ATTENDANCE];
      if (params?.date) list = list.filter(a => a.date === params.date);
      if (params?.employee) list = list.filter(a => a.employee === params.employee);
      return list;
    }
    try { const { data } = await api.get('/attendance', { params }); return data.data; }
    catch { return MOCK_ATTENDANCE; }
  },

  async markAttendance(payload: {
    employee: string; date: string; status: string; clockIn?: string; clockOut?: string; note?: string;
  }): Promise<Attendance> {
    if (!isBackendOnline()) {
      await delay(400);
      return { ...payload, _id: `att-${Date.now()}`, employeeId: '', createdAt: new Date().toISOString() } as Attendance;
    }
    const { data } = await api.post('/attendance', payload);
    return data.data;
  },

  async getEmployeeHistory(employeeId: string, month: string): Promise<Attendance[]> {
    if (!isBackendOnline()) {
      await delay();
      return MOCK_ATTENDANCE.filter(a => a.employee === employeeId && a.date.startsWith(month));
    }
    try { const { data } = await api.get(`/attendance/${employeeId}`, { params: { month } }); return data.data; }
    catch { return MOCK_ATTENDANCE.filter(a => a.employee === employeeId); }
  },
};

// ── Shifts ─────────────────────────────────────────────────────────────────────
export const shiftService = {
  async getAll(params?: Record<string, string>): Promise<Shift[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_SHIFTS; }
    try { const { data } = await api.get('/shifts', { params }); return data.data; }
    catch { return MOCK_SHIFTS; }
  },

  async create(payload: Partial<Shift>): Promise<Shift> {
    if (!isBackendOnline()) {
      await delay(400);
      return { ...payload, _id: `sh-${Date.now()}`, createdAt: new Date().toISOString() } as Shift;
    }
    const { data } = await api.post('/shifts', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Shift>): Promise<Shift> {
    if (!isBackendOnline()) { await delay(300); return { ...MOCK_SHIFTS.find(s => s._id === id)!, ...payload }; }
    const { data } = await api.patch(`/shifts/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    if (!isBackendOnline()) { await delay(300); return; }
    await api.delete(`/shifts/${id}`);
  },
};

// ── Leaves ─────────────────────────────────────────────────────────────────────
export const leaveService = {
  async getAll(params?: Record<string, string>): Promise<LeaveRequest[]> {
    if (!isBackendOnline()) {
      await delay();
      let list = [...MOCK_LEAVES];
      if (params?.status) list = list.filter(l => l.status === params.status);
      return list;
    }
    try { const { data } = await api.get('/leaves', { params }); return data.data; }
    catch { return MOCK_LEAVES; }
  },

  async request(payload: Partial<LeaveRequest>): Promise<LeaveRequest> {
    if (!isBackendOnline()) {
      await delay(400);
      return { ...payload, _id: `lv-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() } as LeaveRequest;
    }
    const { data } = await api.post('/leaves', payload);
    return data.data;
  },

  async approve(id: string, note?: string): Promise<void> {
    if (!isBackendOnline()) { await delay(400); return; }
    await api.patch(`/leaves/${id}/approve`, { note });
  },

  async reject(id: string, reason: string): Promise<void> {
    if (!isBackendOnline()) { await delay(400); return; }
    await api.patch(`/leaves/${id}/reject`, { reason });
  },
};

// ── Payroll ─────────────────────────────────────────────────────────────────────
export const payrollService = {
  async getAll(params?: Record<string, string>): Promise<PayrollRecord[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_PAYROLL; }
    try { const { data } = await api.get('/payroll', { params }); return data.data; }
    catch { return MOCK_PAYROLL; }
  },

  async process(month: string): Promise<void> {
    if (!isBackendOnline()) { await delay(800); return; }
    await api.post('/payroll/process', { month });
  },

  async markPaid(id: string): Promise<void> {
    if (!isBackendOnline()) { await delay(400); return; }
    await api.patch(`/payroll/${id}/paid`);
  },

  async getPerformance(params?: Record<string, string>): Promise<PerformanceReview[]> {
    if (!isBackendOnline()) { await delay(); return MOCK_PERFORMANCE; }
    try { const { data } = await api.get('/staff/performance', { params }); return data.data; }
    catch { return MOCK_PERFORMANCE; }
  },
};
