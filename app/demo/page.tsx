import { Agreement, AgreementStatus } from "@/types/agreement";

const demoAgreement: Agreement = {
  id: "demo-broken-delivery",
  client: "0xA11CE00000000000000000000000000000000001",
  builder: "0xB01D000000000000000000000000000000000002",
  amount: 3200,
  deadline: "2026-05-20",
  title: "SaaS onboarding dashboard MVP",
  terms:
    "Builder must deliver a production-ready onboarding dashboard with GitHub OAuth login, team invite flow, billing settings screen, responsive layout, and passing build by the deadline. Delivery must include a GitHub pull request and deployed preview.",
  status: AgreementStatus.RESOLVED,
  workUrl: "https://github.com/trustcourt-demo/onboarding-dashboard/pull/17",
  createdAt: "2026-05-01T10:00:00.000Z",
  claims: [
    {
      clientClaim:
        "The delivery is broken. GitHub OAuth is not implemented, team invites throw an error, billing settings are only a static placeholder, and the final build failed after the deadline.",
      builderClaim:
        "Most UI screens were delivered. The dashboard layout, sidebar, and placeholder billing page are present. OAuth and invites need more time but the visual MVP is mostly complete.",
      evidenceLinks: [
        "GitHub PR #17: build check failed on 2026-05-21",
        "Preview recording: invite flow returns 500 error",
        "Repository review: no GitHub OAuth callback route found",
        "Screenshot: billing settings page contains static lorem ipsum placeholders",
      ],
      createdAt: "2026-05-22T09:30:00.000Z",
    },
  ],
  verdict: {
    winner: "client",
    paymentSplit: {
      clientPercent: 80,
      builderPercent: 20,
    },
    confidence: 0.86,
    reasoning:
      "The evidence supports a material breach. The agreement required GitHub OAuth, team invites, billing settings, responsive layout, and a passing build by 2026-05-20. Evidence cites PR #17 failing build checks on 2026-05-21, no OAuth callback route, invite flow returning 500, and billing settings as placeholders. Some UI layout work appears delivered, so the conservative decision is not a full refund but an 80/20 client-favored split.",
    missingEvidence: [
      "Independent test log for responsive layout",
      "Exact commit timestamp for the final submitted PR",
    ],
    riskFlags: [
      "Core deliverables missing",
      "Build failed after deadline",
      "Partial UI delivery exists",
      "Mock verdict, not live AI arbitration",
    ],
  },
};

export default function DemoPage() {
  const claim = demoAgreement.claims?.[0];
  const verdict = demoAgreement.verdict;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Perfect demo</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Broken freelance delivery resolved by AI arbitration
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">
          This walkthrough shows the core TrustCourt promise: escrow agreement,
          failed delivery, structured dispute evidence, and a conservative AI
          verdict that protects funds when requirements are not met.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StageCard label="1" title="Agreement" text="Client and builder agree to dashboard MVP terms." />
        <StageCard label="2" title="Delivery breaks" text="Submitted work misses core requirements and fails build." />
        <StageCard label="3" title="Dispute" text="Both parties submit claims and evidence." />
        <StageCard label="4" title="Verdict" text="Mock AI decision returns an evidence-based split." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Agreement">
          <div className="grid gap-4">
            <InfoRow label="Title" value={demoAgreement.title} />
            <InfoRow label="Client" value={demoAgreement.client} />
            <InfoRow label="Builder" value={demoAgreement.builder} />
            <InfoRow label="Amount" value={`$${demoAgreement.amount.toLocaleString()}`} />
            <InfoRow label="Deadline" value={demoAgreement.deadline} />
            <InfoRow label="Status" value={demoAgreement.status} />
          </div>
          <div className="mt-6">
            <h3 className="font-semibold">Terms</h3>
            <p className="mt-2 leading-7 text-muted-foreground">{demoAgreement.terms}</p>
          </div>
        </Panel>

        <Panel title="Broken work submission">
          <p className="text-sm text-muted-foreground">Submitted GitHub URL</p>
          <a
            className="mt-2 block break-all text-sm font-medium underline underline-offset-4"
            href={demoAgreement.workUrl}
          >
            {demoAgreement.workUrl}
          </a>
          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
            <p className="font-medium text-destructive">Delivery problem</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Core promised features are missing or broken, and the submitted PR
              did not pass build checks by the deadline.
            </p>
          </div>
        </Panel>
      </section>

      {claim ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Client claim">
            <p className="leading-7 text-muted-foreground">{claim.clientClaim}</p>
          </Panel>
          <Panel title="Builder claim">
            <p className="leading-7 text-muted-foreground">{claim.builderClaim}</p>
          </Panel>
        </section>
      ) : null}

      {claim ? (
        <Panel title="Evidence submitted">
          <ul className="grid gap-3">
            {claim.evidenceLinks.map((evidence) => (
              <li
                className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground"
                key={evidence}
              >
                {evidence}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {verdict ? (
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI decision</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight capitalize">
                {verdict.winner} wins
              </h2>
              <p className="mt-2 text-muted-foreground">
                Confidence: {Math.round(verdict.confidence * 100)}%
              </p>
            </div>
            <div className="grid min-w-72 gap-3 sm:grid-cols-2">
              <SplitBox label="Client refund" value={verdict.paymentSplit.clientPercent} />
              <SplitBox label="Builder payout" value={verdict.paymentSplit.builderPercent} />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold">Reasoning</h3>
            <p className="mt-3 leading-7 text-muted-foreground">{verdict.reasoning}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <ListPanel title="Missing evidence" items={verdict.missingEvidence} />
            <ListPanel title="Risk flags" items={verdict.riskFlags} />
          </div>
        </section>
      ) : null}
    </main>
  );
}

type StageCardProps = {
  label: string;
  title: string;
  text: string;
};

function StageCard({ label, title, text }: StageCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
        {label}
      </span>
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

type PanelProps = {
  children: React.ReactNode;
  title: string;
};

function Panel({ children, title }: PanelProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid gap-1 rounded-2xl border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="break-all font-medium">{value}</p>
    </div>
  );
}

type SplitBoxProps = {
  label: string;
  value: number;
};

function SplitBox({ label, value }: SplitBoxProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}%</p>
    </div>
  );
}

type ListPanelProps = {
  items: string[];
  title: string;
};

function ListPanel({ items, title }: ListPanelProps) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
