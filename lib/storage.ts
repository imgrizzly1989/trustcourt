import { Agreement, AgreementStatus } from "@/types/agreement";

export const AGREEMENTS_STORAGE_KEY = "trustcourt.agreements";
export const AGREEMENTS_STORAGE_EVENT = "trustcourt.agreements.changed";

export type AgreementDraft = {
  client: string;
  builder: string;
  amount: string;
  deadline: string;
  title: string;
  terms: string;
};

export type AgreementValidationErrors = Partial<
  Record<keyof AgreementDraft, string>
>;

export function isWalletAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function validateAgreementDraft(
  draft: AgreementDraft,
): AgreementValidationErrors {
  const errors: AgreementValidationErrors = {};
  const amount = Number(draft.amount);

  if (!draft.client.trim()) {
    errors.client = "Client wallet is required.";
  } else if (!isWalletAddress(draft.client)) {
    errors.client = "Enter a valid Ethereum wallet address.";
  }

  if (!draft.builder.trim()) {
    errors.builder = "Builder wallet is required.";
  } else if (!isWalletAddress(draft.builder)) {
    errors.builder = "Enter a valid Ethereum wallet address.";
  }

  if (!draft.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than 0.";
  }

  if (!draft.deadline.trim()) {
    errors.deadline = "Deadline is required.";
  }

  if (!draft.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!draft.terms.trim()) {
    errors.terms = "Terms are required.";
  }

  return errors;
}

export function hasValidationErrors(errors: AgreementValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getStoredAgreements(): Agreement[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawAgreements = window.localStorage.getItem(AGREEMENTS_STORAGE_KEY);

  if (!rawAgreements) {
    return [];
  }

  try {
    const parsedAgreements: unknown = JSON.parse(rawAgreements);

    if (!Array.isArray(parsedAgreements)) {
      return [];
    }

    return parsedAgreements.filter(isAgreement);
  } catch {
    return [];
  }
}

export function getStoredAgreementById(id: string): Agreement | undefined {
  return getStoredAgreements().find((agreement) => agreement.id === id);
}

export function getStoredAgreementsSnapshot(): string {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(AGREEMENTS_STORAGE_KEY) ?? "[]";
}

export function subscribeToStoredAgreements(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === AGREEMENTS_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AGREEMENTS_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AGREEMENTS_STORAGE_EVENT, onStoreChange);
  };
}

export function parseStoredAgreementsSnapshot(snapshot: string): Agreement[] {
  try {
    const parsedAgreements: unknown = JSON.parse(snapshot);

    if (!Array.isArray(parsedAgreements)) {
      return [];
    }

    return parsedAgreements.filter(isAgreement);
  } catch {
    return [];
  }
}

export function createAgreementFromDraft(draft: AgreementDraft): Agreement {
  return {
    id: createAgreementId(),
    client: draft.client.trim(),
    builder: draft.builder.trim(),
    amount: Number(draft.amount),
    deadline: draft.deadline,
    title: draft.title.trim(),
    terms: draft.terms.trim(),
    status: AgreementStatus.CREATED,
    workUrl: "",
    createdAt: new Date().toISOString(),
  };
}

export function saveAgreement(agreement: Agreement): void {
  if (typeof window === "undefined") {
    return;
  }

  const agreements = getStoredAgreements();
  const nextAgreements = [
    agreement,
    ...agreements.filter((currentAgreement) => currentAgreement.id !== agreement.id),
  ];

  window.localStorage.setItem(
    AGREEMENTS_STORAGE_KEY,
    JSON.stringify(nextAgreements),
  );
  window.dispatchEvent(new Event(AGREEMENTS_STORAGE_EVENT));
}

function createAgreementId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `agr-${crypto.randomUUID()}`;
  }

  return `agr-${Date.now().toString(36)}`;
}

function isAgreement(value: unknown): value is Agreement {
  if (!value || typeof value !== "object") {
    return false;
  }

  const agreement = value as Partial<Agreement>;

  return (
    typeof agreement.id === "string" &&
    typeof agreement.client === "string" &&
    typeof agreement.builder === "string" &&
    typeof agreement.amount === "number" &&
    typeof agreement.deadline === "string" &&
    typeof agreement.title === "string" &&
    typeof agreement.terms === "string" &&
    typeof agreement.status === "string" &&
    typeof agreement.workUrl === "string" &&
    typeof agreement.createdAt === "string"
  );
}
