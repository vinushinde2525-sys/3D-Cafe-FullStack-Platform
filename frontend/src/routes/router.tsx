import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from '@/components/common/LoadingScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { StaffRoute } from './StaffRoute';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// ── Lazy page imports ────────────────────────────────────────────────────────
const HomePage        = lazy(() => import('@/pages/HomePage'));
const MenuPage        = lazy(() => import('@/pages/MenuPage'));
const FoodDetailPage  = lazy(() => import('@/pages/FoodDetailPage'));
const CartPage        = lazy(() => import('@/pages/CartPage'));
const CheckoutPage    = lazy(() => import('@/pages/CheckoutPage'));
const OrderConfirmPage = lazy(() => import('@/pages/OrderConfirmPage'));
const OffersPage      = lazy(() => import('@/pages/OffersPage'));
const AboutPage       = lazy(() => import('@/pages/AboutPage'));

// Auth
const LoginPage       = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage    = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage    = lazy(() => import('@/pages/auth/VerifyEmailPage'));

// Customer
const ProfilePage     = lazy(() => import('@/pages/customer/ProfilePage'));
const OrdersPage      = lazy(() => import('@/pages/customer/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/customer/OrderDetailPage'));

// Admin
const AdminDashboard  = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminOrders     = lazy(() => import('@/pages/admin/OrdersPage'));
const AdminMenu       = lazy(() => import('@/pages/admin/MenuPage'));
const AdminCategories = lazy(() => import('@/pages/admin/CategoriesPage'));
const AdminUsers      = lazy(() => import('@/pages/admin/UsersPage'));
const AdminCoupons    = lazy(() => import('@/pages/admin/CouponsPage'));
const AdminInventory  = lazy(() => import('@/pages/admin/InventoryPage'));
const AdminAnalytics  = lazy(() => import('@/pages/admin/AnalyticsPage'));
const AdminReports    = lazy(() => import('@/pages/admin/ReportsPage'));
const AdminCommandCenter = lazy(() => import('@/pages/admin/CommandCenter'));
const AdminExcelCenter   = lazy(() => import('@/pages/admin/excel/ExcelCenterPage'));
const AdminSettings      = lazy(() => import('@/pages/admin/settings/SettingsPage'));
const AdminAuditLogs      = lazy(() => import('@/pages/admin/audit/AuditLogsPage'));

// Admin CRM
const AdminCustomers      = lazy(() => import('@/pages/admin/customers/CustomersPage'));
const AdminCustomerDetail = lazy(() => import('@/pages/admin/customers/CustomerDetailPage'));

// Admin Staff HR
const AdminStaffDashboard  = lazy(() => import('@/pages/admin/staff/StaffDashboard'));
const AdminEmployees       = lazy(() => import('@/pages/admin/staff/EmployeesPage'));
const AdminEmployeeDetails = lazy(() => import('@/pages/admin/staff/EmployeeDetailsPage'));
const AdminAttendance      = lazy(() => import('@/pages/admin/staff/AttendancePage'));
const AdminShifts          = lazy(() => import('@/pages/admin/staff/ShiftSchedulerPage'));
const AdminLeaves          = lazy(() => import('@/pages/admin/staff/LeaveManagementPage'));
const AdminPayroll         = lazy(() => import('@/pages/admin/staff/PayrollOverviewPage'));
const AdminPerformance     = lazy(() => import('@/pages/admin/staff/PerformancePage'));

// Staff
const StaffKitchen    = lazy(() => import('@/pages/staff/KitchenPage'));
const StaffOrders     = lazy(() => import('@/pages/staff/OrdersPage'));
const StaffInventory  = lazy(() => import('@/pages/staff/InventoryPage'));

// Error
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'));
const ErrorPage       = lazy(() => import('@/pages/ErrorPage'));

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const router = createBrowserRouter([
  // ── Public routes ────────────────────────────────────────────────────────
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <S><ErrorPage /></S>,
    children: [
      { index: true,              element: <S><HomePage /></S> },
      { path: 'menu',             element: <S><MenuPage /></S> },
      { path: 'menu/:id',         element: <S><FoodDetailPage /></S> },
      { path: 'offers',           element: <S><OffersPage /></S> },
      { path: 'about',            element: <S><AboutPage /></S> },
      { path: 'cart',             element: <S><CartPage /></S> },
      {
        path: 'checkout',
        element: <ProtectedRoute><S><CheckoutPage /></S></ProtectedRoute>,
      },
      {
        path: 'order-confirm/:id',
        element: <ProtectedRoute><S><OrderConfirmPage /></S></ProtectedRoute>,
      },
      // Customer
      {
        path: 'profile',
        element: <ProtectedRoute><S><ProfilePage /></S></ProtectedRoute>,
      },
      {
        path: 'orders',
        element: <ProtectedRoute><S><OrdersPage /></S></ProtectedRoute>,
      },
      {
        path: 'orders/:id',
        element: <ProtectedRoute><S><OrderDetailPage /></S></ProtectedRoute>,
      },
    ],
  },

  // ── Auth routes ──────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: 'login',                      element: <S><LoginPage /></S> },
      { path: 'register',                   element: <S><RegisterPage /></S> },
      { path: 'forgot-password',            element: <S><ForgotPasswordPage /></S> },
      { path: 'reset-password/:token',      element: <S><ResetPasswordPage /></S> },
      { path: 'verify-email/:token',        element: <S><VerifyEmailPage /></S> },
    ],
  },

  // ── Admin routes ─────────────────────────────────────────────────────────
  {
    path: 'admin',
    element: <AdminRoute><DashboardLayout /></AdminRoute>,
    children: [
      { index: true,           element: <S><AdminDashboard /></S> },
      { path: 'orders',        element: <S><AdminOrders /></S> },
      { path: 'menu',          element: <S><AdminMenu /></S> },
      { path: 'categories',    element: <S><AdminCategories /></S> },
      { path: 'users',         element: <S><AdminUsers /></S> },
      { path: 'customers',     element: <S><AdminCustomers /></S> },
      { path: 'customers/:id', element: <S><AdminCustomerDetail /></S> },
      { path: 'coupons',       element: <S><AdminCoupons /></S> },
      { path: 'inventory',     element: <S><AdminInventory /></S> },
      { path: 'analytics',       element: <S><AdminAnalytics /></S> },
      { path: 'reports',         element: <S><AdminReports /></S> },
      { path: 'excel-center',    element: <S><AdminExcelCenter /></S> },
      { path: 'command-center',  element: <S><AdminCommandCenter /></S> },
      { path: 'audit-logs',      element: <S><AdminAuditLogs /></S> },
      { path: 'settings',        element: <S><AdminSettings /></S> },
      // Staff HR
      { path: 'staff',          element: <S><AdminStaffDashboard /></S> },
      { path: 'staff/employees',element: <S><AdminEmployees /></S> },
      { path: 'staff/employees/:id', element: <S><AdminEmployeeDetails /></S> },
      { path: 'staff/attendance',    element: <S><AdminAttendance /></S> },
      { path: 'staff/shifts',        element: <S><AdminShifts /></S> },
      { path: 'staff/leaves',        element: <S><AdminLeaves /></S> },
      { path: 'staff/payroll',       element: <S><AdminPayroll /></S> },
      { path: 'staff/performance',   element: <S><AdminPerformance /></S> },
    ],
  },

  // ── Staff routes ─────────────────────────────────────────────────────────
  {
    path: 'staff',
    element: <StaffRoute><DashboardLayout /></StaffRoute>,
    children: [
      { index: true,           element: <S><StaffKitchen /></S> },
      { path: 'orders',        element: <S><StaffOrders /></S> },
      { path: 'inventory',     element: <S><StaffInventory /></S> },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: '*', element: <S><NotFoundPage /></S> },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});

// Export the raw router object as default.
// App.tsx uses: import router from '@/routes' → <RouterProvider router={router} />
export default router;
