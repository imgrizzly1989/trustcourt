import type { Agreement } from "@/types/agreement";

import { DisputeFlow } from "@/components/dispute-flow";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type AgreementDetailProps = {
  agreement: Agreement;
};

export function AgreementDetail({ agreement }: AgreementDetailProps) {
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Agreement {agreement.id}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {agreement.title}
            </h1>
          </div>
          <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-sm font-medium">
            {agreement.status}
          </span>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard label="Client" value={agreement.client} />
        <InfoCard label="Builder" value={agreement.builder} />
        <InfoCard
          label="Escrow amount"
          value={currencyFormatter.format(agreement.amount)}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <InfoCard label="Deadline" value={agreement.deadline} />
        <InfoCard label="Created" value={agreement.createdAt.slice(0, 10)} />
      </section>

      <section className="rounded-3xl border border-dashed border-border bg-muted/30 p-8">
        <h2 className="text-xl font-semibold">GenLayer execution boundary</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Mode: {agreement.genLayerMode ?? "demo"}. Demo mode keeps localStorage as
          the source of truth and uses mock transaction hashes. Real mode only runs
          when public GenLayer env config is present.
        </p>
        {agreement.genLayerContractAddress ? (
          <p className="mt-3 break-all text-sm text-muted-foreground">
            Contract: {agreement.genLayerContractAddress}
          </p>
        ) : null}
        {agreement.genLayerTxs?.length ? (
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            {agreement.genLayerTxs.map((tx) => (
              <li className="break-all" key={`${tx.action}-${tx.createdAt}`}>
                {tx.action} ({tx.mode}): {tx.hash ?? "hash pending"}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-3xl border border-border bg-card p-8">
        <h2 className="text-xl font-semibold">Terms</h2>
        <p className="mt-4 leading-7 text-muted-foreground">{agreement.terms}</p>
      </section>

      <section className="rounded-3xl border border-dashed border-border bg-muted/30 p-8">
        <h2 className="text-xl font-semibold">Submitted work</h2>
        {agreement.workUrl ? (
          <a
            className="mt-4 block break-all text-sm font-medium text-foreground underline underline-offset-4"
            href={agreement.workUrl}
          >
            {agreement.workUrl}
          </a>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No work has been submitted yet.
          </p>
        )}
      </section>

      <DisputeFlow agreement={agreement} />
    </article>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 break-all font-medium">{value}</p>
    </div>
  );
}
