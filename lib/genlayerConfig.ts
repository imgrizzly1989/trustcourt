import { chains } from "genlayer-js";
import { isAddress, type Address } from "viem";

export const GENLAYER_MODE_ENV = "NEXT_PUBLIC_TRUSTCOURT_GENLAYER_MODE";
export const GENLAYER_CHAIN_ENV = "NEXT_PUBLIC_TRUSTCOURT_GENLAYER_CHAIN";
export const GENLAYER_ENDPOINT_ENV = "NEXT_PUBLIC_TRUSTCOURT_GENLAYER_ENDPOINT";
export const GENLAYER_CONTRACT_ENV = "NEXT_PUBLIC_TRUSTCOURT_GENLAYER_CONTRACT_ADDRESS";

type GenLayerMode = "demo" | "real";
type GenLayerChainName = "localnet" | "studionet" | "testnetAsimov" | "testnetBradbury";

export type GenLayerRuntimeConfig = {
  mode: GenLayerMode;
  chainName: GenLayerChainName;
  chain: (typeof chains)[GenLayerChainName];
  endpoint?: string;
  contractAddress?: Address;
  isRealModeReady: boolean;
  missing: string[];
};

const defaultChainName: GenLayerChainName = "studionet";

export function getGenLayerRuntimeConfig(): GenLayerRuntimeConfig {
  const mode = normalizeMode(process.env.NEXT_PUBLIC_TRUSTCOURT_GENLAYER_MODE);
  const chainName = normalizeChainName(process.env.NEXT_PUBLIC_TRUSTCOURT_GENLAYER_CHAIN);
  const endpoint = normalizeOptional(process.env.NEXT_PUBLIC_TRUSTCOURT_GENLAYER_ENDPOINT);
  const contractAddress = normalizeAddress(
    process.env.NEXT_PUBLIC_TRUSTCOURT_GENLAYER_CONTRACT_ADDRESS,
  );
  const missing: string[] = [];

  if (mode === "real") {
    if (!endpoint) {
      missing.push(GENLAYER_ENDPOINT_ENV);
    }
    if (!contractAddress) {
      missing.push(GENLAYER_CONTRACT_ENV);
    }
  }

  return {
    mode,
    chainName,
    chain: chains[chainName],
    endpoint,
    contractAddress,
    isRealModeReady: mode === "real" && missing.length === 0,
    missing,
  };
}

function normalizeMode(value: string | undefined): GenLayerMode {
  return value === "real" ? "real" : "demo";
}

function normalizeChainName(value: string | undefined): GenLayerChainName {
  if (
    value === "localnet" ||
    value === "studionet" ||
    value === "testnetAsimov" ||
    value === "testnetBradbury"
  ) {
    return value;
  }

  return defaultChainName;
}

function normalizeAddress(value: string | undefined): Address | undefined {
  const normalizedValue = normalizeOptional(value);

  if (!normalizedValue || !isAddress(normalizedValue)) {
    return undefined;
  }

  return normalizedValue;
}

function normalizeOptional(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}
