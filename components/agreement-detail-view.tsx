"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { AgreementDetail } from "@/components/agreement-detail";
import { getAgreementById } from "@/lib/mockData";
import {
  getStoredAgreementsSnapshot,
  parseStoredAgreementsSnapshot,
  subscribeToStoredAgreements,
} from "@/lib/storage";

const emptyStoredAgreementsSnapshot = "[]";

type AgreementDetailViewProps = {
  id: string;
};

export function AgreementDetailView({ id }: AgreementDetailViewProps) {
  const storedSnapshot = useSyncExternalStore(
    subscribeToStoredAgreements,
    getStoredAgreementsSnapshot,
    () => emptyStoredAgreementsSnapshot,
  );
  const agreement = useMemo(() => {
    const storedAgreement = parseStoredAgreementsSnapshot(storedSnapshot).find(
      (currentAgreement) => currentAgreement.id === id,
    );

    return storedAgreement ?? getAgreementById(id);
  }, [id, storedSnapshot]);

  if (!agreement) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Agreement not found
        </h1>
        <p className="text-muted-foreground">
          This agreement does not exist in mock data or local storage on this
          browser.
        </p>
        <Link
          className="text-sm font-medium underline underline-offset-4"
          href="/agreements"
        >
          Back to agreements
        </Link>
      </main>
    );
  }

  return <AgreementDetail agreement={agreement} />;
}
