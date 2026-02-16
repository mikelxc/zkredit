# zkredit

Bounded spending authority infrastructure for autonomous agents.

**Thesis:** agents need payment autonomy without full-custody risk.  
zkredit provides constrained spending primitives where humans fund, agents execute within policy limits, and unspent funds remain recoverable.

---

## Current Multi-Chain Status

zkredit currently builds on top of the Claw primitive and is actively consolidating that work into a unified zkredit product surface.

### 1) Base Sepolia (Live)

**Contract (Claw V2):** `0xD812EA3A821A5b4d835bfA06BAf542138e434D48`  
**Network:** Base Sepolia (84532)  
**USDC:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

#### Implemented features
- Non-custodial spending control
- Batch minting of spending authorities
- A2A tipping flows with on-chain memos
- Spend memo support for payment context
- NFT-based authority model aligned with ERC-7978 semantics

#### Live app
- https://hexxhub.github.io/claw/

### 2) Solana (In Progress)

Solana implementation is under active development using an Anchor-based architecture:
- NFT-based authority representation
- PDA-based state tracking for max/spent/expiry/funder
- SPL token delegate pattern for bounded spend execution
- Burn/recovery semantics for unused funds

Current repo state:
- `claw-solana/` in this workspace
- status: early implementation / hackathon buildout

---

## OpenClaw Integration

The spending primitive is already exposed as an **OpenClaw skill** (`claw`) so autonomous agents can execute bounded payment actions directly inside agent workflows.

This allows us to pressure-test policy-constrained payments in production-style agent loops before final zkredit API/UX consolidation.

---

## Standards Context

zkredit’s authority model is aligned with **ERC-7978** (Non-Fungible Account Tokens) design semantics:
- transferable ownership/control abstraction
- explicit authority boundaries
- verifiable on-chain execution constraints

---

## Why this exists

Most agent payment setups force a bad tradeoff:
1. Human signs every action (no real autonomy), or
2. Agent gets full wallet custody (high blast radius)

zkredit targets the middle path: **safe autonomy through bounded authority**.

---

## Repository Notes

This repo currently contains:
- zkredit app scaffold and contracts
- integration references to Base Sepolia and Solana Claw work

As the next step, we’ll unify naming/surfaces so Base + Solana implementations are represented under a single zkredit protocol/app narrative.

---

## Links

- zkredit site: https://www.zkredit.xyz/
- Claw app (Base Sepolia): https://hexxhub.github.io/claw/
- Claw (EVM): https://github.com/Hexxhub/claw
- lxc profile/resume: https://lxc.xyz/
