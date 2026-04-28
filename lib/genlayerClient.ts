import { createClient } from "genlayer-js";
import { parseUnits, type Address } from "viem";

import { getGenLayerRuntimeConfig } from "@/lib/genlayerConfig";

export type GenLayerTxState = "pending" | "success" | "failure";
export type GenLayerMode = "demo" | "real";

export type GenLayerTxResult = {
  state: GenLayerTxState;
  mode: GenLayerMode;
  txHash?: string;
  error?: string;
  missingConfig?: string[];
};

export type CreateAgreementInput = {
  id: string;
  client: string;
  builder: string;
  amount: number;
  title: string;
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
  clientClaim: string;
  builderClaim: string;
  evidence: string;
};

export type ResolveDisputeInput = {
  id: string;
};

export function getGenLayerModeLabel(): string {
  const config = getGenLayerRuntimeConfig();

  if (config.isRealModeReady) {
    return `real:${config.chainName}`;
  }

  return "demo:local mock";
}

export function getGenLayerReadinessMessage(): string {
  const config = getGenLayerRuntimeConfig();

  if (config.isRealModeReady) {
    return `Real GenLayer mode is configured for ${config.chainName}. Transactions will be sent to ${config.contractAddress}.`;
  }

  if (config.mode === "real") {
    return `Real GenLayer mode requested, but missing ${config.missing.join(", ")}. Falling back to demo transactions.`;
  }

  return "Demo mode is active. Actions use local state and mock transaction hashes; no real funds move.";
}

export async function createAgreement(
  input: CreateAgreementInput,
): Promise<GenLayerTxResult> {
  return sendGenLayerWrite({
    args: [
      input.id,
      input.builder as Address,
      toWei(input.amount),
      input.title,
      input.terms,
    ],
    fallbackAction: "createAgreement",
    fallbackAgreementId: input.id,
    functionName: "create_agreement",
    value: BigInt(0),
  });
}

export async function fundAgreement(
  input: FundAgreementInput,
): Promise<GenLayerTxResult> {
  return sendGenLayerWrite({
    args: [input.id],
    fallbackAction: "fundAgreement",
    fallbackAgreementId: input.id,
    functionName: "fund_agreement",
    value: toWei(input.amount),
  });
}

export async function submitWork(
  input: SubmitWorkInput,
): Promise<GenLayerTxResult> {
  return sendGenLayerWrite({
    args: [input.id, input.workUrl],
    fallbackAction: "submitWork",
    fallbackAgreementId: input.id,
    functionName: "submit_work",
    value: BigInt(0),
  });
}

export async function approveWork(
  input: ApproveWorkInput,
): Promise<GenLayerTxResult> {
  return sendGenLayerWrite({
    args: [input.id],
    fallbackAction: "approveWork",
    fallbackAgreementId: input.id,
    functionName: "approve_work",
    value: BigInt(0),
  });
}

export async function raiseDispute(
  input: RaiseDisputeInput,
): Promise<GenLayerTxResult> {
  return sendGenLayerWrite({
    args: [input.id, input.clientClaim, input.builderClaim, input.evidence],
    fallbackAction: "raiseDispute",
    fallbackAgreementId: input.id,
    functionName: "raise_dispute",
    value: BigInt(0),
  });
}

export async function resolveDispute(
  input: ResolveDisputeInput,
): Promise<GenLayerTxResult> {
  return sendGenLayerWrite({
    args: [input.id],
    fallbackAction: "resolveDispute",
    fallbackAgreementId: input.id,
    functionName: "resolve_dispute",
    value: BigInt(0),
  });
}

type LocalCalldataEncodable =
  | null
  | boolean
  | number
  | bigint
  | string
  | Uint8Array
  | LocalCalldataEncodable[]
  | { [key: string]: LocalCalldataEncodable };

type SendGenLayerWriteInput = {
  args: LocalCalldataEncodable[];
  fallbackAction: string;
  fallbackAgreementId: string;
  functionName: string;
  value: bigint;
};

async function sendGenLayerWrite({
  args,
  fallbackAction,
  fallbackAgreementId,
  functionName,
  value,
}: SendGenLayerWriteInput): Promise<GenLayerTxResult> {
  const config = getGenLayerRuntimeConfig();

  if (!config.isRealModeReady || !config.contractAddress) {
    return simulateGenLayerTransaction(
      fallbackAction,
      fallbackAgreementId,
      config.mode === "real" ? config.missing : undefined,
    );
  }

  try {
    const provider = getBrowserEthereumProvider();
    const selectedAccount = await getSelectedAccount(provider);

    const client = createClient({
      account: selectedAccount,
      chain: config.chain,
      endpoint: config.endpoint,
      provider,
    });

    const receipt = await client.writeContract({
      address: config.contractAddress,
      args,
      functionName,
      value,
    });

    return {
      state: "success",
      mode: "real",
      txHash: extractTransactionHash(receipt),
    };
  } catch (error) {
    return {
      state: "failure",
      mode: "real",
      error: error instanceof Error ? error.message : "Unknown GenLayer error.",
    };
  }
}

async function simulateGenLayerTransaction(
  action: string,
  agreementId: string,
  missingConfig?: string[],
): Promise<GenLayerTxResult> {
  try {
    if (!agreementId.trim()) {
      return {
        state: "failure",
        mode: "demo",
        error: "Agreement id is required.",
      };
    }

    await waitForMockNetwork();

    return {
      state: "success",
      mode: "demo",
      txHash: createMockTxHash(action, agreementId),
      missingConfig,
    };
  } catch (error) {
    return {
      state: "failure",
      mode: "demo",
      error: error instanceof Error ? error.message : "Unknown GenLayer error.",
    };
  }
}

function getBrowserEthereumProvider(): EthereumProvider {
  if (typeof window === "undefined" || !("ethereum" in window)) {
    throw new Error("MetaMask provider is required for real GenLayer mode.");
  }

  return window.ethereum as EthereumProvider;
}

async function getSelectedAccount(provider: EthereumProvider): Promise<Address> {
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const [account] = accounts;

  if (!account) {
    throw new Error("Connect MetaMask before sending a GenLayer transaction.");
  }

  return account as Address;
}

function extractTransactionHash(receipt: unknown): string | undefined {
  if (typeof receipt === "string") {
    return receipt;
  }

  if (!receipt || typeof receipt !== "object") {
    return undefined;
  }

  const possibleReceipt = receipt as {
    hash?: unknown;
    transactionHash?: unknown;
    txHash?: unknown;
  };

  for (const value of [
    possibleReceipt.hash,
    possibleReceipt.transactionHash,
    possibleReceipt.txHash,
  ]) {
    if (typeof value === "string") {
      return value;
    }
  }

  return undefined;
}

function toWei(amount: number): bigint {
  return parseUnits(amount.toString(), 18);
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

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
};
