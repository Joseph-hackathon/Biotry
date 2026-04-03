# BIOTRY: The High-Performance Discovery Network 🔬

> **The Liquid Research Protocol on Solana** — bridging scientific discovery and capital through **Umbra Anonymous Research Grants**, x402 Micropayments, and multi-agent AI simulations.

🔗 **Live Demo**: [https://biotry.vercel.app](https://biotry.vercel.app)  
🔗 **Biotry Protocol Explorer**: [`2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y`](https://explorer.solana.com/address/2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y?cluster=devnet)  
🔗 **Backend API**: [https://biotry-production.up.railway.app](https://biotry-production.up.railway.app)


---

## ⚡ The Umbra Upgrade: Private Scientific Funding

Biotry now features the **Umbra Anonymous Research Grant** layer to eliminate bias in scientific funding. Utilizing **Stealth Addresses**, the Umbra upgrade allows donors to support high-risk research without exposing their identity or strategic interests.


### Technical Implementation & Code Links
Review our core logic for Biotry and the Umbra upgrade:
- **[Umbra Stealth Logic (src/components/PostDetail.tsx)](src/components/PostDetail.tsx)**: Simulated stealth address generation for anonymous grants.
- **[Biotry x402 Backend Handler](server/src/index.ts)**: Express.js endpoint verifying MPP-based transaction signatures.
- **[Grant Modal (src/components/TransactionModal.tsx)](src/components/TransactionModal.tsx)**: 1-click anonymous funding flow powered by Umbra.
- **[AI Research Simulator (src/pages/SimulatePage.tsx)](src/pages/SimulatePage.tsx)**: Multi-agent methodology auditing.

- **[Discovery Mesh (src/components/ProfileView.tsx)](src/components/ProfileView.tsx)**: Expertise-weighted reputation graph.


---

## The Problem

1. **Funding Bias**: Research funding is often gated by institutional reputation, leaving innovative but "unproven" scientists behind.
2. **Privacy Risks**: Large donors often avoid sensitive fields due to public visibility and strategic exposure.
3. **Transaction Friction**: High entry barriers for small-scale anonymous scientific support.

## Our Solution

Umbra acts as a **privacy-first funding layer** where grants are sent to stealth addresses, severing the public link between donor and recipient. Combining Solana's speed with Umbra's anonymity, we enable a truly decentralized and unbiased scientific meritocracy.


---

## Core Features

### 1. 🕵️ Umbra Anonymous Grants
Fund research anonymously using stealth addresses.
- **Stealth Funding**: Generate unique one-time addresses for every grant to protect donor privacy.
- **Anonymous Support**: Researchers receive funds without public link to the donor's main wallet.

### 2. 🤖 AI Research Simulator
Predict research viability through a multi-agent AI "War Room" analysis.
- **5 Specialized Agents**: Dr. Bio (DeSci Auditor), Solana Architect, ZK Shadow, Codama Bot, Colosseum Strategist.
- **Dynamic Analysis**: Predictive metrics including Success Rate, Impact Score, and Actionability.

### 3. 🔗 Discovery Mesh (Social Graph)
A living ecosystem of scientific expertise relationships powered by Tapestry.
- **Expert Profiles**: On-chain reputation scores and interaction history.


---

## Technical Architecture

### System Overview

```
Frontend (Vercel)              Backend (Railway)          Blockchain (Solana Devnet)
┌─────────────────────┐       ┌──────────────────────┐   ┌──────────────────────────┐
│  React + Vite       │──────▶│  Express.js + Prisma │   │  Umbra Anchor Program    │
│  Stealth UI         │       │  PostgreSQL          │   │  /api/grants             │
│  AI Simulator       │       │  /api/posts/:id/fund │   │  /api/editors            │
└─────────────────────┘       └──────────────────────┘   └──────────────────────────┘
```


## Tech Stack

| Layer | Technology |
|---|---|
| **Privacy** | **Umbra Stealth Logic** |
| **Monetization** | **x402 / MPP Protocol** |
| **Blockchain** | **Solana Devnet** |
| **Identity** | **Privy** |
| **Social Graph** | **Tapestry** |

---

© 2026 UMBRA SYSTEMS // PRIVACY-FIRST SCIENCE ON SOLANA

