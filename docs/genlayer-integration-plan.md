# TrustCourt GenLayer Integration Plan

Step 1 scope: planning only. No production logic is implemented by this document.

## Current status

TrustCourt is currently a frontend MVP with a GenLayer-shaped boundary, not an operational GenLayer app.

Current mock boundaries:

- `contracts/trustcourt.py`
  - Python escrow/arbitration contract draft only.
  - It uses normal Python `dataclass`, `Enum`, `Dict`, `List`, and `int`.
  - It does not yet include the required GenVM dependency comment.
  - It does not import `from genlayer import *`.
  - It does not extend `gl.Contract`.
  - It does not use `@gl.public.view`, `@gl.public.write`, or `@gl.public.write.payable`.
  - It does not use GenLayer persistent storage types such as `TreeMap`, `DynArray`, `u256`, or `Address`.
  - Its AI arbitration hook intentionally raises `NotImplementedError`.

- `lib/genlayerClient.ts`
  - Placeholder wrapper only.
  - Every action returns a simulated transaction hash from `simulateGenLayerTransaction()`.
  - It does not import or call `genlayer-js`.
  - It does not read from a deployed Intelligent Contract.
  - It does not wait for `ACCEPTED` or `FINALIZED` GenLayer transaction status.

- `lib/storage.ts`
  - `localStorage` is still the app source of truth.
  - Operational GenLayer mode must move agreement state reads to contract views.

- `lib/mockVerdict.ts`
  - Deterministic local mock verdict engine.
  - It must remain demo-only once real GenLayer arbitration exists.

## GenLayer facts verified from current docs/tooling

Sources checked:

- `https://docs.genlayer.com/full-documentation.txt`
- `https://docs.genlayer.com/developers/networks`
- `https://docs.genlayer.com/developers/intelligent-contracts/first-contract`
- `https://docs.genlayer.com/developers/intelligent-contracts/features/storage`
- `https://docs.genlayer.com/developers/intelligent-contracts/features/value-transfers`
- `https://docs.genlayer.com/developers/intelligent-contracts/features/calling-llms`
- `https://docs.genlayer.com/developers/intelligent-contracts/deploying/cli-deployment`
- `https://docs.genlayer.com/developers/decentralized-applications/genlayer-js`
- `https://www.npmjs.com/package/genlayer-js` / `npm view genlayer-js@1.1.7`

Relevant confirmed details:

1. Intelligent Contracts are Python classes extending `gl.Contract`.
2. The first line must include the GenVM dependency comment, currently documented as:

   ```py
   # { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
   ```

3. Contracts import the GenLayer standard library with:

   ```py
   from genlayer import *
   ```

4. Public methods must use:

   ```py
   @gl.public.view
   @gl.public.write
   @gl.public.write.payable
   ```

5. Persistent storage requires declared class fields. Normal undeclared instance variables are not persistent.
6. Persistent collection types must use `DynArray[T]` and `TreeMap[K, V]`, not normal Python `list` and `dict`.
7. Persistent integer fields should use sized integer types such as `u32`, `i64`, `u256`, or `bigint`, not normal `int`.
8. Payable methods receive GEN through `gl.message.value` as `u256`.
9. GenLayer native token is GEN, denominated in wei: `1 GEN = 10^18 wei`.
10. LLM calls should use `gl.nondet.exec_prompt(..., response_format="json")` inside `gl.vm.run_nondet_unsafe(...)` with custom validation. Strict equality is not appropriate for non-deterministic LLM output.
11. JavaScript frontend SDK package is `genlayer-js`.
12. Current npm latest checked: `genlayer-js@1.1.7`.
13. `genlayer-js` exports `createClient`, `createAccount`, and chains from `genlayer-js/chains` including `localnet`, `studionet`, `testnetAsimov`, and `testnetBradbury`.
14. SDK client methods include:

   ```ts
   client.readContract({ address, functionName, args })
   client.writeContract({ address, functionName, args, value })
   client.waitForTransactionReceipt({ hash, status })
   client.deployContract({ code, args })
   client.connect("studionet" | "testnetAsimov" | "testnetBradbury" | "localnet")
   ```

15. Browser wallet flow in docs:

   ```ts
   const client = createClient({
     chain: studionet,
     account: walletAddress as `0x${string}`,
   });

   await client.connect("studionet");

   const txHash = await client.writeContract({
     address: contractAddress,
     functionName: "create_profile",
     args: ["alice", "Hello world"],
     value: BigInt(0),
   });
   ```

16. Important network options:

   - Bradbury: `https://rpc-bradbury.genlayer.com`, chain id `4221`, production-like real AI/LLM testnet.
   - Asimov: `https://rpc-asimov.genlayer.com`, chain id `4221`, infrastructure/stress testing.
   - Studionet: `https://studio.genlayer.com/api`, chain id `61999`, hosted development.
   - Localnet: `http://localhost:4000/api`, chain id `61127`, local development.

17. Recommended docs flow: start on Studionet, move to Localnet when full control is needed, deploy to Bradbury for production-like testing with real AI workloads.
18. CLI deployment shape:

   ```bash
   genlayer deploy --contract contracts/my_contract.py --rpc https://studio.genlayer.com/api
   genlayer deploy --contract contracts/my_contract.py --rpc https://rpc-bradbury.genlayer.com
   ```

## Operational target

TrustCourt is operational on GenLayer when all of this is true:

1. User connects MetaMask.
2. Wallet is on a supported GenLayer network, initially Studionet or Bradbury.
3. TrustCourt contract is deployed and a real contract address is configured.
4. Creating an agreement sends a real GenLayer transaction.
5. Funding an agreement sends GEN through a payable contract method.
6. Submitted work and disputes are written to contract state.
7. AI arbitration runs inside the Intelligent Contract through GenLayer non-deterministic execution.
8. UI reads agreement state from contract views, not from `localStorage`.
9. UI shows real transaction hashes and transaction states from GenLayer receipts.
10. Mock verdict and placeholder tx hashes are removed from operational flow or clearly isolated behind demo mode.

## Required implementation sequence

### Phase 1: Make the contract real GenLayer code

Files to change:

- `contracts/trustcourt.py`

Required changes:

1. Add GenVM dependency comment as the first line.
2. Import GenLayer standard library:

   ```py
   from genlayer import *
   ```

3. Make the contract extend `gl.Contract`:

   ```py
   class TrustCourt(gl.Contract):
   ```

4. Replace normal Python-only persistence:

   - `Dict[str, Agreement]` -> `TreeMap[str, Agreement]`
   - `List[Claim]` -> `DynArray[Claim]`
   - `int` amounts -> `u256`
   - string wallet fields should eventually become `Address` where GenLayer ABI compatibility allows it.

5. Mark storage dataclasses with `@allow_storage` where needed.
6. Declare every persistent field in the class body.
7. Convert public methods:

   ```py
   @gl.public.write
   def create_agreement(...)

   @gl.public.write.payable
   def fund_agreement(...)

   @gl.public.write
   def submit_work(...)

   @gl.public.write
   def approve_work(...)

   @gl.public.write
   def raise_dispute(...)

   @gl.public.write
   def resolve_dispute(...)

   @gl.public.view
   def get_agreement(...)

   @gl.public.view
   def get_agreement_ids(...)
   ```

8. Replace manual `sender` arguments with `gl.message.sender_address` where possible.
9. In `fund_agreement`, use `gl.message.value` and verify it equals the agreement amount.
10. Add view methods that are easy for the frontend to consume:

   - `get_agreement(agreement_id: str)`
   - `get_agreement_ids()`
   - `get_agreement_count()`
   - optionally `get_agreements_page(offset: u32, limit: u32)` if collections become large.

11. Implement `_arbitrate_with_ai()` using:

   - `gl.nondet.exec_prompt(prompt, response_format="json")`
   - `gl.vm.run_nondet_unsafe(leader_fn, validator_fn)`
   - schema validation instead of exact string equality.

12. Keep deterministic state transitions outside the LLM call. The LLM returns only a verdict object; contract code validates payouts and applies state.

Recommended arbitration result schema for contract compatibility:

```json
{
  "winner": "client|builder|split",
  "client_percent": 0,
  "builder_percent": 100,
  "confidence": 0.82,
  "reasoning": "short explanation",
  "missing_evidence": ["..."],
  "risk_flags": ["..."]
}
```

Contract validation requirements:

- `winner` is one of `client`, `builder`, `split`.
- `client_percent + builder_percent == 100`.
- percentages are between `0` and `100`.
- confidence is between `0` and `1`.
- reasoning is non-empty.
- derived wei payouts must sum to escrow amount.

### Phase 2: Add GenLayer app configuration

Files to add/change:

- `.env.example`
- `lib/genlayerConfig.ts`
- `lib/web3.ts`

Required environment variables:

```bash
NEXT_PUBLIC_GENLAYER_NETWORK=studionet
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
```

Later Bradbury values:

```bash
NEXT_PUBLIC_GENLAYER_NETWORK=testnetBradbury
NEXT_PUBLIC_GENLAYER_RPC_URL=https://rpc-bradbury.genlayer.com
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=0x...
```

Required `lib/genlayerConfig.ts` responsibilities:

- Map `NEXT_PUBLIC_GENLAYER_NETWORK` to `genlayer-js/chains`.
- Export the selected chain.
- Export the contract address.
- Validate that the contract address exists before operational writes.
- Keep all GenLayer constants out of components.

Required `lib/web3.ts` changes:

- Replace current Sepolia/mainnet-only assumption for operational mode.
- Add GenLayer Studionet/Bradbury chain support for wagmi/viem.
- Keep MetaMask-only injected connector.
- Do not add WalletConnect or Coinbase Wallet.

### Phase 3: Replace placeholder `lib/genlayerClient.ts`

Files to change:

- `lib/genlayerClient.ts`

Required dependency:

```bash
npm install genlayer-js
```

Required client shape:

```ts
import { createClient } from "genlayer-js";
import { TransactionStatus } from "genlayer-js/types";
import { studionet, testnetBradbury } from "genlayer-js/chains";
```

Note: verify exact import path for `TransactionStatus` during implementation. The installed package types expose it from `genlayer-js/types`; if that fails under the app's TypeScript config, use status string literals accepted by docs: `"ACCEPTED"` or `"FINALIZED"`.

Required actions:

- `createAgreement(input)` -> `client.writeContract({ functionName: "create_agreement", args: [...] })`
- `fundAgreement(input)` -> `client.writeContract({ functionName: "fund_agreement", args: [id], value: amountWei })`
- `submitWork(input)` -> `client.writeContract({ functionName: "submit_work", args: [id, workUrl], value: 0n })`
- `approveWork(input)` -> `client.writeContract({ functionName: "approve_work", args: [id], value: 0n })`
- `raiseDispute(input)` -> `client.writeContract({ functionName: "raise_dispute", args: [id, claim, evidenceLinks], value: 0n })`
- `resolveDispute(input)` -> `client.writeContract({ functionName: "resolve_dispute", args: [id], value: 0n })`
- Add `getAgreement(id)` -> `client.readContract({ functionName: "get_agreement", args: [id] })`
- Add `listAgreementIds()` -> `client.readContract({ functionName: "get_agreement_ids", args: [] })`
- Add `waitForAgreementTx(hash, targetStatus)` -> `client.waitForTransactionReceipt({ hash, status })`

Return type should evolve from current mock-only `GenLayerTxResult` to include:

```ts
type GenLayerTxResult = {
  state: "pending" | "accepted" | "finalized" | "failure";
  txHash?: `0x${string}`;
  contractAddress?: `0x${string}`;
  error?: string;
};
```

Do not let components construct raw GenLayer calls directly. Keep contract calls behind `lib/genlayerClient.ts`.

### Phase 4: Deployment workflow

Files to add:

- `docs/genlayer-deployment.md`
- optionally `scripts/deploy-genlayer.ts` if CLI deployment is not enough.

Manual CLI path:

```bash
# install GenLayer CLI using the method from current official docs
# then deploy to Studionet first
genlayer deploy --contract contracts/trustcourt.py --rpc https://studio.genlayer.com/api

# after Studionet proof, deploy to Bradbury
genlayer deploy --contract contracts/trustcourt.py --rpc https://rpc-bradbury.genlayer.com
```

Capture output:

- transaction hash
- contract address
- network name
- RPC URL
- explorer URL

Then set:

```bash
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=0x...
```

Recommended deployment order:

1. Studionet first for hosted development.
2. Bradbury only after contract and UI flow work on Studionet.
3. Keep localStorage demo mode until Bradbury transaction lifecycle is validated.

### Phase 5: Move UI state from localStorage to contract views

Files likely to change:

- `components/create-agreement-form.tsx`
- `components/agreements-view.tsx`
- `components/agreement-detail-view.tsx`
- `components/dispute-flow.tsx`
- `lib/storage.ts`
- `types/agreement.ts`

Required behavior:

- Creation form calls real `createAgreement()`.
- Detail page fetches `getAgreement(id)` from GenLayer.
- Agreement list fetches `getAgreementIds()` and reads each agreement or a paginated view.
- Dispute flow calls real `raiseDispute()` and `resolveDispute()`.
- UI displays transaction lifecycle: pending -> accepted -> finalized.
- `localStorage` either becomes demo mode only or caches contract reads without being source of truth.

### Phase 6: Testing and verification

Commands to run after each implementation phase:

```bash
npm run lint
npm run typecheck
npm run build
```

Contract checks:

```bash
python3 -m py_compile contracts/trustcourt.py
```

GenLayer checks after CLI is installed:

```bash
genlayer deploy --contract contracts/trustcourt.py --rpc https://studio.genlayer.com/api
# record output
genlayer call --help
# then use documented call/read commands to verify view methods
```

Browser checks:

1. MetaMask connects.
2. Wallet switches/adds GenLayer Studionet or Bradbury.
3. Create Agreement triggers MetaMask signature.
4. Transaction hash is real and visible in UI.
5. Agreement detail reads from contract after transaction acceptance/finalization.
6. Raise Dispute triggers real contract write.
7. Resolve Dispute waits for GenLayer consensus and returns real contract verdict.

## Recommended immediate next step

Step 2 should be contract-only:

- Rewrite `contracts/trustcourt.py` into valid GenLayer Intelligent Contract syntax.
- Keep the frontend unchanged.
- Validate with `python3 -m py_compile contracts/trustcourt.py`.
- If GenLayer CLI is available, also run schema validation/deploy dry run or deploy to Studionet.

Reason: the frontend cannot be honestly connected until the contract ABI/schema and deployed address exist.

## Non-goals for the next step

Do not do these in Step 2:

- Do not change landing page design.
- Do not add backend/database.
- Do not add WalletConnect/Coinbase Wallet.
- Do not remove demo mode yet.
- Do not claim live escrow or live arbitration until a real contract address and verified transactions exist.

## Product positioning during integration

Until Phase 5 is complete, describe TrustCourt as:

> A frontend MVP and GenLayer Intelligent Contract design for freelance escrow + AI arbitration. The current public demo uses localStorage, mock verdicts, and placeholder transaction hashes. Operational GenLayer integration is planned but not yet live.

After Phase 5 is complete on testnet, describe it as:

> A GenLayer testnet MVP where agreement state and AI arbitration are executed through a deployed Intelligent Contract. Testnet only; not legal escrow; not production custody.
