"use client";

import { useMemo, useSyncExternalStore } from "react";

import { AgreementList } from "@/components/agreement-list";
import { mockAgreements } from "@/lib/mockData";
import {
  getStoredAgreementsSnapshot,
  parseStoredAgreementsSnapshot,
  subscribeToStoredAgreements,
} from "@/lib/storage";

export function AgreementsView() {
  const storedSnapshot = useSyncExternalStore(
    subscribeToStoredAgreements,
    getStoredAgreementsSnapshot,
    () => "[]",
  );
  const agreements = useMemo(
    () => [...parseStoredAgreementsSnapshot(storedSnapshot), ...mockAgreements],
    [storedSnapshot],
  );

  return <AgreementList agreements={agreements} />;
}
