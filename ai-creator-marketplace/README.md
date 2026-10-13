# Kroma — AI Creator Marketplace Module

Kroma is a full-stack AI Creator Marketplace module built for hackathon evaluation, focusing on **Creator Profiles** and **AI Portfolios** with verifiable neural pipelines and commercial licensing disclosures.

---

## 🌟 Highlights & Key Features

- **Cinematic Dark Design**: Near-black backgrounds (`#07070a`), subtle hairline borders (`border-zinc-800`), violet accents (`#7c3aed`), and large visual portfolio cards with strict Zero-Pill typography.
- **Creator Discovery & Profiles**: Search and filter by specialization, verified AI tools, and skills. Rich profile view with bio, rates, external portfolio links, and commission inquiries.
- **Verifiable AI Portfolios**: Every artwork features aspect ratio controls, models used, multi-phase workflow steps (ideation, latent refinement, upscaling, grading), and commercial-use disclosures.
- **Full-Stack Express MVC**: Clean decoupled models (`User`, `CreatorProfile`, `PortfolioProject`), REST controllers, Zod validation, and centralized error handling.
- **MongoDB Atlas & Resilient Fallback**: Connects to MongoDB Atlas via Mongoose with an in-memory fallback that starts up immediately with 4 seeded creators and 8 detailed artworks.
- **JWT & Bcrypt Security**: Complete registration, login, and authorization checks ensuring creators can edit and delete only their own works.
- **Cloudinary Integration**: Multi-part file upload with buffer streaming and local preview fallback.
- **One-Click Demo Access**: Fast login switcher on the sign-in page to instantly evaluate Elena, Marcus, Aria, or Tate without typing credentials.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router 7, Lucide Icons, Motion
- **Backend**: Node.js, Express.js (MVC Pattern), TypeScript
- **Database**: MongoDB Atlas with Mongoose (with in-memory fallback)
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt
- **Media Engine**: Cloudinary SDK (with local file fallback)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Review the values:
```env
PORT=3000
NODE_ENV=development

# MongoDB Atlas URI (Optional — in-memory store activates if omitted)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/kroma?retryWrites=true&w=majority"

# JWT Auth Secret
JWT_SECRET="kroma_super_secure_jwt_secret_key_2026_hackathon"
JWT_EXPIRES_IN="7d"

# Cloudinary Storage (Optional — local previews activate if omitted)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
├── server/
│   ├── config/
│   │   ├── db.ts               # MongoDB Atlas connection & fallback
│   │   └── cloudinary.ts       # Cloudinary SDK & stream uploader
│   ├── controllers/
│   │   ├── authController.ts   # Register, Login, Me
│   │   ├── creatorController.ts# Creators listing & profiles
│   │   ├── projectController.ts# Portfolio CRUD, likes, filtering
│   │   └── uploadController.ts # File uploader
│   ├── middleware/
│   │   ├── auth.ts             # JWT verify & creator ownership guard
│   │   ├── validation.ts       # Zod schemas & validator
│   │   └── errorHandler.ts     # Centralized error handler
│   ├── models/
│   │   ├── mongooseSchemas.ts  # Mongoose Schemas & Models
│   │   └── types.ts            # TypeScript interfaces
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── creatorRoutes.ts
│   │   ├── projectRoutes.ts
│   │   └── uploadRoutes.ts
│   ├── seed/
│   │   └── seedData.ts         # 4 Creators & 8 Portfolios
│   └── store/
│       └── repository.ts       # Unified data access layer
├── src/
│   ├── api/
│   │   └── client.ts           # Typed API client with Bearer headers
│   ├── components/
│   │   ├── Navbar.tsx          # Top Bar Contract
│   │   ├── Footer.tsx
│   │   ├── ProjectCard.tsx     # Portfolio card with Zero-Pill metadata
│   │   ├── CreatorCard.tsx     # Studio profile card
│   │   └── FilterBar.tsx       # Segmented filter & search bar
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state, JWT storage, demo logins
│   ├── pages/
│   │   ├── DiscoveryPage.tsx   # Split hero & live filtered gallery
│   │   ├── CreatorsPage.tsx    # Creator studio directory
│   │   ├── CreatorProfilePage.tsx # Creator bio, tools, & portfolio
│   │   ├── ProjectDetailPage.tsx  # Verifiable workflows & licensing
│   │   ├── ProjectFormPage.tsx    # Create & edit project form
│   │   ├── LoginPage.tsx       # Fast 1-click test logins
│   │   ├── RegisterPage.tsx    # Studio registration
│   │   ├── EditProfilePage.tsx # Profile customization
│   │   ├── WorkflowsPage.tsx   # Pipeline timeline gallery
│   │   └── ArchitecturePage.tsx# In-depth technical spec
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.ts                   # Express server mounting Vite in dev
├── vite.config.ts
└── tsconfig.json
```

---

## 🧪 Seed Accounts & Credentials

For fast review, use the one-click buttons on `/login` or sign in with:
- `elena@kroma.ai` / `Creator123!` (Elena Rostova · Sci-Fi Worldbuilding)
- `marcus@kroma.ai` / `Creator123!` (Marcus Chen · Architectural Futurism)
- `aria@kroma.ai` / `Creator123!` (Aria Valen · AI Haute Couture)
- `tate@kroma.ai` / `Creator123!` (Tate Kincaid · Cinematic Motion)
