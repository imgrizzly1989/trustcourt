"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { generateMockVerdict } from "@/lib/mockVerdict";
import { saveAgreement } from "@/lib/storage";
import { Agreement, AgreementStatus } from "@/types/agreement";

type DisputeFlowProps = {
  agreement: Agreement;
};

export function DisputeFlow({ agreement }: DisputeFlowProps) {
  const [currentAgreement, setCurrentAgreement] = useState(agreement);
  const [workUrl, setWorkUrl] = useState(agreement.workUrl);
  const [clientClaim, setClientClaim] = useState("");
  const [builderClaim, setBuilderClaim] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [workError, setWorkError] = useState("");
  const [disputeError, setDisputeError] = useState("");

  function persistAgreement(nextAgreement: Agreement) {
    setCurrentAgreement(nextAgreement);
    saveAgreement(nextAgreement);
  }

  function handleSubmitWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workUrl.trim()) {
      setWorkError("Work URL is required.");
      return;
    }

    const nextAgreement: Agreement = {
      ...currentAgreement,
      status: AgreementStatus.SUBMITTED,
      workUrl: workUrl.trim(),
    };

    setWorkError("");
    persistAgreement(nextAgreement);
  }

  function handleRaiseDispute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!clientClaim.trim() || !builderClaim.trim()) {
      setDisputeError("Client claim and builder claim are required.");
      return;
    }

    const evidenceLinks = evidenceText
      .split("\n")
      .map((link) => link.trim())
      .filter(Boolean);
    const claim = {
      clientClaim: clientClaim.trim(),
      builderClaim: builderClaim.trim(),
      evidenceLinks,
      createdAt: new Date().toISOString(),
    };
    const disputedAgreement: Agreement = {
      ...currentAgreement,
      claims: [...(currentAgreement.claims ?? []), claim],
      status: AgreementStatus.DISPUTED,
    };
    const verdict = generateMockVerdict({
      agreement: disputedAgreement,
      builderClaim: claim.builderClaim,
      clientClaim: claim.clientClaim,
      evidenceLinks,
    });
    const resolvedAgreement: Agreement = {
      ...disputedAgreement,
      status: AgreementStatus.RESOLVED,
      verdict,
    };

    setDisputeError("");
    persistAgreement(resolvedAgreement);
  }

  return (
    <section className="grid gap-6">
      <form
        className="rounded-3xl border border-border bg-card p-8"
        onSubmit={handleSubmitWork}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Builder action</p>
          <h2 className="text-xl font-semibold">Submit work</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Add a public URL for the delivered work. This updates local state only;
            no blockchain transaction is sent.
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <label className="text-sm font-medium" htmlFor="workUrl">
            Work URL
          </label>
          <input
            className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            id="workUrl"
            onChange={(event) => setWorkUrl(event.target.value)}
            placeholder="https://github.com/org/repo/pull/1"
            type="url"
            value={workUrl}
          />
          {workError ? <p className="text-sm text-destructive">{workError}</p> : null}
        </div>

        <Button className="mt-5" type="submit">
          Save Work Submission
        </Button>
      </form>

      <form
        className="rounded-3xl border border-border bg-card p-8"
        onSubmit={handleRaiseDispute}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Arbitration</p>
          <h2 className="text-xl font-semibold">Raise dispute</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Capture both claims and evidence links, then generate a local mock
            verdict. Real AI arbitration comes later.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ClaimField
            label="Client claim"
            onChange={setClientClaim}
            placeholder="Explain what is missing, late, or unacceptable."
            value={clientClaim}
          />
          <ClaimField
            label="Builder claim"
            onChange={setBuilderClaim}
            placeholder="Explain what was delivered and cite evidence."
            value={builderClaim}
          />
        </div>

        <div className="mt-5 grid gap-2">
          <label className="text-sm font-medium" htmlFor="evidenceLinks">
            Evidence links
          </label>
          <textarea
            className="min-h-28 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            id="evidenceLinks"
            onChange={(event) => setEvidenceText(event.target.value)}
            placeholder="One link per line: GitHub PR, preview, screenshots, logs"
            value={evidenceText}
          />
        </div>

        {disputeError ? (
          <p className="mt-4 text-sm text-destructive">{disputeError}</p>
        ) : null}

        <Button className="mt-5" type="submit" variant="outline">
          Generate Mock Verdict
        </Button>
      </form>

      {currentAgreement.verdict ? (
        <VerdictPanel agreement={currentAgreement} />
      ) : null}
    </section>
  );
}

type ClaimFieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function ClaimField({ label, onChange, placeholder, value }: ClaimFieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        className="min-h-32 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

type VerdictPanelProps = {
  agreement: Agreement;
};

function VerdictPanel({ agreement }: VerdictPanelProps) {
  const verdict = agreement.verdict;

  if (!verdict) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Mock verdict</p>
        <h2 className="text-2xl font-semibold capitalize">{verdict.winner} wins</h2>
        <p className="text-sm text-muted-foreground">
          Confidence: {Math.round(verdict.confidence * 100)}%
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SplitCard label="Client" value={verdict.paymentSplit.clientPercent} />
        <SplitCard label="Builder" value={verdict.paymentSplit.builderPercent} />
      </div>

      <div className="mt-6 grid gap-2">
        <h3 className="font-semibold">Reasoning</h3>
        <p className="leading-7 text-muted-foreground">{verdict.reasoning}</p>
      </div>

      <ListBlock title="Missing evidence" items={verdict.missingEvidence} />
      <ListBlock title="Risk flags" items={verdict.riskFlags} />
    </section>
  );
}

type SplitCardProps = {
  label: string;
  value: number;
};

function SplitCard({ label, value }: SplitCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-sm text-muted-foreground">{label} receives</p>
      <p className="mt-2 text-3xl font-semibold">{value}%</p>
    </div>
  );
}

type ListBlockProps = {
  items: string[];
  title: string;
};

function ListBlock({ items, title }: ListBlockProps) {
  return (
    <div className="mt-6 grid gap-2">
      <h3 className="font-semibold">{title}</h3>
      {items.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">None.</p>
      )}
    </div>
  );
}
