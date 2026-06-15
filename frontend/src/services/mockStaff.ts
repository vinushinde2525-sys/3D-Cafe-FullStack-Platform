import type {
  Employee, Attendance, Shift, LeaveRequest,
  PayrollRecord, PerformanceReview, StaffHRStats
} from '@/types/staff';

const now   = new Date().toISOString();
const today = new Date().toISOString().split('T')[0];
const ago   = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString().split('T')[0]; };
const ahead = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; };
const isoAgo = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString(); };

// ── Employees ─────────────────────────────────────────────────────────────────
export const MOCK_EMPLOYEES: Employee[] = [
  {
    _id: 'emp-1', employeeId: 'EMP-001', name: 'Arjun Singh',    email: 'arjun@cafe3d.com',  phone: '+91 98765 11111',
    role: 'barista',  department: 'Front of House', status: 'active',  joinDate: isoAgo(720),
    salary: 28000, hourlyRate: 160, shift: 'morning',
    address: '14 Coffee Lane, Pune', emergencyContact: { name: 'Priya Singh',  phone: '+91 98765 00001', relation: 'Wife'    },
    documents: [{ type: 'Aadhaar', number: '****1234' }, { type: 'PAN', number: 'ABCDE1234F' }],
    skills: ['Espresso','Latte Art','Customer Service','POS'],
    createdAt: isoAgo(720),
  },
  {
    _id: 'emp-2', employeeId: 'EMP-002', name: 'Meena Joshi',    email: 'meena@cafe3d.com',  phone: '+91 87654 22222',
    role: 'chef',     department: 'Kitchen',         status: 'active',  joinDate: isoAgo(540),
    salary: 32000, hourlyRate: 190, shift: 'morning',
    address: '7 Spice Road, Pune', emergencyContact: { name: 'Rahul Joshi',   phone: '+91 87654 00002', relation: 'Husband' },
    documents: [{ type: 'Aadhaar', number: '****5678' }],
    skills: ['Continental','Indian Fusion','HACCP','Cold Kitchen'],
    createdAt: isoAgo(540),
  },
  {
    _id: 'emp-3', employeeId: 'EMP-003', name: 'Dev Kulkarni',   email: 'dev@cafe3d.com',    phone: '+91 76543 33333',
    role: 'cashier',  department: 'Front of House', status: 'active',  joinDate: isoAgo(365),
    salary: 22000, hourlyRate: 130, shift: 'afternoon',
    address: '3 Market St, Pune', emergencyContact: { name: 'Sunita Kulkarni', phone: '+91 76543 00003', relation: 'Mother' },
    documents: [{ type: 'Aadhaar', number: '****9012' }],
    skills: ['POS','Cash Handling','Customer Service'],
    createdAt: isoAgo(365),
  },
  {
    _id: 'emp-4', employeeId: 'EMP-004', name: 'Riya Desai',     email: 'riya@cafe3d.com',   phone: '+91 65432 44444',
    role: 'waiter',   department: 'Front of House', status: 'active',  joinDate: isoAgo(280),
    salary: 20000, hourlyRate: 115, shift: 'evening',
    address: '22 Park Ave, Pune', emergencyContact: { name: 'Ashok Desai',    phone: '+91 65432 00004', relation: 'Father' },
    documents: [{ type: 'Aadhaar', number: '****3456' }],
    skills: ['Table Service','Wine Service','Upselling'],
    createdAt: isoAgo(280),
  },
  {
    _id: 'emp-5', employeeId: 'EMP-005', name: 'Vikram Nair',    email: 'vikram@cafe3d.com', phone: '+91 54321 55555',
    role: 'delivery', department: 'Delivery',        status: 'active',  joinDate: isoAgo(200),
    salary: 18000, hourlyRate: 100, shift: 'afternoon',
    address: '8 Highway Rd, Pune', emergencyContact: { name: 'Latha Nair',     phone: '+91 54321 00005', relation: 'Mother' },
    documents: [{ type: 'Driving License', number: 'MH12-2019-0012345' }],
    skills: ['Route Planning','Two Wheeler','Customer Handling'],
    createdAt: isoAgo(200),
  },
  {
    _id: 'emp-6', employeeId: 'EMP-006', name: 'Pooja Menon',    email: 'pooja@cafe3d.com',  phone: '+91 43210 66666',
    role: 'manager',  department: 'Management',      status: 'active',  joinDate: isoAgo(900),
    salary: 52000, hourlyRate: 300, shift: 'morning',
    address: '5 Residency Rd, Pune', emergencyContact: { name: 'Anand Menon', phone: '+91 43210 00006', relation: 'Spouse' },
    documents: [{ type: 'Aadhaar', number: '****7890' }, { type: 'PAN', number: 'PQRST9876G' }],
    skills: ['Team Management','Inventory','P&L','Training','HR'],
    createdAt: isoAgo(900),
  },
  {
    _id: 'emp-7', employeeId: 'EMP-007', name: 'Sanjay Pawar',   email: 'sanjay@cafe3d.com', phone: '+91 32109 77777',
    role: 'barista',  department: 'Front of House', status: 'on_leave', joinDate: isoAgo(150),
    salary: 26000, hourlyRate: 150, shift: 'evening',
    address: '19 Lake View, Pune', emergencyContact: { name: 'Kavita Pawar',  phone: '+91 32109 00007', relation: 'Wife' },
    documents: [{ type: 'Aadhaar', number: '****2345' }],
    skills: ['Espresso','Cold Brew','Latte Art'],
    createdAt: isoAgo(150),
  },
];

// ── Attendance ────────────────────────────────────────────────────────────────
export const MOCK_ATTENDANCE: Attendance[] = [
  { _id:'att-1',  employee:'emp-1', employeeId:'EMP-001', date:today,    status:'present',  clockIn:'07:02', clockOut:'15:08', hoursWorked:8,   overtime:0,   createdAt:now },
  { _id:'att-2',  employee:'emp-2', employeeId:'EMP-002', date:today,    status:'present',  clockIn:'06:55', clockOut:'15:00', hoursWorked:8,   overtime:0,   createdAt:now },
  { _id:'att-3',  employee:'emp-3', employeeId:'EMP-003', date:today,    status:'present',  clockIn:'13:00', clockOut:'21:05', hoursWorked:8,   overtime:0,   createdAt:now },
  { _id:'att-4',  employee:'emp-4', employeeId:'EMP-004', date:today,    status:'present',  clockIn:'17:00', clockOut:'23:00', hoursWorked:6,   overtime:0,   createdAt:now },
  { _id:'att-5',  employee:'emp-5', employeeId:'EMP-005', date:today,    status:'present',  clockIn:'12:58', clockOut:'21:00', hoursWorked:8,   overtime:0,   createdAt:now },
  { _id:'att-6',  employee:'emp-6', employeeId:'EMP-006', date:today,    status:'present',  clockIn:'08:30', clockOut:'18:30', hoursWorked:9,   overtime:1,   createdAt:now },
  { _id:'att-7',  employee:'emp-7', employeeId:'EMP-007', date:today,    status:'on_leave', createdAt:now },
  { _id:'att-8',  employee:'emp-1', employeeId:'EMP-001', date:ago(1),   status:'present',  clockIn:'07:00', clockOut:'15:10', hoursWorked:8,   overtime:0,   createdAt:isoAgo(1) },
  { _id:'att-9',  employee:'emp-1', employeeId:'EMP-001', date:ago(2),   status:'present',  clockIn:'07:05', clockOut:'16:00', hoursWorked:8.9, overtime:0.9, createdAt:isoAgo(2) },
  { _id:'att-10', employee:'emp-3', employeeId:'EMP-003', date:ago(1),   status:'absent',   createdAt:isoAgo(1) },
  { _id:'att-11', employee:'emp-2', employeeId:'EMP-002', date:ago(1),   status:'present',  clockIn:'06:58', clockOut:'15:00', hoursWorked:8, overtime:0, createdAt:isoAgo(1) },
  { _id:'att-12', employee:'emp-4', employeeId:'EMP-004', date:ago(1),   status:'half_day', clockIn:'17:00', clockOut:'20:00', hoursWorked:3, overtime:0, createdAt:isoAgo(1) },
];

// ── Shifts ────────────────────────────────────────────────────────────────────
export const MOCK_SHIFTS: Shift[] = [
  { _id:'sh-1', name:'Morning Brew',   type:'morning',   startTime:'06:30', endTime:'14:30', breakMins:30, employees:['emp-1','emp-2','emp-6'], date:today,    isRecurring:false, createdAt:isoAgo(7) },
  { _id:'sh-2', name:'Afternoon Rush', type:'afternoon', startTime:'13:00', endTime:'21:00', breakMins:30, employees:['emp-3','emp-5'],         date:today,    isRecurring:false, createdAt:isoAgo(7) },
  { _id:'sh-3', name:'Evening Close',  type:'evening',   startTime:'17:00', endTime:'23:30', breakMins:30, employees:['emp-4'],                 date:today,    isRecurring:false, createdAt:isoAgo(7) },
  { _id:'sh-4', name:'Morning Brew',   type:'morning',   startTime:'06:30', endTime:'14:30', breakMins:30, employees:['emp-1','emp-2','emp-6'], date:ahead(1), isRecurring:false, createdAt:now },
  { _id:'sh-5', name:'Afternoon Rush', type:'afternoon', startTime:'13:00', endTime:'21:00', breakMins:30, employees:['emp-3','emp-5','emp-7'], date:ahead(1), isRecurring:false, createdAt:now },
];

// ── Leave Requests ────────────────────────────────────────────────────────────
export const MOCK_LEAVES: LeaveRequest[] = [
  { _id:'lv-1', employee:'emp-7', employeeName:'Sanjay Pawar',  type:'sick',    status:'approved', startDate:ago(3),    endDate:ahead(2),  days:6, reason:'Viral fever + recovery', approvedBy:'Pooja Menon', approvedAt:isoAgo(3), createdAt:isoAgo(4) },
  { _id:'lv-2', employee:'emp-4', employeeName:'Riya Desai',    type:'casual',  status:'pending',  startDate:ahead(5),  endDate:ahead(7),  days:3, reason:'Family function',       createdAt:isoAgo(1) },
  { _id:'lv-3', employee:'emp-3', employeeName:'Dev Kulkarni',  type:'earned',  status:'pending',  startDate:ahead(14), endDate:ahead(18), days:5, reason:'Vacation',              createdAt:isoAgo(2) },
  { _id:'lv-4', employee:'emp-1', employeeName:'Arjun Singh',   type:'sick',    status:'rejected', startDate:ago(10),   endDate:ago(9),    days:2, reason:'Not feeling well', approvedBy:'Pooja Menon', approvedAt:isoAgo(10), rejectionReason:'Peak weekend — unable to approve', createdAt:isoAgo(11) },
  { _id:'lv-5', employee:'emp-5', employeeName:'Vikram Nair',   type:'casual',  status:'approved', startDate:ago(20),   endDate:ago(20),   days:1, reason:'Personal work',         approvedBy:'Pooja Menon', approvedAt:isoAgo(20), createdAt:isoAgo(21) },
];

// ── Payroll ───────────────────────────────────────────────────────────────────
const CUR_MONTH = new Date().toISOString().slice(0, 7);
export const MOCK_PAYROLL: PayrollRecord[] = MOCK_EMPLOYEES.map((e, i) => ({
  _id:          `pay-${i + 1}`,
  employee:     e._id,
  employeeName: e.name,
  month:        CUR_MONTH,
  baseSalary:   e.salary,
  allowances:   Math.round(e.salary * 0.1),
  overtime:     i === 0 ? 600 : i === 5 ? 1500 : 0,
  deductions:   Math.round(e.salary * 0.04),
  tax:          Math.round(e.salary * 0.05),
  netSalary:    Math.round(e.salary * 1.01),
  daysPresent:  e.status === 'on_leave' ? 18 : 24,
  daysAbsent:   e.status === 'on_leave' ? 2  : 0,
  daysLeave:    e.status === 'on_leave' ? 6  : 0,
  status:       'draft',
  createdAt:    now,
}));

// ── Performance ───────────────────────────────────────────────────────────────
export const MOCK_PERFORMANCE: PerformanceReview[] = MOCK_EMPLOYEES.slice(0, 5).map((e, i) => ({
  _id:          `perf-${i + 1}`,
  employee:     e._id,
  employeeName: e.name,
  period:       '2024-Q2',
  scores: {
    punctuality:     [4.8, 4.5, 3.9, 4.2, 4.1][i],
    productivity:    [4.7, 4.8, 4.0, 4.3, 3.8][i],
    teamwork:        [4.9, 4.6, 4.2, 4.5, 4.4][i],
    customerService: [5.0, 4.0, 4.5, 4.8, 3.9][i],
    cleanliness:     [4.8, 4.9, 4.3, 4.2, 4.6][i],
  },
  overall: [4.84, 4.56, 4.18, 4.40, 4.16][i],
  feedback: ['Outstanding barista skills and customer rapport.','Excellent kitchen management.','Needs improvement on punctuality.','Great customer interaction.','Reliable delivery and route efficiency.'][i],
  goals: ['Train junior baristas','Introduce 2 new menu items','Improve clock-in consistency'][i < 3 ? i : 0].split(','),
  reviewedBy: 'Pooja Menon',
  createdAt:  isoAgo(14),
}));

// ── Stats ─────────────────────────────────────────────────────────────────────
export const MOCK_STAFF_STATS: StaffHRStats = {
  totalEmployees:   MOCK_EMPLOYEES.length,
  presentToday:     MOCK_ATTENDANCE.filter(a => a.date === today && a.status === 'present').length,
  absentToday:      MOCK_ATTENDANCE.filter(a => a.date === today && a.status === 'absent').length,
  onLeaveToday:     MOCK_ATTENDANCE.filter(a => a.date === today && a.status === 'on_leave').length,
  pendingLeaves:    MOCK_LEAVES.filter(l => l.status === 'pending').length,
  currentShiftCount:MOCK_SHIFTS.filter(s => s.date === today).reduce((sum, s) => sum + s.employees.length, 0),
  monthlyPayroll:   MOCK_PAYROLL.reduce((s, p) => s + p.netSalary, 0),
  avgAttendance:    88.4,
  avgPerformance:   4.43,
  byRole: { barista:2, chef:1, cashier:1, delivery:1, manager:1, cleaner:0, waiter:1 },
  byStatus: { active:6, on_leave:1, inactive:0, terminated:0 },
};
