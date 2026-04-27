import Link from "next/link";

import type { Agreement } from "@/types/agreement";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type AgreementListProps = {
  agreements: Agreement[];
};

export function AgreementList({ agreements }: AgreementListProps) {
  return (
    <div className="grid gap-4">
      {agreements.map((agreement) => (
        <Link
          className="rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/40"
          href={`/agreements/${agreement.id}`}
          key={agreement.id}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{agreement.id}</p>
              <h2 className="mt-2 text-xl font-semibold">{agreement.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {agreement.client} → {agreement.builder}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <span className="rounded-full border border-border px-3 py-1 text-sm font-medium">
                {agreement.status}
              </span>
              <span className="text-sm font-medium">
                {currencyFormatter.format(agreement.amount)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
