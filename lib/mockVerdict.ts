import type { Agreement, AgreementVerdict } from "@/types/agreement";

type VerdictInput = {
  agreement: Agreement;
  clientClaim: string;
  builderClaim: string;
  evidenceLinks: string[];
};

export function generateMockVerdict({
  agreement,
  builderClaim,
  clientClaim,
  evidenceLinks,
}: VerdictInput): AgreementVerdict {
  const normalizedClientClaim = clientClaim.toLowerCase();
  const normalizedBuilderClaim = builderClaim.toLowerCase();
  const hasWorkUrl = agreement.workUrl.trim().length > 0;
  const hasEvidence = evidenceLinks.some((link) => link.trim().length > 0);
  const clientMentionsMissingWork = containsAny(normalizedClientClaim, [
    "missing",
    "incomplete",
    "not delivered",
    "broken",
    "does not work",
  ]);
  const builderMentionsCompletion = containsAny(normalizedBuilderClaim, [
    "complete",
    "delivered",
    "implemented",
    "finished",
    "working",
  ]);

  if (hasWorkUrl && hasEvidence && builderMentionsCompletion && !clientMentionsMissingWork) {
    return {
      winner: "builder",
      paymentSplit: {
        clientPercent: 0,
        builderPercent: 100,
      },
      confidence: 0.78,
      reasoning:
        "Mock verdict: builder provided a work URL and evidence links, and the builder claim states the work was completed. The client claim does not identify a specific missing or broken deliverable. This is a local mock decision, not a real AI ruling.",
      missingEvidence: ["Verified repository diff", "Independent acceptance test results"],
      riskFlags: ["Mock verdict only", "Evidence links are not verified"],
    };
  }

  if (!hasWorkUrl && clientMentionsMissingWork) {
    return {
      winner: "client",
      paymentSplit: {
        clientPercent: 100,
        builderPercent: 0,
      },
      confidence: 0.72,
      reasoning:
        "Mock verdict: no work URL is recorded and the client claim alleges missing or incomplete work. Without submitted work evidence, the conservative local mock decision favors the client.",
      missingEvidence: ["Submitted work URL", "Builder delivery evidence", "Verified completion proof"],
      riskFlags: ["Mock verdict only", "No submitted work URL", "Weak delivery evidence"],
    };
  }

  return {
    winner: "split",
    paymentSplit: {
      clientPercent: 50,
      builderPercent: 50,
    },
    confidence: 0.55,
    reasoning:
      "Mock verdict: evidence is incomplete or ambiguous. TrustCourt's conservative rule is to split when evidence is weak, conflicting, or not independently verified.",
    missingEvidence: [
      "Verified work contents",
      "Acceptance test results",
      "Timestamped delivery proof",
      "Specific evidence for each claim",
    ],
    riskFlags: ["Mock verdict only", "Unverified evidence", "Ambiguous dispute record"],
  };
}

function containsAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}
