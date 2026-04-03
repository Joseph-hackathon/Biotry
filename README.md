# BIOTRY: The Universal Protocol for Open Science 🔬

> **Decentralized Science (DeSci) protocol on Solana** — bridging fragmented scientific research and capital markets through x402 Micropayment Protocol, AI-driven trial simulations, and on-chain expertise metrics.

🔗 **Live Demo**: [https://biotry.vercel.app](https://biotry.vercel.app)  
🔗 **Protocol Explorer**: [`2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y`](https://explorer.solana.com/address/2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y?cluster=devnet)  

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

## 🏗️ Core Pillars

### 📰 x402 Research Journal
A living repository of human knowledge monetized natively.
- **Micropayment Bounties**: Scientific nodes supported via 1-click $USDC payments.
- **Verified Publication**: Research metadata published directly to the Solana Devnet via the `bio_dao` Anchor program.

### 🤖 AI Research Simulator
Predict research viability through a multi-agent AI "War Room" analysis.
- **Domain-Specific Agents**: Specialized LLM nodes (Dr. Bio, Solana Architect, etc.) derive analysis from the actual research methodology.
- **Proven-On-Chain**: Every milestone result and funding achievement is linked directly to the [Solana Explorer](https://explorer.solana.com/) for absolute transparency.

### 🔗 Discovery Mesh (Social Graph)
- **Tapestry Protocol Integration**: Mapping the real-time relationship between scientists, citations, and funding.

---

## 🛠️ System Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| **Monetization Engine** | **x402 / MPP Protocol**, MoonPay (On-Ramp) |
| **Frontend** | React 18, Vite, GSAP Animations, Tailwind CSS, Solana web3.js |
| **Blockchain** | Solana (Devnet), Anchor Framework |
| **Authentication** | Privy (embedded wallet + social login) |

---

## 🚀 Installation & Build

```bash
# General
npm install
npm run dev

# Backend Node
cd server
npm install
npm run dev
```

---

© 2026 BIOTRY SYSTEMS // DISTRIBUTED VIA SOLANA & AI
