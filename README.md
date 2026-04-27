# TrustCourt

TrustCourt is a production-quality MVP for freelance escrow and AI-assisted arbitration on GenLayer.

This repository is currently a frontend MVP plus integration-ready contract design. It does **not** move real funds, does **not** call a live GenLayer deployment, and does **not** run live AI arbitration yet.

## What is implemented

- Next.js App Router frontend
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- MetaMask-only wallet connection UI using wagmi + viem
- Local agreement creation with validation
- localStorage persistence for created agreements
- Agreement list and detail pages
- Work submission form
- Dispute form with client claim, builder claim, and evidence links
- Local mock verdict engine
- Polished `/demo` flow for a broken freelance delivery dispute
- GenLayer-style Python Intelligent Contract draft
- Evidence-first arbitration prompt design
- Placeholder GenLayer client wrapper returning mock transaction hashes

## What is mocked / not live

- No real escrow or token movement
- No deployed GenLayer contract yet
- No real GenLayer SDK calls yet
- No live AI arbitration call yet
- Evidence links are displayed as submitted evidence, not fetched or independently verified
- Wallet connection does not yet sign GenLayer transactions

## Routes

- `/` — landing page
- `/create` — create an agreement locally
- `/agreements` — list mock and locally-created agreements
- `/agreements/[id]` — agreement detail, work submission, dispute flow, mock verdict
- `/demo` — curated end-to-end demo: broken delivery, dispute, evidence, AI-style verdict

## Key files

- `app/` — Next.js App Router pages
- `components/` — reusable UI and flow components
- `types/agreement.ts` — agreement, claim, verdict, and status types
- `lib/storage.ts` — localStorage persistence
- `lib/web3.ts` — MetaMask-only wallet configuration
- `lib/mockVerdict.ts` — local mock arbitration logic
- `lib/genlayerClient.ts` — placeholder GenLayer integration wrapper
- `contracts/trustcourt.py` — GenLayer-style Intelligent Contract draft
- `docs/arbitration-prompt.md` — arbitration prompt and scenarios
- `docs/submission.md` — hackathon submission narrative

## Getting started

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Demo flow

Open:

```text
http://localhost:3000/demo
```

The demo shows:

1. A freelance agreement for a SaaS onboarding dashboard.
2. Broken delivery: missing OAuth, broken invites, placeholder billing page, failed build.
3. Client and builder claims.
4. Evidence items.
5. Mock AI-style verdict: client wins an 80/20 split because core deliverables are missing but partial UI work exists.

## Future real deployment plan

1. Replace `lib/genlayerClient.ts` mocks with real GenLayer SDK calls.
2. Deploy `contracts/trustcourt.py` after adapting it to exact GenLayer runtime syntax.
3. Use connected wallet signer for contract transactions.
4. Move agreement state from localStorage to contract reads.
5. Add real escrow funding and payout execution.
6. Replace `lib/mockVerdict.ts` with contract-backed arbitration results.
7. Add evidence verification for GitHub PRs, CI status, timestamps, and preview artifacts.

## Submission positioning

Accurate claim:

> TrustCourt is a frontend MVP and GenLayer Intelligent Contract design for freelance escrow with AI-assisted arbitration. The demo uses mock verdicts and placeholder transaction hashes to show the intended flow.

Do not claim:

- deployed on GenLayer
- real escrow funds are held
- live AI arbitration is running
- evidence is independently verified
- wallet transactions are signed on GenLayer
