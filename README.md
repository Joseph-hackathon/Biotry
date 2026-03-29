# BIOTRY: The Universal Protocol for Open Science

> **Decentralized Science (DeSci) protocol on Solana** — bridging fragmented scientific research and capital markets through a verifiable social graph, AI-driven trial simulations, and on-chain expertise metrics.

🔗 **Live Demo**: [https://biotry.vercel.app](https://biotry.vercel.app)  
🔗 **Contract (Devnet)**: [`2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y`](https://explorer.solana.com/address/2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y?cluster=devnet)  
🔗 **Backend API**: [https://biotry-production.up.railway.app](https://biotry-production.up.railway.app)

---

## The Problem

1. **Opaque Research**: Vital data locked behind expensive paywalls and centralized gatekeepers.
2. **Slow Valuation**: Centralized peer review cycles take years, slowing innovation.
3. **Funding Asymmetry**: A massive information gap between early-stage researchers and capital markets.
4. **Methodology Risk**: Traditional peer review fails to predict reproducibility before capital is spent.

## Our Solution

Biotry acts as a **fluid verification layer** where expertise is assetized and research is simulated. Combining Solana's high-speed transactions with decentralized AI simulations, we turn scientific storytelling into a transparent, verifiable, and financially rewarding outcome.

---

## Core Features

### 1. 📰 On-Chain Research Journal
Publish and discover peer-reviewed research stored and verified on Solana.
- **Create Posts**: Publish research with title, abstract, DOI, topics, and PDF attachments.
- **On-Chain Publication**: Research metadata published directly to the Solana Devnet via the `bio_dao` Anchor program.
- **Journal Feed**: Full-featured backend API (Express + Prisma + PostgreSQL via Supabase) for persistent research storage.
- **Post Detail View**: Rich markdown rendering with upvotes, comment counts, and research metadata.

### 2. 🤖 AI Research Simulator
Predict research viability through a multi-agent AI "War Room" analysis.
- **5 Specialized Agents**: Dr. Bio (DeSci Auditor), Solana Architect, ZK Shadow, Codama Bot, Colosseum Strategist.
- **Dynamic Analysis**: Every analysis is generated from the actual research paper's content — title, abstract, research field, and topics.
- **Colosseum Copilot Integration**: Optionally fetches real-world hackathon project data for competitive landscape analysis.
- **Strategic Metrics**: Success Rate, Impact Score, Crowdedness Score, Actionability Index, Time-to-Market.
- **Deep-Dive Reports**: Market Landscape, Concrete Problem, Quantified Impact, Revenue Model, GTM Strategy, Why Solana, Founder-Market Fit, and Risk Assessment — all derived from the research content.

### 3. 🔗 Social Graph (Discovery)
A living ecosystem of scientific expertise relationships.
- **Tapestry Integration**: Social graph mesh powered by Tapestry Protocol.
- **Expert Profiles**: On-chain reputation scores and interaction history.
- **Impact Metrics**: Quantifiable citation and collaboration metrics.

### 4. 🏛️ DAO Governance
Community-driven capital allocation and network evolution.
- **Bio Protocol**: Milestone-based funding for verified scientific problems.
- **Peer Review Bounties**: Qualified experts rewarded for verified critiques.
- **Research Problem Bounties**: Investors spin up milestone-based bounties for specific scientific goals.

---

## Technical Architecture

### System Overview

```
Frontend (Vercel)              Backend (Railway)          Blockchain (Solana Devnet)
┌─────────────────────┐       ┌──────────────────────┐   ┌──────────────────────────┐
│  React + Vite       │──────▶│  Express.js + Prisma │   │  bio_dao Anchor Program  │
│  Privy Auth         │       │  PostgreSQL (Supabase)│   │  2BY4tpMZVrHtz...        │
│  AI Simulator       │       │  /api/posts          │   │  MAX_TITLE_LEN: 200      │
│  Solana web3.js     │──────▶│  /api/hubs           │   │  MAX_CONTENT_URI_LEN: 512│
│  Anchor Framework   │       │  /api/editors        │   └──────────────────────────┘
└─────────────────────┘       │  /api/leaderboard    │
                               └──────────────────────┘
```

### Research Flow Sequence

```mermaid
sequenceDiagram
    participant R as Researcher
    participant B as Biotry (Solana)
    participant S as AI Simulation Node
    participant P as Peer Reviewers
    participant D as Funding DAOs / Investors
    
    R->>B: Submits Research Logs & Metadata
    B->>S: Triggers Methodology Simulation
    S-->>B: Returns Predictive Viability Score
    B-->>R: Assetizes Post & Mints Reputation
    P->>B: Interacts & Reviews Research
    B->>B: Calculates Impact Index & Reputation
    B->>D: Exposes Verified Research Metrics
    D->>B: Allocates Capital (Milestone-based)
    B-->>R: Unlocks Funding based on Impact
```

### Smart Contract: `bio_dao`

| Parameter | Value |
|---|---|
| **Program ID (Devnet)** | `2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y` |
| **IDL Account** | `95wXeNbryA7VbsbUFbBDm52EdSofv4G29ko6aCDrx1JB` |
| **MAX_TITLE_LEN** | `200` characters |
| **MAX_CONTENT_URI_LEN** | `512` characters |
| **Framework** | Anchor v0.32.1 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, GSAP Animations, Tailwind CSS |
| **Blockchain** | Solana (Devnet), Anchor Framework, web3.js v1 |
| **Authentication** | Privy (embedded wallet + social login) |
| **Backend** | Express.js, Prisma ORM, PostgreSQL (Supabase), Node.js |
| **Deployment** | Vercel (frontend), Railway (backend) |
| **Social Graph** | Tapestry Protocol |
| **AI Simulation** | Deterministic multi-agent engine + Colosseum Copilot API |

---

## Environment Variables

### Frontend (Vercel)
```env
VITE_API_URL=https://biotry-production.up.railway.app/api
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_COLOSSEUM_COPILOT_PAT=your_colosseum_pat  # Optional: enables real-world competitor data
```

### Backend (Railway)
```env
DATABASE_URL=postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:[pass]@db.[ref].supabase.co:5432/postgres
PORT=8080
```

---

## Database Schema

The backend uses PostgreSQL with Prisma ORM. Tables:

| Table | Description |
|---|---|
| `Post` | Research publications with metadata, content, upvotes |
| `Editor` | Platform editors and reviewers |
| `Hub` | Research domain hubs (e.g., Genomics, Drug Discovery) |
| `LeaderboardEntry` | Community reputation leaderboard |

---

## Installation & Development

### Prerequisites
- Node.js 18+
- Rust + Anchor CLI (for smart contract development)
- Solana CLI

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend
```bash
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Smart Contract
```bash
cd contract

# Build
anchor build

# Deploy to Devnet
anchor deploy --provider.cluster devnet

# Update IDL
anchor idl upgrade --filepath target/idl/bio_dao.json \
  2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y \
  --provider.cluster devnet
```

---

## Recent Updates

### v1.2 — AI Simulator Remaster (March 2026)
- ✅ Remastered AI Simulator into full-screen immersive experience
- ✅ 5 specialized AI agents with domain-specific analysis
- ✅ Dynamic analysis generation based on actual research content (no longer hardcoded)
- ✅ Integrated Colosseum Copilot API for competitive landscape data
- ✅ New strategic metrics: Actionability Index, Crowdedness Score, Market Landscape

### v1.1 — Smart Contract Expansion (March 2026)
- ✅ Expanded `MAX_TITLE_LEN` to **200** and `MAX_CONTENT_URI_LEN` to **512**
- ✅ Resolved `URITooLong` (Error 6003) on-chain publication error
- ✅ Redeployed contract to Devnet with updated IDL

### v1.0 — Production Launch (March 2026)
- ✅ Full-stack deployment: Vercel (frontend) + Railway (backend)
- ✅ PostgreSQL database via Supabase with connection pooling
- ✅ CORS policy configured for cross-origin API access
- ✅ SPA routing via `vercel.json` (no more 404 on page refresh)
- ✅ Privy authentication with embedded wallet support

---

## User Flow

1. **Onboard**: Connect via Solana Wallet (Privy) and verify identity.
2. **Discover**: Browse the research feed in the Journal.
3. **Publish**: Submit research with title, abstract, DOI, and on-chain signature.
4. **Simulate**: Select any research post and run the AI multi-agent analysis.
5. **Govern**: Participate in DAO voting and milestone-based funding.

---

© 2026 BIOTRY SYSTEMS // DISTRIBUTED VIA SOLANA & AI
