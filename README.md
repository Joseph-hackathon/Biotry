# BIOTRY: The Universal Protocol for Open Science 🔬

> **Decentralized Science (DeSci) protocol on Solana** — bridging fragmented scientific research and capital markets through x402 Micropayment Protocol, AI-driven trial simulations, and on-chain expertise metrics.

🔗 **Live Demo**: [https://biotry.vercel.app](https://biotry.vercel.app)  
🔗 **Protocol Explorer**: [`2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y`](https://explorer.solana.com/address/2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y?cluster=devnet)  
🔗 **Backend API**: [https://biotry-production.up.railway.app](https://biotry-production.up.railway.app)

---

## ⚡ The Scientific Monetization Layer (x402)

Biotry pioneers the **Scientific Micropayment Protocol (MPP)** to eliminate the friction between research discovery and academic access. By wrapping research abstracts, dataset insights, and AI simulations behind the **x402 standard**, Biotry democratizes premium scientific information.

### The Problem vs. The BIP (Biotry Improvement Proposal)
Traditional academic access is locked behind exorbitant $35+ paywalls. Biotry disrupts this gatekeeping:
- **Fluid Access**: Access high-value "AI Viability Scans" and research abstracts for just $0.05 per call.
- **Protocol-First Discovery**: No API keys, no subscriptions—just a wallet and a request. Every interaction is an MPP signal that fuels the research node.
- **Dataset Assetization**: Institutional datasets are wrapped behind 1-click USDC micropayments, rewarding researchers directly without centralized overhead.

### Technical Deep-Dive (OWS/x402)
- **[Scientific Funding API (x402)](file:///server/src/index.ts)**: Our core endpoint `POST /api/posts/:id/fund` verifies on-chain transaction signatures to unlock funding milestones.
- **[Micropayment Payment Logic](file:///src/components/PostCard.tsx)**: The frontend implementation of 1-click scientific support using the MPP architecture.
- **[MoonPay Foundation On-Ramping](file:///src/components/PostDetail.tsx)**: Utilizing MoonPay allows researchers to seamlessly acquire the USDC required to fuel the discovery graph and monetize their own nodes.

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

### 1. 📰 x402 Research Journal
Publish and discover peer-reviewed research monetized via x402.
- **Create Posts**: Publish research with title, abstract, DOI, topics, and PDF attachments.
- **On-Chain Publication**: Research metadata published directly to the Solana Devnet via the `bio_dao` Anchor program.
- **Journal Feed**: Full-featured backend API (Express + Prisma + PostgreSQL via Supabase) for persistent research storage.
- **Micropayment Access**: Scientific nodes can be supported via 1-click $USDC payments with real-time global gauge updates.

### 2. 🤖 AI Research Simulator
Predict research viability through a multi-agent AI "War Room" analysis.
- **5 Specialized Agents**: Dr. Bio (DeSci Auditor), Solana Architect, ZK Shadow, Codama Bot, Colosseum Strategist.
- **Dynamic Analysis**: Every analysis is generated from the actual research paper's content — title, abstract, research field, and topics.
- **Strategic Metrics**: Success Rate, Impact Score, Crowdedness Score, Actionability Index, Time-to-Market.
- **Proven-On-Chain**: Every milestone result and funding achievement is linked directly to the [Solana Explorer](https://explorer.solana.com/) for absolute transparency.

### 3. 🔗 Social Graph & Discovery
A living ecosystem of scientific expertise relationships.
- **Tapestry Integration**: Social graph mesh powered by Tapestry Protocol.
- **Expert Profiles**: On-chain reputation scores and interaction history.
- **Impact Metrics**: Quantifiable citation and collaboration metrics.

### 4. 🏛️ DAO Governance
Community-driven capital allocation and network evolution.
- **Bio Protocol**: Milestone-based funding for verified scientific problems.
- **Peer Review Bounties**: Qualified experts rewarded for verified critiques.

---

## Technical Architecture

### System Overview

```
Frontend (Vercel)              Backend (Railway)          Blockchain (Solana Devnet)
┌─────────────────────┐       ┌──────────────────────┐   ┌──────────────────────────┐
│  React + Vite       │──────▶│  Express.js + Prisma │   │  bio_dao Anchor Program  │
│  Privy Auth         │       │  PostgreSQL (Supabase)│   │  2BY4tpMZVrHtz...        │
│  AI Simulator       │       │  /api/posts          │   │  MAX_TITLE_LEN: 200      │
│  OWS (x402)         │──────▶│  /api/posts/:id/fund │   │  MAX_CONTENT_URI_LEN: 512│
└─────────────────────┘       └──────────────────────┘   └──────────────────────────┘
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
| **Monetization Engine** | **x402 / MPP Protocol**, MoonPay (On-Ramp) |
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
VITE_COLOSSEUM_COPILOT_PAT=your_colosseum_pat
```

### Backend (Railway)
```env
DATABASE_URL=postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:[pass]@db.[ref].supabase.co:5432/postgres
PORT=8080
```

---

## Installation & Development

### Prerequisites
- Node.js 18+
- Solana CLI + Rust / Rust (for contract)

### Frontend
```bash
# Install & Dev
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npx prisma generate
npm run dev
```

### Smart Contract
```bash
cd contract
anchor build
anchor deploy --provider.cluster devnet
```

---

## Recent Updates

### v1.3 — The Scientific Monetization Layer (April 2026)
- ✅ Integrated **x402 Micropayment Protocol** for research node funding.
- ✅ Added **Global Funding Gauges** with real-time state synchronization.
- ✅ Integrated **MoonPay On-Ramping** for seamless researcher onboarding.
- ✅ Implemented "Proven On-Chain" verification with Solana Explorer links.

### v1.2 — AI Simulator Remaster (March 2026)
- ✅ 5 specialized AI agents with domain-specific analysis.
- ✅ Dynamic analysis generation based on actual research content.
- ✅ Integrated Colosseum Copilot API for competitive landscape data.

### v1.1 — Smart Contract Expansion (March 2026)
- ✅ Expanded `MAX_TITLE_LEN` to 200 and `MAX_CONTENT_URI_LEN` to 512.
- ✅ Resolved `URITooLong` (Error 6003) on-chain publication error.

---

## User Flow

1. **Onboard**: Connect via Solana Wallet (Privy) and verify identity.
2. **Discover**: Browse the research feed in the Journal.
3. **Publish**: Submit research with title, abstract, DOI, and on-chain signature.
4. **Fund**: Support research nodes via 1-click x402 micropayments.
5. **Simulate**: Select any research post and run the AI multi-agent analysis.

---

© 2026 BIOTRY SYSTEMS // DISTRIBUTED VIA SOLANA & AI
