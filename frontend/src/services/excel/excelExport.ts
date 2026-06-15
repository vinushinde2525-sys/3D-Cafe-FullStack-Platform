/**
 * excelExport.ts — all export workbooks
 * Uses SheetJS (xlsx) for broad compatibility.
 * Generates styled workbooks with headers, data, totals.
 */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MOCK_RECENT_ORDERS } from '@/services/mockAnalytics';
import { MOCK_FOOD_ITEMS } from '@/services/mockData';
import type { Order, FoodItem, User } from '@/types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function wb(): XLSX.WorkBook { return XLSX.utils.book_new(); }
function save(workbook: XLSX.WorkBook, filename: string) {
  const buf = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename);
}

function sheet<T extends object>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): XLSX.WorkSheet {
  const rows = [
    headers.map(h => h.label),
    ...data.map(row => headers.map(h => {
      const v = row[h.key];
      if (v instanceof Date) return v.toLocaleDateString('en-IN');
      return v ?? '';
    })),
  ];
  return XLSX.utils.aoa_to_sheet(rows);
}

// ── Orders Export ─────────────────────────────────────────────────────────────
export function exportOrders(orders: Order[] = MOCK_RECENT_ORDERS) {
  const rows = orders.map(o => ({
    orderNumber:   o.orderNumber,
    date:          new Date(o.createdAt).toLocaleDateString('en-IN'),
    customer:      typeof o.user === 'object' ? (o.user as any).name ?? 'Guest' : 'Guest',
    items:         o.items.map(i => `${i.name} ×${i.quantity}`).join('; '),
    subtotal:      o.subtotal,
    tax:           o.tax,
    deliveryFee:   o.deliveryFee,
    discount:      o.discount + o.couponDiscount,
    total:         o.total,
    status:        o.status,
    payment:       o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderType:     o.orderType,
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'orderNumber',   label: 'Order #' },
    { key: 'date',          label: 'Date' },
    { key: 'customer',      label: 'Customer' },
    { key: 'items',         label: 'Items' },
    { key: 'subtotal',      label: 'Subtotal (₹)' },
    { key: 'tax',           label: 'Tax (₹)' },
    { key: 'deliveryFee',   label: 'Delivery (₹)' },
    { key: 'discount',      label: 'Discount (₹)' },
    { key: 'total',         label: 'Total (₹)' },
    { key: 'status',        label: 'Status' },
    { key: 'payment',       label: 'Payment Method' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'orderType',     label: 'Type' },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Orders');

  // Summary sheet
  const total = orders.reduce((s, o) => s + o.total, 0);
  const sumData = [
    ['Summary'],
    ['Total Orders', orders.length],
    ['Total Revenue (₹)', total],
    ['Avg Order Value (₹)', orders.length ? Math.round(total / orders.length) : 0],
    ['Paid', orders.filter(o => o.paymentStatus === 'paid').length],
    ['Pending Payment', orders.filter(o => o.paymentStatus === 'pending').length],
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(sumData), 'Summary');

  save(workbook, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Revenue Export ────────────────────────────────────────────────────────────
export function exportRevenue(salesData: { _id: string; revenue: number; orders: number }[]) {
  const workbook = wb();
  const rows = salesData.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders }));
  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'date',    label: 'Date' },
    { key: 'revenue', label: 'Revenue (₹)' },
    { key: 'orders',  label: 'Orders' },
  ];
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Revenue');

  // Monthly rollup
  const monthly: Record<string, number> = {};
  salesData.forEach(d => {
    const month = d._id.slice(0, 7);
    monthly[month] = (monthly[month] || 0) + d.revenue;
  });
  const monthlyData = [
    ['Month', 'Revenue (₹)'],
    ...Object.entries(monthly).map(([m, r]) => [m, r]),
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(monthlyData), 'Monthly');

  save(workbook, `revenue_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Inventory / Menu Export ───────────────────────────────────────────────────
export function exportInventory(items: FoodItem[] = MOCK_FOOD_ITEMS) {
  const rows = items.map(i => ({
    name:           i.name,
    category:       i.category,
    price:          i.price,
    discountPrice:  i.discountPrice ?? '',
    isAvailable:    i.isAvailable ? 'Yes' : 'No',
    isVegetarian:   i.isVegetarian ? 'Yes' : 'No',
    isVegan:        i.isVegan ? 'Yes' : 'No',
    isGlutenFree:   i.isGlutenFree ? 'Yes' : 'No',
    isSpicy:        i.isSpicy ? 'Yes' : 'No',
    rating:         i.rating,
    reviewCount:    i.reviewCount,
    orderCount:     i.orderCount,
    prepTime:       i.preparationTime,
    tags:           i.tags?.join(', ') ?? '',
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'name',          label: 'Name'            },
    { key: 'category',      label: 'Category'        },
    { key: 'price',         label: 'Price (₹)'       },
    { key: 'discountPrice', label: 'Offer Price (₹)' },
    { key: 'isAvailable',   label: 'Available'       },
    { key: 'isVegetarian',  label: 'Vegetarian'      },
    { key: 'isVegan',       label: 'Vegan'           },
    { key: 'isGlutenFree',  label: 'Gluten Free'     },
    { key: 'isSpicy',       label: 'Spicy'           },
    { key: 'rating',        label: 'Rating'          },
    { key: 'reviewCount',   label: 'Reviews'         },
    { key: 'orderCount',    label: 'Orders'          },
    { key: 'prepTime',      label: 'Prep Time (min)' },
    { key: 'tags',          label: 'Tags'            },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Inventory');
  save(workbook, `inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Stock Inventory Export (ERP items: stock levels, suppliers, costs) ────────
export function exportStockInventory(items: { name: string; category: string; currentStock: number; minimumStock: number; maximumStock: number; unit: string; reorderPoint: number; costPerUnit: number; totalValue: number; supplier?: string | { name?: string } }[]) {
  const rows = items.map(i => ({
    name:          i.name,
    category:      i.category,
    currentStock:  i.currentStock,
    minimumStock:  i.minimumStock,
    maximumStock:  i.maximumStock,
    unit:          i.unit,
    reorderPoint:  i.reorderPoint,
    costPerUnit:   i.costPerUnit,
    totalValue:    i.totalValue,
    supplier:      typeof i.supplier === 'object' ? i.supplier?.name ?? '' : i.supplier ?? '',
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'name',         label: 'Item Name'        },
    { key: 'category',     label: 'Category'         },
    { key: 'currentStock', label: 'Current Stock'    },
    { key: 'minimumStock', label: 'Min Stock'        },
    { key: 'maximumStock', label: 'Max Stock'        },
    { key: 'unit',         label: 'Unit'             },
    { key: 'reorderPoint', label: 'Reorder Point'    },
    { key: 'costPerUnit',  label: 'Cost/Unit (₹)'    },
    { key: 'totalValue',   label: 'Total Value (₹)'  },
    { key: 'supplier',     label: 'Supplier'         },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Stock Inventory');
  save(workbook, `stock_inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Attendance Export ──────────────────────────────────────────────────────
export function exportAttendance(records: { employee: { name?: string } | string; date: string; status: string; clockIn?: string; clockOut?: string; hoursWorked?: number }[], employeeNames: Record<string, string> = {}) {
  const rows = records.map(r => ({
    employee: typeof r.employee === 'object' ? r.employee?.name ?? '' : employeeNames[r.employee] ?? r.employee,
    date: new Date(r.date).toLocaleDateString('en-IN'),
    status: r.status,
    clockIn: r.clockIn ?? '',
    clockOut: r.clockOut ?? '',
    hoursWorked: r.hoursWorked ?? 0,
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'employee',    label: 'Employee'     },
    { key: 'date',        label: 'Date'         },
    { key: 'status',      label: 'Status'       },
    { key: 'clockIn',     label: 'Clock In'     },
    { key: 'clockOut',    label: 'Clock Out'    },
    { key: 'hoursWorked', label: 'Hours Worked' },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Attendance');
  save(workbook, `attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Employees Export ───────────────────────────────────────────────────────
export function exportEmployees(employees: { name: string; email: string; phone: string; role: string; department: string; status: string; salary: number; hourlyRate: number; shift: string; joinDate: string }[]) {
  const rows = employees.map(e => ({
    name: e.name, email: e.email, phone: e.phone, role: e.role, department: e.department,
    status: e.status, salary: e.salary, hourlyRate: e.hourlyRate, shift: e.shift,
    joinDate: new Date(e.joinDate).toLocaleDateString('en-IN'),
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'name',       label: 'Name'         },
    { key: 'email',      label: 'Email'        },
    { key: 'phone',      label: 'Phone'        },
    { key: 'role',       label: 'Role'         },
    { key: 'department', label: 'Department'   },
    { key: 'status',     label: 'Status'       },
    { key: 'salary',     label: 'Salary (₹)'   },
    { key: 'hourlyRate', label: 'Hourly (₹)'   },
    { key: 'shift',      label: 'Shift'        },
    { key: 'joinDate',   label: 'Joined'       },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Employees');
  save(workbook, `employees_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Payroll Export ─────────────────────────────────────────────────────────
export function exportPayroll(records: { employeeName: string; month: string; baseSalary: number; allowances: number; overtime: number; deductions: number; tax: number; netSalary: number; daysPresent: number; daysAbsent: number; status: string }[]) {
  const rows = records.map(r => ({
    employeeName: r.employeeName,
    month:        r.month,
    baseSalary:   r.baseSalary,
    allowances:   r.allowances,
    overtime:     r.overtime,
    deductions:   r.deductions,
    tax:          r.tax,
    netSalary:    r.netSalary,
    daysPresent:  r.daysPresent,
    daysAbsent:   r.daysAbsent,
    status:       r.status,
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'employeeName', label: 'Employee'      },
    { key: 'month',        label: 'Month'         },
    { key: 'baseSalary',   label: 'Base Salary (₹)' },
    { key: 'allowances',   label: 'Allowances (₹)'  },
    { key: 'overtime',     label: 'Overtime (₹)'    },
    { key: 'deductions',   label: 'Deductions (₹)'  },
    { key: 'tax',          label: 'Tax (₹)'         },
    { key: 'netSalary',    label: 'Net Salary (₹)'  },
    { key: 'daysPresent',  label: 'Days Present'   },
    { key: 'daysAbsent',   label: 'Days Absent'    },
    { key: 'status',       label: 'Status'         },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Payroll');
  save(workbook, `payroll_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Performance Reviews Export ─────────────────────────────────────────────
export function exportPerformance(reviews: { employeeName: string; period: string; scores: { punctuality: number; productivity: number; teamwork: number; customerService: number; cleanliness: number }; overall: number; feedback: string }[]) {
  const rows = reviews.map(r => ({
    employeeName: r.employeeName, period: r.period,
    punctuality: r.scores.punctuality, productivity: r.scores.productivity,
    teamwork: r.scores.teamwork, customerService: r.scores.customerService,
    cleanliness: r.scores.cleanliness, overall: r.overall, feedback: r.feedback,
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'employeeName',    label: 'Employee'        },
    { key: 'period',          label: 'Period'          },
    { key: 'punctuality',     label: 'Punctuality'     },
    { key: 'productivity',    label: 'Productivity'    },
    { key: 'teamwork',        label: 'Teamwork'        },
    { key: 'customerService', label: 'Customer Service' },
    { key: 'cleanliness',     label: 'Cleanliness'     },
    { key: 'overall',         label: 'Overall Score'   },
    { key: 'feedback',        label: 'Feedback'        },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Performance');
  save(workbook, `performance_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Shift Schedule Export ──────────────────────────────────────────────────
export function exportShifts(shifts: { name: string; type: string; startTime: string; endTime: string; date: string; employees: string[] }[]) {
  const rows = shifts.map(s => ({
    name: s.name, type: s.type, startTime: s.startTime, endTime: s.endTime,
    date: new Date(s.date).toLocaleDateString('en-IN'), assignedCount: s.employees.length,
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'name',          label: 'Shift'         },
    { key: 'type',          label: 'Type'          },
    { key: 'startTime',     label: 'Start'         },
    { key: 'endTime',       label: 'End'           },
    { key: 'date',          label: 'Date'          },
    { key: 'assignedCount', label: 'Staff Assigned' },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Shifts');
  save(workbook, `shift_schedule_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Leave Requests Export ──────────────────────────────────────────────────
export function exportLeaves(leaves: { employeeName: string; type: string; status: string; startDate: string; endDate: string; days: number; reason: string }[]) {
  const rows = leaves.map(l => ({
    employeeName: l.employeeName, type: l.type, status: l.status,
    startDate: new Date(l.startDate).toLocaleDateString('en-IN'),
    endDate: new Date(l.endDate).toLocaleDateString('en-IN'),
    days: l.days, reason: l.reason,
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'employeeName', label: 'Employee'   },
    { key: 'type',         label: 'Leave Type' },
    { key: 'status',       label: 'Status'     },
    { key: 'startDate',    label: 'Start Date' },
    { key: 'endDate',      label: 'End Date'   },
    { key: 'days',         label: 'Days'       },
    { key: 'reason',       label: 'Reason'     },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Leave Requests');
  save(workbook, `leave_requests_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ── Customers Export ──────────────────────────────────────────────────────────
export function exportCustomers(customers: User[]) {
  const rows = customers.map(c => ({
    name:          c.name,
    email:         c.email,
    phone:         c.phone ?? '',
    role:          c.role,
    verified:      c.isVerified ? 'Yes' : 'No',
    blocked:       c.isBlocked ? 'Yes' : 'No',
    loyaltyPoints: c.loyaltyPoints,
    totalOrders:   c.totalOrders,
    totalSpent:    c.totalSpent,
    joined:        new Date(c.createdAt).toLocaleDateString('en-IN'),
  }));

  const headers: { key: keyof typeof rows[0]; label: string }[] = [
    { key: 'name',          label: 'Name'           },
    { key: 'email',         label: 'Email'          },
    { key: 'phone',         label: 'Phone'          },
    { key: 'role',          label: 'Role'           },
    { key: 'verified',      label: 'Verified'       },
    { key: 'blocked',       label: 'Blocked'        },
    { key: 'loyaltyPoints', label: 'Loyalty Points' },
    { key: 'totalOrders',   label: 'Total Orders'   },
    { key: 'totalSpent',    label: 'Total Spent (₹)'},
    { key: 'joined',        label: 'Joined'         },
  ];

  const workbook = wb();
  XLSX.utils.book_append_sheet(workbook, sheet(rows, headers), 'Customers');
  save(workbook, `customers_${new Date().toISOString().split('T')[0]}.xlsx`);
}
