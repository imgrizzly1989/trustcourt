# TrustCourt Submission

## Problem

Freelance work often fails because payment and delivery live in separate systems.

Clients worry that funds will be released for incomplete work. Builders worry that clients will accept work, invent objections, and refuse to pay. Existing escrow products still rely on slow human review, vague evidence collection, or centralized operators.

The hard part is not only holding funds. The hard part is deciding what happens when delivery is disputed.

## Solution

TrustCourt is a frontend MVP and GenLayer Intelligent Contract design for freelance escrow with AI-assisted arbitration.

In the intended production flow, a client and builder create an agreement with clear terms, amount, deadline, and deliverables. The builder submits work. If the client approves, payment is released. If delivery is broken, either party can raise a dispute with structured claims and evidence.

In the current MVP, this flow is demonstrated with localStorage, mock verdicts, and placeholder transaction hashes. No real funds move and no live GenLayer contract is deployed yet.

The arbitration engine evaluates:

- agreement terms
- work submission
- GitHub URL
- client claim
- builder claim
- evidence links
- deadline

It returns strict JSON:

- winner
- payment split
- confidence
- reasoning
- missing evidence
- risk flags

The MVP currently uses local mock data and a mock verdict engine to demonstrate the full product flow without live funds.

## Why GenLayer

TrustCourt needs more than a normal deterministic smart contract.

Traditional contracts are good at enforcing simple rules, but freelance disputes require judgment over natural-language terms, GitHub evidence, screenshots, logs, delivery descriptions, and conflicting claims.

GenLayer is a fit because it enables Intelligent Contracts: contracts that can combine deterministic escrow logic with AI-assisted reasoning.

TrustCourt separates the two layers:

1. Deterministic contract logic
   - create agreement
   - fund agreement
   - submit work
   - approve work
   - raise dispute
   - validate final payout split

2. AI arbitration logic
   - compare delivery against terms
   - evaluate claims and evidence
   - produce conservative structured verdicts
   - explain missing evidence and risk flags

This keeps financial safety in deterministic code while using AI only where judgment is required.

## Architecture

Frontend:

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui
- wagmi + viem for MetaMask-only wallet connection

Core routes:

- `/`
  Landing page

- `/create`
  Agreement creation form with validation and localStorage persistence

- `/agreements`
  Agreement list combining mock and locally-created agreements

- `/agreements/[id]`
  Agreement detail, work submission, dispute form, and mock verdict display

- `/demo`
  Curated end-to-end demo showing broken delivery, dispute, evidence, and AI-style verdict

Key files:

- `types/agreement.ts`
  Domain types for agreements, claims, verdicts, and statuses

- `lib/storage.ts`
  Local persistence adapter for agreements

- `lib/web3.ts`
  MetaMask-only wagmi configuration and wallet helpers

- `lib/mockVerdict.ts`
  Local mock arbitration engine

- `lib/genlayerClient.ts`
  Placeholder GenLayer client wrapper returning mock transaction hashes

- `contracts/trustcourt.py`
  GenLayer-style Python Intelligent Contract draft

- `docs/arbitration-prompt.md`
  Evidence-first arbitration prompt design

Contract architecture:

- Agreement state machine:
  CREATED -> FUNDED -> SUBMITTED -> APPROVED
  or
  FUNDED/SUBMITTED -> DISPUTED -> RESOLVED

- Deterministic functions:
  - create_agreement
  - fund_agreement
  - submit_work
  - approve_work
  - raise_dispute
  - resolve_dispute

- AI boundary:
  - `_arbitrate_with_ai()` is intentionally isolated
  - it does not mutate state
  - its output is validated before funds would move

## Demo Flow

The `/demo` route presents a complete TrustCourt story.

Scenario: broken freelance delivery.

1. Agreement

A client hires a builder to deliver a SaaS onboarding dashboard MVP.

Required deliverables:

- GitHub OAuth login
- team invite flow
- billing settings screen
- responsive layout
- passing build
- delivery by deadline
- GitHub pull request
- deployed preview

2. Broken delivery

The builder submits a GitHub PR, but the work is incomplete.

Evidence shown:

- build check failed after deadline
- invite flow returns 500 error
- no GitHub OAuth callback route found
- billing page contains placeholder content

3. Claims

Client claim:
The delivery is broken, missing core features, and late.

Builder claim:
Some UI work exists, but OAuth and invites need more time.

4. AI-style verdict

The mock AI verdict favors the client but does not give a full refund because partial UI work exists.

Result:

- winner: client
- client refund: 80%
- builder payout: 20%
- confidence: 86%

Reasoning cites the supplied evidence and flags the main risks:

- core deliverables missing
- build failed after deadline
- partial UI delivery exists
- mock verdict, not live AI arbitration

## Current Limitations

- No real GenLayer SDK integration yet
- No real contract deployment yet
- No live escrow or token movement yet
- Mock verdict engine is deterministic demo logic, not real AI arbitration
- Evidence links are not fetched or verified yet
- Wallet connection exists but does not sign GenLayer transactions yet

## Next Integration Steps

1. Replace `lib/genlayerClient.ts` mock calls with real GenLayer SDK calls.
2. Deploy the `contracts/trustcourt.py` Intelligent Contract.
3. Wire frontend actions to contract methods.
4. Replace `lib/mockVerdict.ts` with contract-backed arbitration results.
5. Add evidence verification for GitHub, previews, timestamps, and build logs.
6. Add production-grade transaction state handling.
7. Add testnet demo deployment.

## Summary

TrustCourt demonstrates a practical use case for GenLayer: financial agreements that need both deterministic enforcement and evidence-based AI judgment.

The MVP is intentionally scoped: clean frontend, isolated wallet logic, local persistence, contract draft, arbitration prompt, mock GenLayer wrapper, and a polished demo flow.
