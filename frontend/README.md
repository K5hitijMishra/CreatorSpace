# CreatorSpace Frontend Workspace

Independent React 19 + TypeScript + Vite frontend client for **CreatorSpace** (Synapse AI Creative Marketplace).

---

## 🚀 Quick Start (Running Independently)

You can open this `frontend/` directory directly in VS Code / Cursor as its own workspace or run from a dedicated terminal:

```bash
# 1. Navigate to frontend directory (if not already inside)
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server with Hot Module Replacement
npm run dev
```

The application will be accessible at **`http://localhost:5173`**.

---

## ⚡ Connecting to the Backend

1. When the backend service (`backend/`) is running on `http://localhost:5000`, Vite will automatically proxy all `/api/*` requests directly to `http://localhost:5000` via `vite.config.ts`.
2. If the backend is running on a different port or server, you can create a `.env` file from `.env.example`:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
3. If the backend is not started yet, the frontend includes a resilient offline mock fallback layer so the full UI and all interactions still function smoothly!

---

## 🛠️ Available Scripts

- `npm run dev`: Launch local Vite dev server with fast HMR (`http://localhost:5173`)
- `npm run build`: Type-check with `tsc` and produce an optimized production bundle in `dist/`
- `npm run preview`: Preview the production bundle locally
- `npm run lint`: Lint TypeScript files with Oxlint

---

## 🧩 Key Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── CreatorCard.tsx             # 3D holographic creator card + verification trust scores
│   │   ├── SearchAndFilters.tsx        # Multi-facet filters (tools, disciplines, formats, verification)
│   │   ├── WorkflowInspectorModal.tsx  # ComfyUI node graph inspection & provenance hashes
│   │   ├── AIBriefBuilder.tsx          # AI Brief Co-Pilot synthesis interface
│   │   ├── BriefsMarketplace.tsx       # Creative brief pitches & brand listings
│   │   ├── CommissionModal.tsx         # Smart escrow commission initiation
│   │   ├── DataModelView.tsx           # Interactive data model & architectural schemas
│   │   └── NeuralCanvas.tsx            # Ambient canvas background
│   ├── utils/
│   │   ├── api.ts                      # Clean API client talking to backend /api
│   │   └── sound.ts                    # Audio feedback sound generator
│   ├── types/                          # TypeScript definitions (CreatorProfile, VerificationSignal, etc.)
│   ├── data/                           # Fallback mock dataset
│   ├── App.tsx                         # Main SPA router & navigation
│   └── index.css                       # Complete design system & token definitions
```
