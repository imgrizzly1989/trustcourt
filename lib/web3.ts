"use client";

import { QueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  createConfig,
  createStorage,
  http,
  injected,
  noopStorage,
  useConnect,
  useConnection,
  useDisconnect,
  useReconnect,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import { defineChain, type EIP1193Provider } from "viem";

type MetaMaskProvider = EIP1193Provider & {
  isMetaMask?: true;
  providers?: MetaMaskProvider[];
};

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

const GENLAYER_TESTNET_CHAIN_ID = 4221;
const GENLAYER_TESTNET_CHAIN_ID_HEX = "0x107D";

export const genLayerTestnet = defineChain({
  id: GENLAYER_TESTNET_CHAIN_ID,
  name: "GenLayer Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "GEN",
    symbol: "GEN",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet-chain.genlayer.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "GenLayer Testnet Explorer",
      url: "https://explorer.testnet-chain.genlayer.com",
    },
  },
  testnet: true,
});

export const supportedChains = [genLayerTestnet, mainnet] as const;
export const requiredChain = genLayerTestnet;

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [
    injected({
      shimDisconnect: true,
      target: {
        id: "metaMask",
        name: "MetaMask",
        provider: getMetaMaskProvider,
      },
    }),
  ],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  storage: createStorage({
    key: "trustcourt.wallet",
    storage: typeof window === "undefined" ? noopStorage : window.localStorage,
  }),
  transports: {
    [genLayerTestnet.id]: http("https://rpc.testnet-chain.genlayer.com"),
    [mainnet.id]: http(),
  },
});

export function createWeb3QueryClient() {
  return new QueryClient();
}

export function getMetaMaskProvider(): MetaMaskProvider | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const ethereum = window.ethereum;

  if (!ethereum) {
    return undefined;
  }

  if (ethereum.providers?.length) {
    return ethereum.providers.find((provider) => provider.isMetaMask);
  }

  return ethereum.isMetaMask ? ethereum : undefined;
}

export function isMetaMaskInstalled(): boolean {
  return Boolean(getMetaMaskProvider());
}

export function isSupportedChain(chainId: number | undefined): boolean {
  return chainId === requiredChain.id;
}

export async function addOrSwitchToGenLayerTestnet(): Promise<void> {
  const provider = getMetaMaskProvider();

  if (!provider) {
    throw new Error("MetaMask is not installed.");
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GENLAYER_TESTNET_CHAIN_ID_HEX }],
    });
  } catch (error) {
    const switchError = error as { code?: number };

    if (switchError.code !== 4902) {
      throw error;
    }

    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          blockExplorerUrls: ["https://explorer.testnet-chain.genlayer.com"],
          chainId: GENLAYER_TESTNET_CHAIN_ID_HEX,
          chainName: "GenLayer Testnet",
          nativeCurrency: {
            decimals: 18,
            name: "GEN",
            symbol: "GEN",
          },
          rpcUrls: ["https://rpc.testnet-chain.genlayer.com"],
        },
      ],
    });
  }
}

export function formatAddress(address: string | undefined): string {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function useMetaMaskWallet() {
  const connection = useConnection();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { reconnect } = useReconnect();

  const metaMaskConnector = useMemo(
    () => connectors.find((connector) => connector.id === "metaMask"),
    [connectors],
  );

  const hasMetaMask = isMetaMaskInstalled();
  const wrongNetwork =
    connection.isConnected && !isSupportedChain(connection.chainId);

  return {
    address: connection.address,
    chain: connection.chain,
    chainId: connection.chainId,
    connectError: error,
    connectMetaMask: () => {
      if (metaMaskConnector) {
        connect({ connector: metaMaskConnector });
      }
    },
    connectionStatus: connection.status,
    disconnect,
    formattedAddress: formatAddress(connection.address),
    hasMetaMask,
    isConnected: connection.isConnected,
    isConnecting: connection.isConnecting || isPending,
    metaMaskConnector,
    reconnect,
    requiredChain,
    switchToRequiredChain: addOrSwitchToGenLayerTestnet,
    wrongNetwork,
  };
}
