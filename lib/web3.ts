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
import { mainnet, sepolia } from "wagmi/chains";
import type { EIP1193Provider } from "viem";

type MetaMaskProvider = EIP1193Provider & {
  isMetaMask?: true;
  providers?: MetaMaskProvider[];
};

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

export const supportedChains = [sepolia, mainnet] as const;
export const requiredChain = sepolia;

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
    [sepolia.id]: http(),
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
  return supportedChains.some((chain) => chain.id === chainId);
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
    wrongNetwork,
  };
}
