export type GenLayerTxState = "pending" | "success" | "failure";

export type GenLayerTxResult = {
  state: GenLayerTxState;
  txHash?: string;
  error?: string;
};

export type CreateAgreementInput = {
  id: string;
  client: string;
  builder: string;
  amount: number;
  terms: string;
};

export type FundAgreementInput = {
  id: string;
  amount: number;
};

export type SubmitWorkInput = {
  id: string;
  workUrl: string;
};

export type ApproveWorkInput = {
  id: string;
};

export type RaiseDisputeInput = {
  id: string;
  claim: string;
  evidenceLinks: string[];
};

export type ResolveDisputeInput = {
  id: string;
};

export async function createAgreement(
  input: CreateAgreementInput,
): Promise<GenLayerTxResult> {
  return simulateGenLayerTransaction("createAgreement", input.id);
}

export async function fundAgreement(
  input: FundAgreementInput,
): Promise<GenLayerTxResult> {
  return simulateGenLayerTransaction("fundAgreement", input.id);
}

export async function submitWork(
  input: SubmitWorkInput,
): Promise<GenLayerTxResult> {
  return simulateGenLayerTransaction("submitWork", input.id);
}

export async function approveWork(
  input: ApproveWorkInput): Promise<GenLayerTxResult> {
  return simulateGenLayerTransaction("approveWork", input.id);
}

export async function raiseDispute(
  input: RaiseDisputeInput,
): Promise<GenLayerTxResult> {
  return simulateGenLayerTransaction("raiseDispute", input.id);
}

export async function resolveDispute(
  input: ResolveDisputeInput,
): Promise<GenLayerTxResult> {
  return simulateGenLayerTransaction("resolveDispute", input.id);
}

async function simulateGenLayerTransaction(
  action: string,
  agreementId: string,
): Promise<GenLayerTxResult> {
  try {
    if (!agreementId.trim()) {
      return {
        state: "failure",
        error: "Agreement id is required.",
      };
    }

    await waitForMockNetwork();

    return {
      state: "success",
      txHash: createMockTxHash(action, agreementId),
    };
  } catch (error) {
    return {
      state: "failure",
      error: error instanceof Error ? error.message : "Unknown GenLayer error.",
    };
  }
}

function waitForMockNetwork(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 350);
  });
}

function createMockTxHash(action: string, agreementId: string): string {
  const seed = `${action}:${agreementId}:${Date.now()}`;
  const encodedSeed = Array.from(seed)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");

  return `0x${encodedSeed.padEnd(64, "0").slice(0, 64)}`;
}
