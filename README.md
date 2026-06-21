# 3D Café — Premium Food Ordering Platform

[![Frontend CI](https://github.com/vinushinde2525-sys/3dcafe/actions/workflows/frontend.yml/badge.svg)](https://github.com/vinushinde2525-sys/3dcafe/actions/workflows/frontend.yml)
[![Backend CI](https://github.com/vinushinde2525-sysE/3dcafe/actions/workflows/backend.yml/badge.svg)](https://github.com/vinushinde2525-sys/3dcafe/actions/workflows/backend.yml)

A full-stack food ordering platform with 3D product visualisation, enterprise-grade admin ERP, CRM, HR management, realtime dashboards, and Excel/PDF reporting.

---

## Features

- **3D Menu** — Three.js/React Three Fiber product viewer per item
- **Cart & Checkout** — Redux-managed cart with coupon validation and Stripe payments (optional)
- **Realtime** — Socket.io live order tracking, kitchen queue, command center dashboard
- **Admin ERP** — Inventory management, purchase orders, waste tracking, supplier management
- **CRM** — Customer loyalty tiers, reward history, block/unblock
- **Staff HR** — Employees, attendance, shifts, leave requests, payroll, performance
- **Excel Center** — Import/export for orders, inventory, customers, staff (`.xlsx` + `.pdf`)
- **Auth** — JWT (access + refresh tokens), Google OAuth, email verification, password reset
- **Demo Mode** — Full app usable without a backend (`VITE_DEMO_MODE=true`)

---

## Tech Stack

**Frontend** — React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router v6, React Query, Framer Motion, GSAP, Lenis, React Three Fiber/Drei, Socket.io-client

**Backend** — Node.js, Express, MongoDB/Mongoose, JWT, Passport (Google OAuth), Socket.io, Cloudinary (optional), Stripe (optional), Nodemailer (optional)

**Testing** — Vitest + React Testing Library (frontend), Jest + Supertest (backend)

**CI/CD** — GitHub Actions (frontend.yml, backend.yml)

---

## Project Structure

```
3dcafe/
├── .github/
│   └── workflows/
│       ├── frontend.yml       # Frontend CI: test + build
│       └── backend.yml        # Backend CI: test + startup verify
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instance + typed API services
│   │   ├── components/        # UI, admin, staff, menu, cart, 3d, realtime
│   │   ├── hooks/             # useAuth, useCart, useSocket, useLenis
│   │   ├── layouts/           # AuthLayout, MainLayout, DashboardLayout
│   │   ├── pages/             # Route-level pages (admin/, staff/, customer/, auth/)
│   │   ├── routes/            # React Router config (protected routes)
│   │   ├── services/          # demoAuth, backendStatus, excel, mock data, socket
│   │   ├── store/             # Redux store + slices (auth, cart, ui, theme)
│   │   └── types/             # TypeScript interfaces
│   ├── public/images/         # Food, menu, and branding assets
│   ├── vite.config.ts         # Vitest config included
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/            # database.js, passport.js, cloudinary.js
│   │   ├── controllers/       # authController, userController, foodController, …
│   │   ├── middleware/        # authMiddleware, roleMiddleware, validateMiddleware, errorHandler, rateLimitMiddleware
│   │   ├── models/            # User, FoodItem, Order, Coupon, Review, Inventory
│   │   ├── routes/            # auth, users, food, orders, cart, coupons, reviews, inventory, payments, analytics, upload
│   │   ├── services/          # authService, foodService, orderService, …
│   │   ├── socket/            # Socket.io initialisation + event handlers
│   │   ├── tests/             # Jest test suite
│   │   │   ├── setup.js       # Test environment vars
│   │   │   └── unit.test.js   # ApiError, ApiResponse, middleware, token utils
│   │   └── utils/             # ApiError, ApiResponse, generateTokens, sendEmail, seedData
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+ (or Atlas URI)
- npm 9+

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/3dcafe.git
cd 3dcafe
```

### 2. Install

```bash
# Frontend
cd frontend
npm install

# Backend (separate terminal)
cd backend
npm install
```

### 3. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Required: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
# All other integrations (Google, Stripe, Cloudinary, Email) are optional

# Frontend
cp frontend/.env.example frontend/.env
# Set VITE_DEMO_MODE=true for no-backend demo
```

### 4. Run

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- Health:   http://localhost:5000/health

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | — | `development` / `production` |
| `PORT` | — | Default `5000` |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Min 32 chars |
| `JWT_REFRESH_SECRET` | ✅ | Min 32 chars |
| `JWT_EXPIRE` | — | Default `7d` |
| `JWT_REFRESH_EXPIRE` | — | Default `30d` |
| `FRONTEND_URL` | — | CORS origin, default `http://localhost:5173` |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth |
| `CLOUDINARY_CLOUD_NAME` | Optional | Image uploads |
| `CLOUDINARY_API_KEY` | Optional | Image uploads |
| `CLOUDINARY_API_SECRET` | Optional | Image uploads |
| `STRIPE_SECRET_KEY` | Optional | Payments |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhooks |
| `SMTP_HOST` | Optional | Transactional email |
| `SMTP_PORT` | Optional | Default `587` |
| `SMTP_USER` | Optional | SMTP credentials |
| `SMTP_PASS` | Optional | SMTP credentials |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL, default `/api` |
| `VITE_DEMO_MODE` | `true` = no backend needed |
| `VITE_ENABLE_SOCKET` | `true` = enable realtime |
| `VITE_SOCKET_URL` | Socket.io server URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional, for payments |

---

## Scripts

### Frontend

```bash
cd frontend

npm run dev        # Start Vite dev server (port 5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run lint       # ESLint
npm test           # Run Vitest (single run)
npm run test:watch # Vitest watch mode
```

### Backend

```bash
cd backend

npm run dev        # Nodemon dev server
npm start          # Production (node src/server.js)
npm test           # Jest test suite
npm run seed       # Seed demo data to MongoDB
```

---

## Running Tests

### Frontend Tests

```bash
cd frontend
npm test
```

Current coverage:
- `cartSlice` — 20 tests (reducer + selectors)
- `Button` component — 4 tests
- `authSlice` — 12 tests (sync reducers + async thunks)
- `backendStatus` service — 9 tests

### Backend Tests

```bash
cd backend
npm test
```

Coverage:
- `ApiError` / `ApiResponse` utilities — 6 tests
- `errorHandler` middleware — 6 tests
- `roleMiddleware` — 7 tests
- `generateTokens` utilities — 5 tests
- `validateMiddleware` — 1 test

---

## Build

### Frontend

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

Code is split into manual chunks (react-vendor, redux-vendor, three-vendor, motion-vendor, query-vendor) for optimal loading.

### Backend

No build step required (CommonJS). Deploy with:

```bash
NODE_ENV=production node src/server.js
```

---

## Demo Mode

Set `VITE_DEMO_MODE=true` in `frontend/.env` to run without a backend.

Demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@cafe3d.com | Admin@1234 |
| Staff | staff@cafe3d.com | Staff@1234 |
| Customer | customer@cafe3d.com | Customer@1234 |

---

## Admin Panel

Navigate to `/admin` after logging in as admin.

```
Dashboard          /admin
Orders             /admin/orders
Menu → Products    /admin/menu
Menu → Coupons     /admin/coupons
Customers (CRM)    /admin/customers
Users              /admin/users
Inventory ERP      /admin/inventory
Staff HR           /admin/staff/*
Analytics          /admin/analytics
Excel Center       /admin/excel-center
Command Center     /admin/command-center
Audit Logs         /admin/audit-logs
Settings           /admin/settings
```

---

## Deployment

### Render (current)

Both services are deployed on Render. Set all environment variables in Render's dashboard.

**Backend** — Web Service, `npm start`, Node 18+

**Frontend** — Static Site or Web Service with `npm run build`, publish `dist/`

### Docker

```bash
docker-compose up --build
# Services: frontend (Nginx), backend (Node), mongo (MongoDB 7)
```

---

## GitHub Actions

Two workflows run on push/PR to `main` and `develop`:

- **frontend.yml** — installs deps, runs Vitest, builds React app
- **backend.yml** — installs deps, spins up MongoDB service, runs Jest, verifies server startup

Update the badge URLs at the top of this README with your actual GitHub username/repo.

---

## Troubleshooting

**Vite stale cache** — After pulling changes or switching branches:
```bash
rm -rf frontend/node_modules/.vite
```

**Backend not connecting** — Check `MONGODB_URI` and that MongoDB is running. The health endpoint `GET /health` returns status.

**Tests failing due to missing mocks** — The frontend test suite mocks `@/api/axios`, `@/api/services`, `@/services/demoAuth`, and `@/services/backendStatus`. Do not remove those mocks from test files.

**Google OAuth disabled** — Expected if `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are not set. The backend logs `Google OAuth disabled` and boots normally.

---

## License

MIT
