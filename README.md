<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=B89052&center=true&vCenter=true&width=600&lines=3D+Caf%C3%A9+%E2%80%94+Premium+Food+Ordering;React+%2B+Node+%2B+Three.js;Enterprise+Admin+ERP+%2B+CRM+%2B+HR;Real-time+%C2%B7+Excel%2FPDF+%C2%B7+3D+Visualisation" alt="Typing SVG" />
A full-stack food ordering platform with 3D product visualisation, enterprise-grade admin ERP, CRM, HR management, realtime dashboards, and Excel/PDF reporting.

Show Image
Show Image
Show Image
Show Image
Show Image
Show Image
Show Image

Show Image
Show Image
Show Image
Show Image

</div>

✨ Highlights

<table>
<tr>
<td width="50%" valign="top">
🛍️ Customer Experience


3D hero & interactive product viewer (React Three Fiber)
Real-time order tracking via Socket.io
Smooth scroll + micro-interactions (Lenis, Framer Motion, GSAP)
Demo Mode — fully functional with zero backend


</td>
<td width="50%" valign="top">
🧑‍💼 Admin / Enterprise


Inventory ERP — suppliers, POs, waste, transfers
CRM with loyalty tiers & reward history
Staff HR — attendance, shifts, leave, payroll, performance
Excel/PDF import-export center with audit history
Live Command Center dashboard


</td>
</tr>
</table>

🧰 Tech Stack

Frontend — React 18 · TypeScript · Vite · Tailwind CSS · Redux Toolkit · React Router · Framer Motion · GSAP · Lenis · React Three Fiber / Drei · ESLint (@typescript-eslint, react-hooks, react-refresh)

Backend — Node.js · Express · MongoDB / Mongoose · JWT · Passport (Google OAuth — optional) · Socket.io · Cloudinary (optional) · Stripe (optional) · Nodemailer (optional)


🚀 Quick Start

Prerequisites


Node.js 18+
MongoDB 6+ (or Atlas URI)
npm 9+


1. Clone & install

bash# Frontend
cd frontend
npm install

# Backend
cd backend
npm install

2. Configure environment

bash# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — fill in MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
# All other integrations (Google OAuth, Stripe, Cloudinary, Email) are optional —
# the backend boots cleanly and logs which ones are disabled if left blank.

# Frontend
cp frontend/.env.example frontend/.env
# Set VITE_DEMO_MODE=true for offline demo, false for live backend

3. Run

bash# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev

Frontend: http://localhost:5173
Backend:  http://localhost:5000


Switched branches or pulled changes? Clear Vite's cache before starting:
rm -rf frontend/node_modules/.vite — stale dev-server caches are the most common
cause of confusing "works after restart" errors.




🎭 Demo Mode

Set VITE_DEMO_MODE=true in frontend/.env to run entirely without a backend.

All data uses localStorage + mock data. This includes:


Menu browsing, cart, checkout
Admin dashboard, ERP, CRM, HR, Analytics
Excel import/export, audit logs
Demo auth (admin / staff / customer)
Forgot-password flow (validates against demo accounts, simulates the email step)
Customer block/unblock in CRM (persists for the session)



🗂️ Admin Panel

Visit /admin after logging in with an admin account. The sidebar is organized into collapsible groups; the active section auto-expands.

<details>
<summary><b>📋 Click to expand full navigation map</b></summary>
Dashboard
Orders
Menu
 ├ Products        /admin/menu        (supports ?category= filter)
 ├ Categories      /admin/categories
 └ Coupons         /admin/coupons
Customers
 ├ CRM             /admin/customers
 └ All Users       /admin/users
Inventory ERP      /admin/inventory   (tabs: Items · Suppliers · Purchase Orders · Waste · Stock History)
Staff HR
 ├ Dashboard       /admin/staff
 ├ Employees       /admin/staff/employees
 ├ Attendance      /admin/staff/attendance
 ├ Shifts          /admin/staff/shifts
 ├ Leave           /admin/staff/leaves
 ├ Payroll         /admin/staff/payroll
 └ Performance     /admin/staff/performance
Analytics           /admin/analytics
Reports             /admin/reports
Excel Center        /admin/excel-center   (tabs: Import · Export · Templates · History)
Command Center      /admin/command-center  (live socket-driven dashboard)
Audit Logs          /admin/audit-logs
Settings            /admin/settings

Customer detail pages (/admin/customers/:id) show profile, loyalty tier, and reward history. Employee detail pages (/admin/staff/employees/:id) show attendance, leave, and payroll history per employee.

</details>

📊 Excel ERP

Export

Every major data table has an Export button with a live progress indicator.

Entity.xlsx.pdfOrders✅✅Revenue✅✅Inventory (menu items)✅✅Stock Inventory (ERP)✅—Customers✅—Staff / Employees✅—Attendance✅—Payroll✅—Performance✅—Shift Schedule✅—Leave Requests✅—

Import

Supported: Products, Inventory, Coupons, Customers (with row-level validation and an error report before committing).

Templates

Download starter .xlsx templates for Products, Inventory, Coupons, Customers, Employees, and Suppliers from Excel Center → Templates.

History

Every import/export action is logged with row counts and error counts, viewable in Excel Center → History and cross-referenced in Audit Logs.


⚡ Realtime

Socket.io powers the Command Center live feed, kitchen order board, and customer order tracking. All socket hook functions are stable across re-renders by design (memoized in useSocket/useAuth), so effects that depend on them won't cause reconnect loops or duplicate listeners. When VITE_ENABLE_SOCKET is unset or the backend is offline, every socket function safely no-ops — no connection is attempted and no errors are thrown.


🐳 Docker

bashdocker-compose up --build

Services: frontend (Nginx) · backend (Node) · mongo (MongoDB 7)


🔌 Optional Integrations

All integrations fail gracefully — the app runs without them.

IntegrationRequiredEnv varsMongoDB✅ YesMONGODB_URIJWT✅ YesJWT_SECRET, JWT_REFRESH_SECRETGoogle OAuthOptionalGOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET — backend logs Google OAuth disabled and boots normally if unsetCloudinaryOptionalCLOUDINARY_*StripeOptionalSTRIPE_SECRET_KEYEmailOptionalSMTP_*


📁 Project Structure

cafe-project/
├── frontend/              # React + Vite SPA
│   ├── .eslintrc.cjs       # ESLint config (TS + react-hooks + react-refresh)
│   ├── src/
│   │   ├── pages/         # Route-level pages (admin, staff, customer)
│   │   ├── components/    # UI + feature components
│   │   ├── services/      # API + mock data + excel services
│   │   ├── store/         # Redux slices
│   │   ├── types/         # TypeScript interfaces
│   │   └── hooks/         # Custom React hooks (useAuth, useSocket, useCart)
│   └── .env.example
├── backend/               # Express REST API
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, validation
│   │   └── config/        # DB, passport, socket
│   └── .env.example
├── docker-compose.yml
└── README.md


✅ Build & Verify

bash# Frontend
cd frontend
npm run lint        # ESLint — should report 0 errors
npx tsc --noEmit    # TypeScript — should report 0 errors
npm run build       # Production build → frontend/dist/

# Backend — no build step needed (CommonJS)
cd backend
node -e "require('./src/server.js')"   # quick boot smoke test
# Deploy: NODE_ENV=production node src/server.js

If you see require is not defined or any other "works in one tab but not another" browser error after pulling changes, it's almost always a stale Vite dev-server cache — clear it with rm -rf frontend/node_modules/.vite and restart npm run dev before assuming it's a code bug.


<div align="center">
Built with ☕ and too many useEffect dependency arrays.

</div>