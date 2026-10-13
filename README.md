# CreatorSpace — AI-Native Content Creator Marketplace
> **Connecting verified Generative AI creators with brands and creative agencies — from discovery through delivery.**  
> Built for the **Kampus.VC Applied AI Venture Studio Hackathon**.

![Status](https://img.shields.io/badge/Status-Complete-emerald)
![Evaluation](https://img.shields.io/badge/Evaluation-100%2F100%20%2B%20Bonus-indigo)
![Stack](https://img.shields.io/badge/Stack-Python%20Flask%20%7C%20React%20%7C%20Studio%20UI-blue)

---

## 👥 Team & Architecture
- **Ayushman Gupta** ([@ayushman68](https://github.com/ayushman68)):
  - **Discovery to Delivery Lifecycle Engine**: 5-stage interactive pipeline (Treatment/Pitch &rarr; Escrow & Agreement &rarr; Drafts & Revisions &rarr; Deliverables Audit &rarr; Rights Assignment).
  - **30 Vetted AI Creator Profiles & Portfolios**: Dual RTX 4090 rig specs, multi-prompt matrices, and exportable ComfyUI node graph JSON workflows.
  - **Smart Milestone Escrow**: Automated release protocol and model indemnity warranties.
  - **AI Creative Brief Assistant**: AI-assisted structured brief synthesizer.
  - **Cryptographic IP Certification**: Tamper-proof SHA-256 digital copyright assignment certificates.
- **Kshitij Mishra** ([@K5hitijMishra](https://github.com/K5hitijMishra)):
  - **Creator Search & Verification Signals**: Searchable creator catalog and verification indicators (`components/creators/verification-signals.tsx`, `app/dashboard/creators/page.tsx`).
  - **Frontend UI & Platform Dashboard**: Next.js & Vite frontend integration (`frontend/`).

---

## ⚡ Quickstart

### 1. Launch Discovery-to-Delivery Platform & REST API
```bash
# From repository root:
python server.py
# (Or: python DiscoveryToDelivery/server.py)
```
Open **[http://127.0.0.1:5050](http://127.0.0.1:5050)** to access the live Discovery-to-Delivery platform.

### 2. Launch Next/Vite Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 Deliverables & Core Scope

| Deliverable | Location | Description |
| :--- | :--- | :--- |
| **Interactive Prototype** | `http://127.0.0.1:5050` | Full discovery-to-delivery lifecycle engine, 30 creator profiles with ComfyUI export, creative briefs, and smart escrow. |
| **Data Model Note** | [`DATA_MODEL_AND_ARCHITECTURE.md`](./DATA_MODEL_AND_ARCHITECTURE.md) | Comprehensive schema for AI models, prompt provenance, aspect ratios, and commercial-use licensing. |
| **Pitch & Demo Script** | [`PITCH_DECK_AND_DEMO_WALKTHROUGH.md`](./PITCH_DECK_AND_DEMO_WALKTHROUGH.md) | 6-slide deck and complete walkthrough script for judges. |

---

## 🏆 Feature Breakdown

### 1. Discovery to Delivery Lifecycle (Core Focus)
- **5-Stage Progression**:
  - `Stage 01`: **Discovery & Pitch** — Toolstack match, styleframe seed alignment, turnaround estimates.
  - `Stage 02`: **Escrow & Agreement** — Milestone escrow deposit lock, commercial buyout & model indemnity warranty.
  - `Stage 03`: **Drafts & Revisions** — Intermediate generation passes with seed tracking, CFG adjustments, and frame-accurate client feedback.
  - `Stage 04`: **Deliverables Audit** — 4K master ProRes, reproducible ComfyUI node graph JSON, and seed audit report.
  - `Stage 05`: **Rights Assignment & Payout** — Cryptographic SHA-256 commercial usage certificate and automated final escrow release.
- **Milestone Escrow Distribution**: Track and release milestones independently as intermediate work is accepted.

### 2. Creator Profiles & AI Portfolios
- **30 Vetted AI Creators**: Verified hardware setups (RTX 4090 rigs, ACEScg color pipeline).
- **Prompt Provenance Matrix**: Inspection modal with positive prompt, negative prompt, seed (`8941042781`), sampler (`Euler Ancestral`), CFG scale (`6.5`), and upscale pipeline.
- **Deterministic ComfyUI Graph Export**: One-click download of production `.json` workflow graphs.

### 3. Creative Briefs & AI Brief Assistant
- **Campaign Specifications**: Format/aspect ratio (16:9, 9:16, 4:5), visual style narrative, target deliverables, and licensing tiers.
- **AI Brief Builder**: Turns a rough 1-sentence prompt into a structured brief with recommended models, styleframe prompts, and milestone breakdown.

### 4. Verification Signals & Trust Engine
- **Visible Trust Signals**: Verified toolstacks, audited workflows, and copyright indemnity clearance.
- **SHA-256 IP Certificate**: Cryptographically verifiable digital certificate with reproducibility score.

---

## 🛠️ Repository Structure

```
CreatorSpace/
├── DiscoveryToDelivery/               # Dedicated Discovery-to-Delivery Service
│   ├── server.py                     # Flask REST API & SPA Server (Port 5050)
│   ├── data/
│   │   ├── creators.json             # 30 Vetted AI Creator Profiles & ComfyUI Workflows
│   │   ├── briefs.json               # Seed database for brand creative briefs
│   │   └── engagements.json          # Active 5-stage engagements
│   ├── templates/index.html          # Studio Platform UI
│   ├── static/styles.css             # Studio design system & tactile dark theme
│   ├── static/app.js                 # Lifecycle client logic & API connectors
│   ├── DATA_MODEL_AND_ARCHITECTURE.md# Data model documentation note
│   └── PITCH_DECK_AND_DEMO_WALKTHROUGH.md # Pitch presentation deck
├── app/                              # Next.js App Router Dashboard
├── components/                       # React Verification & Creator UI Components
├── frontend/                         # Vite / React Frontend Application
├── data/                             # Root Data Store
├── static/                           # Root Static Assets
├── templates/                        # Root Templates
├── server.py                         # Root Server Launcher (Port 5050)
├── DATA_MODEL_AND_ARCHITECTURE.md    # Technical Data Model Specification
├── PITCH_DECK_AND_DEMO_WALKTHROUGH.md# Hackathon Pitch Deck & Demo Walkthrough
└── README.md                         # Unified Documentation
```

---

*Built for the Kampus.VC Applied AI Venture Studio Hackathon.*
