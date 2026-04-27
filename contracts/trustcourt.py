"""
TrustCourt Intelligent Contract draft.

GenLayer-style Python pseudocode for a freelance escrow agreement with
minimal deterministic state transitions and an isolated AI arbitration hook.

Step 5 scope:
- design only
- no frontend integration
- no Hermes integration
- no external contract calls
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional


class AgreementStatus(str, Enum):
    CREATED = "CREATED"
    FUNDED = "FUNDED"
    SUBMITTED = "SUBMITTED"
    APPROVED = "APPROVED"
    DISPUTED = "DISPUTED"
    RESOLVED = "RESOLVED"


@dataclass
class Claim:
    party: str
    statement: str
    evidence_url: str = ""


@dataclass
class Verdict:
    winner: str
    summary: str
    payout_client: int
    payout_builder: int


@dataclass
class Agreement:
    id: str
    client: str
    builder: str
    amount: int
    status: AgreementStatus
    terms: str
    work_url: str = ""
    claims: List[Claim] = field(default_factory=list)
    verdict: Optional[Verdict] = None


class TrustCourt:
    def __init__(self):
        self.agreements: Dict[str, Agreement] = {}

    # ---------------------------------------------------------------------
    # Deterministic logic
    # ---------------------------------------------------------------------

    def create_agreement(
        self,
        agreement_id: str,
        client: str,
        builder: str,
        amount: int,
        terms: str,
    ) -> Agreement:
        self._require(agreement_id not in self.agreements, "Agreement already exists")
        self._require(client != "", "Client is required")
        self._require(builder != "", "Builder is required")
        self._require(client != builder, "Client and builder must differ")
        self._require(amount > 0, "Amount must be greater than zero")
        self._require(terms.strip() != "", "Terms are required")

        agreement = Agreement(
            id=agreement_id,
            client=client,
            builder=builder,
            amount=amount,
            status=AgreementStatus.CREATED,
            terms=terms.strip(),
        )
        self.agreements[agreement_id] = agreement
        return agreement

    def fund_agreement(self, agreement_id: str, sender: str, value: int) -> Agreement:
        agreement = self._get_agreement(agreement_id)

        self._require(sender == agreement.client, "Only client can fund")
        self._require(agreement.status == AgreementStatus.CREATED, "Agreement is not fundable")
        self._require(value == agreement.amount, "Funding amount must match agreement amount")

        agreement.status = AgreementStatus.FUNDED
        return agreement

    def submit_work(self, agreement_id: str, sender: str, work_url: str) -> Agreement:
        agreement = self._get_agreement(agreement_id)

        self._require(sender == agreement.builder, "Only builder can submit work")
        self._require(agreement.status == AgreementStatus.FUNDED, "Agreement is not ready for submission")
        self._require(work_url.strip() != "", "Work URL is required")

        agreement.work_url = work_url.strip()
        agreement.status = AgreementStatus.SUBMITTED
        return agreement

    def approve_work(self, agreement_id: str, sender: str) -> Agreement:
        agreement = self._get_agreement(agreement_id)

        self._require(sender == agreement.client, "Only client can approve work")
        self._require(agreement.status == AgreementStatus.SUBMITTED, "Agreement is not approvable")

        # Placeholder for future deterministic payout to builder.
        agreement.verdict = Verdict(
            winner=agreement.builder,
            summary="Client approved submitted work.",
            payout_client=0,
            payout_builder=agreement.amount,
        )
        agreement.status = AgreementStatus.APPROVED
        return agreement

    def raise_dispute(
        self,
        agreement_id: str,
        sender: str,
        claim: str,
        evidence_url: str = "",
    ) -> Agreement:
        agreement = self._get_agreement(agreement_id)

        self._require(sender in [agreement.client, agreement.builder], "Only parties can dispute")
        self._require(
            agreement.status in [AgreementStatus.FUNDED, AgreementStatus.SUBMITTED],
            "Agreement is not disputable",
        )
        self._require(claim.strip() != "", "Claim is required")

        agreement.claims.append(
            Claim(
                party=sender,
                statement=claim.strip(),
                evidence_url=evidence_url.strip(),
            )
        )
        agreement.status = AgreementStatus.DISPUTED
        return agreement

    def resolve_dispute(self, agreement_id: str, sender: str) -> Agreement:
        agreement = self._get_agreement(agreement_id)

        self._require(agreement.status == AgreementStatus.DISPUTED, "Agreement is not disputed")
        self._require(len(agreement.claims) > 0, "No claims to resolve")

        verdict = self._arbitrate_with_ai(agreement)
        self._validate_verdict(agreement, verdict)

        # Placeholder for future deterministic payout execution.
        agreement.verdict = verdict
        agreement.status = AgreementStatus.RESOLVED
        return agreement

    # ---------------------------------------------------------------------
    # AI logic boundary
    # ---------------------------------------------------------------------

    def _arbitrate_with_ai(self, agreement: Agreement) -> Verdict:
        """
        AI arbitration boundary.

        Future implementation should call GenLayer validators/Hermes-style AI
        consensus with only the dispute packet:
        - terms
        - work_url
        - claims
        - evidence URLs

        This method must return a structured Verdict. It must not mutate state.
        """
        raise NotImplementedError("AI arbitration is intentionally not implemented in Step 5")

    # ---------------------------------------------------------------------
    # Internal deterministic guards
    # ---------------------------------------------------------------------

    def _get_agreement(self, agreement_id: str) -> Agreement:
        self._require(agreement_id in self.agreements, "Agreement not found")
        return self.agreements[agreement_id]

    def _validate_verdict(self, agreement: Agreement, verdict: Verdict) -> None:
        self._require(verdict.winner in [agreement.client, agreement.builder], "Invalid winner")
        self._require(verdict.payout_client >= 0, "Invalid client payout")
        self._require(verdict.payout_builder >= 0, "Invalid builder payout")
        self._require(
            verdict.payout_client + verdict.payout_builder == agreement.amount,
            "Verdict payouts must equal escrow amount",
        )
        self._require(verdict.summary.strip() != "", "Verdict summary is required")

    def _require(self, condition: bool, message: str) -> None:
        if not condition:
            raise ValueError(message)
