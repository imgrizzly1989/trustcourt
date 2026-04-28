"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  approveWork,
  fundAgreement,
  getGenLayerModeLabel,
  getGenLayerReadinessMessage,
  raiseDispute,
  resolveDispute,
  submitWork,
  type GenLayerTxResult,
} from "@/lib/genlayerClient";
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
  const [txError, setTxError] = useState("");
  const [txMessage, setTxMessage] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  function persistAgreement(nextAgreement: Agreement) {
    setCurrentAgreement(nextAgreement);
    saveAgreement(nextAgreement);
  }

  function withTx(
    nextAgreement: Agreement,
    action: string,
    txResult: GenLayerTxResult,
  ): Agreement {
    return {
      ...nextAgreement,
      genLayerMode: txResult.mode,
      genLayerTxs: [
        ...(currentAgreement.genLayerTxs ?? []),
        {
          action,
          createdAt: new Date().toISOString(),
          hash: txResult.txHash,
          mode: txResult.mode,
        },
      ],
    };
  }

  async function runTxAction(
    action: string,
    send: () => Promise<GenLayerTxResult>,
    apply: (txResult: GenLayerTxResult) => Agreement,
  ) {
    setBusyAction(action);
    setTxError("");
    setTxMessage("");

    try {
      const txResult = await send();

      if (txResult.state === "failure") {
        setTxError(txResult.error ?? "GenLayer transaction failed.");
        return;
      }

      persistAgreement(apply(txResult));
      setTxMessage(
        txResult.mode === "real"
          ? `${action} transaction sent to GenLayer.`
          : `${action} saved in demo mode with a mock transaction hash.`,
      );
    } finally {
      setBusyAction(null);
    }
  }

  async function handleFundAgreement() {
    await runTxAction(
      "fund_agreement",
      () => fundAgreement({ amount: currentAgreement.amount, id: currentAgreement.id }),
      (txResult) =>
        withTx(
          {
            ...currentAgreement,
            status: AgreementStatus.FUNDED,
          },
          "fund_agreement",
          txResult,
        ),
    );
  }

  async function handleApproveWork() {
    await runTxAction(
      "approve_work",
      () => approveWork({ id: currentAgreement.id }),
      (txResult) =>
        withTx(
          {
            ...currentAgreement,
            status: AgreementStatus.APPROVED,
            verdict: {
              confidence: 1,
              missingEvidence: [],
              paymentSplit: {
                builderPercent: 100,
                clientPercent: 0,
              },
              reasoning: "Client approved submitted work.",
              riskFlags: [],
              winner: "builder",
            },
          },
          "approve_work",
          txResult,
        ),
    );
  }

  async function handleSubmitWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workUrl.trim()) {
      setWorkError("Work URL is required.");
      return;
    }

    setWorkError("");
    await runTxAction(
      "submit_work",
      () => submitWork({ id: currentAgreement.id, workUrl: workUrl.trim() }),
      (txResult) =>
        withTx(
          {
            ...currentAgreement,
            status: AgreementStatus.SUBMITTED,
            workUrl: workUrl.trim(),
          },
          "submit_work",
          txResult,
        ),
    );
  }

  async function handleRaiseDispute(event: FormEvent<HTMLFormElement>) {
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
    setTxError("");
    setTxMessage("");
    setBusyAction("resolve_dispute");

    try {
      const raisedTx = await raiseDispute({
        builderClaim: claim.builderClaim,
        clientClaim: claim.clientClaim,
        evidence: evidenceLinks.join("\n"),
        id: currentAgreement.id,
      });

      if (raisedTx.state === "failure") {
        setTxError(raisedTx.error ?? "Unable to raise dispute.");
        return;
      }

      const resolvedTx = await resolveDispute({ id: currentAgreement.id });

      if (resolvedTx.state === "failure") {
        setTxError(resolvedTx.error ?? "Unable to resolve dispute.");
        persistAgreement(withTx(disputedAgreement, "raise_dispute", raisedTx));
        return;
      }

      const resolvedWithTxs: Agreement = {
        ...resolvedAgreement,
        genLayerMode: resolvedTx.mode,
        genLayerTxs: [
          ...(currentAgreement.genLayerTxs ?? []),
          {
            action: "raise_dispute",
            createdAt: new Date().toISOString(),
            hash: raisedTx.txHash,
            mode: raisedTx.mode,
          },
          {
            action: "resolve_dispute",
            createdAt: new Date().toISOString(),
            hash: resolvedTx.txHash,
            mode: resolvedTx.mode,
          },
        ],
      };

      persistAgreement(resolvedWithTxs);
      setTxMessage(
        resolvedTx.mode === "real"
          ? "Dispute and arbitration transactions sent to GenLayer."
          : "Dispute resolved in demo mode with mock transaction hashes.",
      );
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="grid gap-6">
      <section className="rounded-3xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">GenLayer mode: {getGenLayerModeLabel()}</p>
        <p className="mt-1">{getGenLayerReadinessMessage()}</p>
        {txMessage ? <p className="mt-3 text-foreground">{txMessage}</p> : null}
        {txError ? <p className="mt-3 text-destructive">{txError}</p> : null}
      </section>

      {currentAgreement.status === AgreementStatus.CREATED ? (
        <section className="rounded-3xl border border-border bg-card p-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Client action</p>
            <h2 className="text-xl font-semibold">Fund agreement</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              In real mode this sends a payable GenLayer transaction. In demo mode
              it advances local state and records a mock hash.
            </p>
          </div>
          <Button
            className="mt-5"
            disabled={busyAction !== null}
            onClick={handleFundAgreement}
            type="button"
          >
            {busyAction === "fund_agreement" ? "Funding..." : "Fund Agreement"}
          </Button>
        </section>
      ) : null}

      <form
        className="rounded-3xl border border-border bg-card p-8"
        onSubmit={handleSubmitWork}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Builder action</p>
          <h2 className="text-xl font-semibold">Submit work</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Add a public URL for the delivered work. In real mode this sends a
            GenLayer transaction; in demo mode it updates local state and records
            a mock hash.
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

        <Button className="mt-5" disabled={busyAction !== null} type="submit">
          {busyAction === "submit_work" ? "Submitting..." : "Save Work Submission"}
        </Button>
      </form>

      {currentAgreement.status === AgreementStatus.SUBMITTED ? (
        <section className="rounded-3xl border border-border bg-card p-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Client action</p>
            <h2 className="text-xl font-semibold">Approve work</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Approve the delivery and release the escrow according to the contract
              flow. Demo mode records this as a mock transaction.
            </p>
          </div>
          <Button
            className="mt-5"
            disabled={busyAction !== null}
            onClick={handleApproveWork}
            type="button"
          >
            {busyAction === "approve_work" ? "Approving..." : "Approve Work"}
          </Button>
        </section>
      ) : null}

      <form
        className="rounded-3xl border border-border bg-card p-8"
        onSubmit={handleRaiseDispute}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Arbitration</p>
          <h2 className="text-xl font-semibold">Raise dispute</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Capture both claims and evidence links. Demo mode generates a local
            mock verdict; real mode sends dispute and resolve calls through the
            GenLayer client boundary when configured.
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

        <Button
          className="mt-5"
          disabled={busyAction !== null}
          type="submit"
          variant="outline"
        >
          {busyAction === "resolve_dispute" ? "Resolving..." : "Generate Verdict"}
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
