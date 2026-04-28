# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json


@gl.evm.contract_interface
class _Recipient:
    class View:
        pass

    class Write:
        pass


class TrustCourt(gl.Contract):
    """Freelance escrow + AI arbitration Intelligent Contract for GenLayer.

    Deterministic code owns escrow state and payout math. GenLayer's
    non-deterministic LLM boundary is used only after a dispute exists.
    """

    agreements: TreeMap[str, bool]
    clients: TreeMap[str, Address]
    builders: TreeMap[str, Address]
    amounts: TreeMap[str, u256]
    statuses: TreeMap[str, str]
    titles: TreeMap[str, str]
    terms: TreeMap[str, str]
    work_urls: TreeMap[str, str]
    client_claims: TreeMap[str, str]
    builder_claims: TreeMap[str, str]
    evidence_links: TreeMap[str, str]
    verdict_winners: TreeMap[str, str]
    verdict_client_percent: TreeMap[str, u32]
    verdict_builder_percent: TreeMap[str, u32]
    verdict_confidence_bps: TreeMap[str, u32]
    verdict_reasoning: TreeMap[str, str]
    verdict_missing_evidence: TreeMap[str, str]
    verdict_risk_flags: TreeMap[str, str]
    payout_clients: TreeMap[str, u256]
    payout_builders: TreeMap[str, u256]

    def __init__(self):
        self.agreements = TreeMap[str, bool]()
        self.clients = TreeMap[str, Address]()
        self.builders = TreeMap[str, Address]()
        self.amounts = TreeMap[str, u256]()
        self.statuses = TreeMap[str, str]()
        self.titles = TreeMap[str, str]()
        self.terms = TreeMap[str, str]()
        self.work_urls = TreeMap[str, str]()
        self.client_claims = TreeMap[str, str]()
        self.builder_claims = TreeMap[str, str]()
        self.evidence_links = TreeMap[str, str]()
        self.verdict_winners = TreeMap[str, str]()
        self.verdict_client_percent = TreeMap[str, u32]()
        self.verdict_builder_percent = TreeMap[str, u32]()
        self.verdict_confidence_bps = TreeMap[str, u32]()
        self.verdict_reasoning = TreeMap[str, str]()
        self.verdict_missing_evidence = TreeMap[str, str]()
        self.verdict_risk_flags = TreeMap[str, str]()
        self.payout_clients = TreeMap[str, u256]()
        self.payout_builders = TreeMap[str, u256]()

    @gl.public.write
    def create_agreement(
        self,
        agreement_id: str,
        builder: Address,
        amount: u256,
        title: str,
        terms: str,
    ) -> None:
        creator = gl.message.sender_address
        self._require(not self.agreements.get(agreement_id, False), "Agreement already exists")
        self._require(agreement_id.strip() != "", "Agreement id is required")
        self._require(builder != creator, "Client and builder must differ")
        self._require(amount > u256(0), "Amount must be greater than zero")
        self._require(title.strip() != "", "Title is required")
        self._require(terms.strip() != "", "Terms are required")

        self.agreements[agreement_id] = True
        self.clients[agreement_id] = creator
        self.builders[agreement_id] = builder
        self.amounts[agreement_id] = amount
        self.statuses[agreement_id] = "CREATED"
        self.titles[agreement_id] = title.strip()
        self.terms[agreement_id] = terms.strip()
        self.work_urls[agreement_id] = ""
        self.client_claims[agreement_id] = ""
        self.builder_claims[agreement_id] = ""
        self.evidence_links[agreement_id] = ""
        self.verdict_winners[agreement_id] = ""
        self.verdict_client_percent[agreement_id] = u32(0)
        self.verdict_builder_percent[agreement_id] = u32(0)
        self.verdict_confidence_bps[agreement_id] = u32(0)
        self.verdict_reasoning[agreement_id] = ""
        self.verdict_missing_evidence[agreement_id] = ""
        self.verdict_risk_flags[agreement_id] = ""
        self.payout_clients[agreement_id] = u256(0)
        self.payout_builders[agreement_id] = u256(0)

    @gl.public.write.payable
    def fund_agreement(self, agreement_id: str) -> None:
        self._require_exists(agreement_id)
        self._require(gl.message.sender_address == self.clients[agreement_id], "Only client can fund")
        self._require(self.statuses[agreement_id] == "CREATED", "Agreement is not fundable")
        self._require(gl.message.value == self.amounts[agreement_id], "Funding value must match amount")

        self.statuses[agreement_id] = "FUNDED"

    @gl.public.write
    def submit_work(self, agreement_id: str, work_url: str) -> None:
        self._require_exists(agreement_id)
        self._require(gl.message.sender_address == self.builders[agreement_id], "Only builder can submit work")
        self._require(self.statuses[agreement_id] == "FUNDED", "Agreement is not ready for submission")
        self._require(work_url.strip() != "", "Work URL is required")

        self.work_urls[agreement_id] = work_url.strip()
        self.statuses[agreement_id] = "SUBMITTED"

    @gl.public.write
    def approve_work(self, agreement_id: str) -> None:
        self._require_exists(agreement_id)
        self._require(gl.message.sender_address == self.clients[agreement_id], "Only client can approve work")
        self._require(self.statuses[agreement_id] == "SUBMITTED", "Agreement is not approvable")

        amount = self.amounts[agreement_id]
        self.statuses[agreement_id] = "APPROVED"
        self.verdict_winners[agreement_id] = "builder"
        self.verdict_client_percent[agreement_id] = u32(0)
        self.verdict_builder_percent[agreement_id] = u32(100)
        self.verdict_confidence_bps[agreement_id] = u32(10000)
        self.verdict_reasoning[agreement_id] = "Client approved submitted work."
        self.payout_clients[agreement_id] = u256(0)
        self.payout_builders[agreement_id] = amount
        self._release_to(self.builders[agreement_id], amount)

    @gl.public.write
    def raise_dispute(
        self,
        agreement_id: str,
        client_claim: str,
        builder_claim: str,
        evidence: str,
    ) -> None:
        self._require_exists(agreement_id)
        caller = gl.message.sender_address
        self._require(
            caller == self.clients[agreement_id] or caller == self.builders[agreement_id],
            "Only parties can dispute",
        )
        self._require(
            self.statuses[agreement_id] == "FUNDED" or self.statuses[agreement_id] == "SUBMITTED",
            "Agreement is not disputable",
        )
        self._require(client_claim.strip() != "", "Client claim is required")
        self._require(builder_claim.strip() != "", "Builder claim is required")

        self.client_claims[agreement_id] = client_claim.strip()
        self.builder_claims[agreement_id] = builder_claim.strip()
        self.evidence_links[agreement_id] = evidence.strip()
        self.statuses[agreement_id] = "DISPUTED"

    @gl.public.write
    def resolve_dispute(self, agreement_id: str) -> None:
        self._require_exists(agreement_id)
        self._require(self.statuses[agreement_id] == "DISPUTED", "Agreement is not disputed")

        verdict = self._arbitrate_with_ai(agreement_id)
        winner = str(verdict.get("winner", "")).lower()
        client_percent = u32(verdict.get("client_percent", 0))
        builder_percent = u32(verdict.get("builder_percent", 0))
        confidence_bps = u32(verdict.get("confidence_bps", 0))
        reasoning = str(verdict.get("reasoning", "")).strip()
        missing_evidence = str(verdict.get("missing_evidence", "")).strip()
        risk_flags = str(verdict.get("risk_flags", "")).strip()

        self._validate_verdict(winner, client_percent, builder_percent, confidence_bps, reasoning)

        amount = self.amounts[agreement_id]
        builder_payout = (amount * u256(builder_percent)) // u256(100)
        client_payout = amount - builder_payout

        self.verdict_winners[agreement_id] = winner
        self.verdict_client_percent[agreement_id] = client_percent
        self.verdict_builder_percent[agreement_id] = builder_percent
        self.verdict_confidence_bps[agreement_id] = confidence_bps
        self.verdict_reasoning[agreement_id] = reasoning
        self.verdict_missing_evidence[agreement_id] = missing_evidence
        self.verdict_risk_flags[agreement_id] = risk_flags
        self.payout_clients[agreement_id] = client_payout
        self.payout_builders[agreement_id] = builder_payout
        self.statuses[agreement_id] = "RESOLVED"

        if client_payout > u256(0):
            self._release_to(self.clients[agreement_id], client_payout)
        if builder_payout > u256(0):
            self._release_to(self.builders[agreement_id], builder_payout)

    @gl.public.view
    def get_agreement(self, agreement_id: str) -> dict:
        self._require_exists(agreement_id)
        return {
            "id": agreement_id,
            "client": str(self.clients[agreement_id]),
            "builder": str(self.builders[agreement_id]),
            "amount": str(self.amounts[agreement_id]),
            "status": self.statuses[agreement_id],
            "title": self.titles[agreement_id],
            "terms": self.terms[agreement_id],
            "work_url": self.work_urls[agreement_id],
            "client_claim": self.client_claims[agreement_id],
            "builder_claim": self.builder_claims[agreement_id],
            "evidence_links": self.evidence_links[agreement_id],
            "verdict": self.get_verdict(agreement_id),
        }

    @gl.public.view
    def get_verdict(self, agreement_id: str) -> dict:
        self._require_exists(agreement_id)
        return {
            "winner": self.verdict_winners[agreement_id],
            "client_percent": self.verdict_client_percent[agreement_id],
            "builder_percent": self.verdict_builder_percent[agreement_id],
            "confidence_bps": self.verdict_confidence_bps[agreement_id],
            "reasoning": self.verdict_reasoning[agreement_id],
            "missing_evidence": self.verdict_missing_evidence[agreement_id],
            "risk_flags": self.verdict_risk_flags[agreement_id],
            "client_payout": str(self.payout_clients[agreement_id]),
            "builder_payout": str(self.payout_builders[agreement_id]),
        }

    def _arbitrate_with_ai(self, agreement_id: str) -> dict:
        dispute_packet = {
            "title": self.titles[agreement_id],
            "terms": self.terms[agreement_id],
            "work_url": self.work_urls[agreement_id],
            "client_claim": self.client_claims[agreement_id],
            "builder_claim": self.builder_claims[agreement_id],
            "evidence_links": self.evidence_links[agreement_id],
            "allowed_winners": ["client", "builder", "split"],
        }
        prompt = f"""
You are TrustCourt, an AI arbitrator for a freelance escrow agreement.
Use only the provided dispute packet. Do not assume URL contents unless the packet states them.
Return JSON only with this exact shape:
{{
  "winner": "client|builder|split",
  "client_percent": 0,
  "builder_percent": 100,
  "confidence_bps": 8000,
  "reasoning": "short evidence-based explanation",
  "missing_evidence": "comma-separated missing evidence, or empty string",
  "risk_flags": "comma-separated risks, or empty string"
}}
Rules:
- client_percent + builder_percent must equal 100.
- confidence_bps must be an integer from 0 to 10000.
- If evidence is ambiguous or unverified, prefer split with lower confidence.
- Never invent facts outside this packet.
Dispute packet:
{json.dumps(dispute_packet)}
"""

        def leader_fn():
            return gl.nondet.exec_prompt(prompt, response_format="json")

        def validator_fn(leaders_res) -> bool:
            if not isinstance(leaders_res, gl.vm.Return):
                return False
            candidate = leaders_res.calldata
            if not self._is_structurally_valid_ai_verdict(candidate):
                return False
            local_candidate = leader_fn()
            return self._is_structurally_valid_ai_verdict(local_candidate)

        return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

    def _is_structurally_valid_ai_verdict(self, verdict: dict) -> bool:
        winner = str(verdict.get("winner", "")).lower()
        if winner not in ["client", "builder", "split"]:
            return False
        client_percent = u32(verdict.get("client_percent", 0))
        builder_percent = u32(verdict.get("builder_percent", 0))
        confidence_bps = u32(verdict.get("confidence_bps", 0))
        reasoning = str(verdict.get("reasoning", "")).strip()
        return (
            client_percent + builder_percent == u32(100)
            and confidence_bps <= u32(10000)
            and reasoning != ""
        )

    def _validate_verdict(
        self,
        winner: str,
        client_percent: u32,
        builder_percent: u32,
        confidence_bps: u32,
        reasoning: str,
    ) -> None:
        self._require(winner in ["client", "builder", "split"], "Invalid winner")
        self._require(client_percent + builder_percent == u32(100), "Verdict split must equal 100")
        self._require(confidence_bps <= u32(10000), "Confidence is out of bounds")
        self._require(reasoning != "", "Reasoning is required")

    def _release_to(self, recipient: Address, amount: u256) -> None:
        _Recipient(recipient).emit_transfer(value=amount)

    def _require_exists(self, agreement_id: str) -> None:
        self._require(self.agreements.get(agreement_id, False), "Agreement not found")

    def _require(self, condition: bool, message: str) -> None:
        if not condition:
            raise gl.vm.UserError(message)
