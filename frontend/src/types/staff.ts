// ─────────────────────────────────────────────────────────────────────────────
// Staff HR ERP Types
// ─────────────────────────────────────────────────────────────────────────────

export type EmployeeRole    = 'barista' | 'chef' | 'cashier' | 'delivery' | 'manager' | 'cleaner' | 'waiter';
export type EmployeeStatus  = 'active' | 'on_leave' | 'inactive' | 'terminated';
export type ShiftType       = 'morning' | 'afternoon' | 'evening' | 'night' | 'split';
export type LeaveType       = 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity' | 'unpaid';
export type LeaveStatus     = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type AttendanceStatus= 'present' | 'absent' | 'half_day' | 'on_leave' | 'holiday' | 'week_off';

export interface Employee {
  _id:            string;
  employeeId:     string;         // EMP-001
  name:           string;
  email:          string;
  phone:          string;
  role:           EmployeeRole;
  department:     string;
  status:         EmployeeStatus;
  avatar?:        string;
  joinDate:       string;
  terminationDate?: string;
  salary:         number;         // monthly gross
  hourlyRate:     number;
  shift:          ShiftType;
  address:        string;
  emergencyContact: { name: string; phone: string; relation: string };
  documents:      { type: string; number: string }[];
  skills:         string[];
  notes?:         string;
  createdAt:      string;
}

export interface Attendance {
  _id:        string;
  employee:   string | Employee;
  employeeId: string;
  date:       string;             // YYYY-MM-DD
  status:     AttendanceStatus;
  clockIn?:   string;            // ISO time
  clockOut?:  string;
  hoursWorked?: number;
  overtime?:  number;
  note?:      string;
  approvedBy?: string;
  createdAt:  string;
}

export interface Shift {
  _id:         string;
  name:        string;
  type:        ShiftType;
  startTime:   string;            // "07:00"
  endTime:     string;            // "15:00"
  breakMins:   number;
  employees:   string[];          // employee IDs
  date:        string;            // YYYY-MM-DD (for specific day assignment)
  weekday?:    number;            // 0=Sun for recurring
  isRecurring: boolean;
  createdAt:   string;
}

export interface LeaveRequest {
  _id:        string;
  employee:   string | Employee;
  employeeName: string;
  type:       LeaveType;
  status:     LeaveStatus;
  startDate:  string;
  endDate:    string;
  days:       number;
  reason:     string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt:  string;
}

export interface PayrollRecord {
  _id:           string;
  employee:      string | Employee;
  employeeName:  string;
  month:         string;          // "2024-06"
  baseSalary:    number;
  allowances:    number;
  overtime:      number;
  deductions:    number;
  tax:           number;
  netSalary:     number;
  daysPresent:   number;
  daysAbsent:    number;
  daysLeave:     number;
  status:        'draft' | 'processed' | 'paid';
  paidDate?:     string;
  createdAt:     string;
}

export interface PerformanceReview {
  _id:           string;
  employee:      string;
  employeeName:  string;
  period:        string;          // "2024-Q2"
  scores: {
    punctuality:     number;      // 1–5
    productivity:    number;
    teamwork:        number;
    customerService: number;
    cleanliness:     number;
  };
  overall:       number;
  feedback:      string;
  goals:         string[];
  reviewedBy:    string;
  createdAt:     string;
}

export interface StaffHRStats {
  totalEmployees:    number;
  presentToday:      number;
  absentToday:       number;
  onLeaveToday:      number;
  pendingLeaves:     number;
  currentShiftCount: number;
  monthlyPayroll:    number;
  avgAttendance:     number;      // %
  avgPerformance:    number;      // out of 5
  byRole:            Record<EmployeeRole, number>;
  byStatus:          Record<EmployeeStatus, number>;
}
