# BIOTRY: The Universal Protocol for Open Science (OWS Finalist)

> **Decentralized Science (DeSci) protocol on Solana** — bridging fragmented scientific research and capital markets through x402/MPP micropayments, AI-driven trial simulations, and on-chain expertise metrics.

🔗 **Live Demo**: [https://biotry.vercel.app](https://biotry.vercel.app)  
🔗 **OWS Hackathon Track**: [Pay-Per-Call Services & API Monetization](https://hackathon.openwallet.sh/)  
🔗 **Contract (Devnet)**: [`2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y`](https://explorer.solana.com/address/2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y?cluster=devnet)  

---

## 🏆 OWS Hackathon: Pay-Per-Call Science

Biotry targets the **Pay-Per-Call Services & API Monetization** track by wrapping scientific abstracts, dataset insights, and AI simulations behind **x402/MPP micropayments**. 

### The Vision
No API keys, no subscriptions—just a wallet and an HTTP request. In Biotry, every "Scientific Contribution" or "Simulation Call" is a micropayment event that flows directly to the researcher or the platform DAO.

- **Dataset Monetization**: Institutions can wrap proprietary datasets behind x402. Pay $0.05 per data-call instead of $35,000 for a subscription.
- **Pay-Per-Abstract**: Access the high-value "Editor's Insight" and "AI Viability Scan" for any research paper with a single click.
- **On-Chain Proof**: Every call is verifiable via Solana Explorer.

### Key OWS Integrations
- **[Scientific Funding API (x402)](file:///server/src/index.ts)**: Our core endpoint `POST /api/posts/:id/fund` verifies on-chain transaction signatures before updating the global research graph.
- **[On-Chain Payment Logic](file:///src/components/PostCard.tsx)**: Frontend implementation of the MPP (Micro-Payment Protocol) for 1-click scientific support.
- **[MoonPay On-Ramping](file:///src/components/PostDetail.tsx)**: Integrating MoonPay enables researchers and institutions to easily acquire the USDC needed to participate in the scientific monetization track.

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
- **Micropayment Access**: Scientific nodes can be supported via 1-click $USDC payments.
- **Global Gauges**: Real-time funding progress bars synchronized across the platform via 
`AppContext`.
- **On-Chain Publication**: Research metadata published directly to the Solana Devnet via the `bio_dao` Anchor program.

### 2. 🤖 AI Research Simulator
Predict research viability through a multi-agent AI "War Room" analysis.
- **Specialized Agents**: Dr. Bio (DeSci Auditor), Solana Architect, ZK Shadow, etc.
- **Strategic Metrics**: Success Rate, Impact Score, Crowdedness Score, Time-to-Market.
- **Proven-On-Chain**: Simulation results and funding milestones are linked directly to [Solana Explorer](https://explorer.solana.com/).

### 3. 🔗 Social Graph (Discovery)
- **Tapestry Integration**: Social graph mesh powered by Tapestry Protocol.
- **Expert Profiles**: On-chain reputation scores and interaction history.

---

## Technical Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| **Micropayments** | **OWS (x402/MPP)**, MoonPay (On-Ramp) |
| **Frontend** | React 18, Vite, GSAP Animations, Tailwind CSS, Solana web3.js |
| **Blockchain** | Solana (Devnet), Anchor Framework |
| **Authentication** | Privy (embedded wallet + social login) |
| **Backend** | Express.js, Prisma ORM, PostgreSQL (Supabase) |

### System Overview

```
Frontend (Vercel)              Backend (Railway)          Blockchain (Solana Devnet)
┌─────────────────────┐       ┌──────────────────────┐   ┌──────────────────────────┐
│  React + Vite       │──────▶│  Express.js + Prisma │   │  bio_dao Anchor Program  │
│  Privy Auth         │       │  PostgreSQL (Supabase)│   │  2BY4tpMZVrHtz...        │
│  OWS (x402)         │──────▶│  /api/posts/:id/fund │   └──────────────────────────┘
└─────────────────────┘       └──────────────────────┘
```

---

## Installation & Development

### Prerequisites
- Node.js 18+
- Solana CLI + Rust / Rust (for contract)

### Quick Start
```bash
# Install & Dev
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```

---

© 2026 BIOTRY SYSTEMS // DISTRIBUTED VIA SOLANA & AI
