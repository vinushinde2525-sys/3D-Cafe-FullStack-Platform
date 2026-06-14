<div align="center">
<!-- Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=☕%203D%20Café&fontSize=70&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Premium%20Full-Stack%20Food%20Ordering%20Platform&descAlignY=62&descSize=20" width="100%" />
<br/>
<!-- Row 1 — Stack -->
Show Image
Show Image
Show Image
Show Image

<!-- Row 2 — Details -->
Show Image
Show Image
Show Image
Show Image

<br/>
<!-- GitHub Stats -->
Show Image
Show Image
Show Image
Show Image

<br/>
🌐 Live Demo · 📖 Documentation · 🐛 Report Bug · ✨ Request Feature

</div>

📖 About the Project


3D Café is a production-grade, full-stack food ordering platform built with the MERN stack — crafted to deliver an immersive, modern café experience through interactive 3D visuals, real-time order tracking, and role-based dashboards.



This project was engineered as a portfolio-ready, production-style application showcasing expertise across the full spectrum of modern web development: from 3D rendering with Three.js and real-time communication via Socket.io, to secure JWT authentication and containerised deployments with Docker.

The frontend runs fully in Demo Mode — no backend required — making it instantly deployable to Vercel or Netlify for live demonstrations.

<details>
<summary>📸 Screenshots (click to expand)</summary>
<br/>

🖼️ Hero / Landing Page
Show Image




🖼️ Menu & Cart
Show Image




🖼️ Admin Dashboard
Show Image




🖼️ Order Tracking
Show Image



</details>

✨ Features

<details open>
<summary>👤 Customer Experience</summary>

☕ Immersive interactive 3D café landing experience
🍽️ Browse categorised menu items with rich visuals
🛒 Add/remove items from a persistent cart (local storage)
💳 Simulated checkout and payment flow via Stripe
📦 Full order history tracking and status updates
🔐 User authentication, profile management, and OAuth login


</details>
<details>
<summary>🛡️ Admin Dashboard</summary>

📊 Analytics overview with key business metrics
🍕 Full menu and category management (CRUD)
👥 User management and role assignment
📋 Real-time order monitoring
🔒 Role-based access control (RBAC)


</details>
<details>
<summary>👨‍🍳 Staff Portal</summary>

⚡ Real-time order updates via Socket.io
🔄 Order status management (Pending → In Progress → Ready)
🧾 Kitchen workflow support and queue management


</details>
<details>
<summary>⚙️ Technical Highlights</summary>

🎭 Demo Mode — fully functional frontend without a backend
📱 Fully responsive design across all screen sizes
🔐 Protected routes with JWT + refresh token support
🗃️ Redux Toolkit for scalable global state management
✅ End-to-end form validation with Zod
🎬 Smooth animations via Framer Motion and GSAP
🌐 Real-time bidirectional communication with Socket.io
🔑 Optional Google OAuth 2.0 integration


</details>

🎥 Demo Credentials


The application runs fully offline in Demo Mode — no backend or environment setup required.



RoleEmailPassword👤 Customercustomer@cafe3d.comCustomer@1234🛡️ Adminadmin@cafe3d.comAdmin@1234👨‍🍳 Staffstaff@cafe3d.comStaff@1234

Demo Mode includes: mock auth · mock menu/category data · simulated payments · persistent cart · order history · local storage persistence


🛠️ Tech Stack

Frontend

TechnologyPurposeShow ImageUI component libraryShow ImageType-safe developmentShow ImageLightning-fast build toolShow ImageUtility-first stylingShow ImageGlobal state managementShow ImageDeclarative 3D renderingShow ImageDeclarative animationsShow ImageSchema validation

Backend

TechnologyPurposeShow ImageServer runtimeShow ImageREST API frameworkShow ImageNoSQL databaseShow ImageReal-time communicationShow ImageAuthentication tokensShow ImagePayment processingShow ImageImage managementShow ImageOAuth authentication

DevOps & Infrastructure

TechnologyPurposeShow ImageContainerisationShow ImageFrontend deploymentShow ImageFrontend deployment


🏗️ Architecture & Project Structure

bashcafe-project/
│
├── 📁 frontend/
│   ├── public/
│   │   └── images/               # Static assets
│   ├── src/
│   │   ├── api/                  # Axios instances & API clients
│   │   ├── components/           # Reusable UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # Page layout wrappers
│   │   ├── pages/                # Route-level page components
│   │   ├── routes/               # Protected & public route config
│   │   ├── services/             # Business logic & service layer
│   │   ├── store/                # Redux slices & store config
│   │   ├── styles/               # Global styles
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Helper functions
│   ├── vercel.json               # Vercel SPA config
│   └── netlify.toml              # Netlify SPA config
│
└── 📁 backend/
    └── src/
        ├── controllers/          # Request handlers
        ├── models/               # Mongoose schemas
        ├── routes/               # API route definitions
        ├── services/             # Business logic layer
        └── socket/               # Socket.io event handlers


🚀 Getting Started

Prerequisites

Ensure the following are installed:


Node.js ≥ 18.x
npm ≥ 9.x or yarn
MongoDB (for full-stack mode)
Docker (optional, for containerised setup)



⚙️ Installation

⚡ Option 1 — Frontend Only (Demo Mode)

Zero configuration required. No backend needed.

bash# Clone the repository
git clone https://github.com/YOUR_USERNAME/cafe-3d.git
cd cafe-3d/frontend

# Install dependencies
npm install

# Start the development server
npm run dev

🌐 Open http://localhost:5173 in your browser.


🗄️ Option 2 — Full Stack Setup

Step 1 — Configure backend environment

bashcp backend/.env.example backend/.env

Update backend/.env with your credentials:

envMONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

Step 2 — Start the backend

bashcd backend
npm install
npm run seed    # Seed initial data
npm run dev     # Start dev server

Backend available at: http://localhost:5000

Step 3 — Start the frontend

bashcd frontend
cp .env.example .env.local

Configure the API URL:

envVITE_API_URL=http://localhost:5000/api

bashnpm install
npm run dev

Frontend available at: http://localhost:5173


🐳 Option 3 — Docker

Development

bashdocker-compose --profile dev up --build

Production

bashdocker-compose up --build -d

Service Ports

ServicePortFrontend5173Backend API5000MongoDB27017Mongo Express8081


💻 Usage

RoleAccess URLCapabilityCustomer/ → LoginBrowse menu, manage cart, checkout, view ordersAdmin/admin/dashboardFull platform management — menu, users, ordersStaff/staff/ordersView & update order statuses in real time


🔌 Optional Integrations

<details>
<summary>🔑 Google OAuth</summary>
envGOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

Redirect URI: http://localhost:5000/api/auth/google/callback

</details>
<details>
<summary>🖼️ Cloudinary (Image Uploads)</summary>
envCLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

</details>
<details>
<summary>💳 Stripe (Payments)</summary>
envSTRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

</details>

☁️ Deployment

Deploy to Vercel

bashcd frontend
npm run build

SettingValueBuild Commandnpm run buildOutput DirectorydistEnvironment VariablesNone required (Demo Mode)

Deploy to Netlify

bashcd frontend
npm run build

Upload the generated dist/ folder. SPA routing is pre-configured via netlify.toml.


🔒 Security

FeatureImplementationPassword hashingbcryptAuthenticationJWT + Refresh TokensAuthorisationRole-Based Access Control (RBAC)API protectionExpress Rate LimitingHTTP headersHelmet.jsQuery safetyMongoDB query sanitisationCORSStrict origin configuration


🌟 Key Highlights


🎨 Production-quality codebase — clean architecture, strict TypeScript throughout
🧩 Modular & scalable — feature-based folder structure, Redux slices, service layer separation
🎮 3D-powered UI — immersive experience built with React Three Fiber and Drei
🔄 Real-time everywhere — Socket.io powers live order status updates for customers and staff
🧪 Demo Mode — zero-config frontend demonstration with full feature fidelity
🔐 Enterprise-grade auth — JWT refresh tokens, Google OAuth, bcrypt hashing, RBAC
📦 DevOps ready — fully containerised with Docker Compose for dev and production



🗺️ Roadmap


 💳 Live Stripe payment integration (production mode)
 🔔 Push notifications (web + mobile)
 📦 Inventory management system
 🤖 AI-powered food recommendation engine
 🏪 Multi-vendor / multi-branch support
 📱 Progressive Web App (PWA)
 📊 Advanced analytics dashboard with data visualisation
 🌍 Internationalisation (i18n) support



🤝 Contributing

Contributions, issues, and feature requests are welcome!

bash# Fork the repository
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request

Please ensure your code follows the existing TypeScript conventions and passes linting before submitting a PR.


📄 License

Distributed under the MIT License. See LICENSE for full details.

Free to use for educational, portfolio, and commercial projects.


👨‍💻 Author

<div align="center">
Built with ❤️ as a portfolio-grade MERN Stack project

Demonstrating expertise in:

Full Stack Development · State Management · Auth & Authorisation · Real-Time Applications · 3D Web Experiences · Modern UI/UX · Deployment & DevOps

<br/>
Show Image
Show Image
Show Image

</div>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>
⭐ Star this repository if you found it useful! ⭐

</div>