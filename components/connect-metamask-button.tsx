"use client";

import { Button } from "@/components/ui/button";
import { useMetaMaskWallet } from "@/lib/web3";

export function ConnectMetaMaskButton() {
  const {
    chain,
    chainId,
    connectError,
    connectMetaMask,
    connectionStatus,
    disconnect,
    formattedAddress,
    hasMetaMask,
    isConnected,
    isConnecting,
    requiredChain,
    wrongNetwork,
  } = useMetaMaskWallet();

  if (!hasMetaMask) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-sm">
        <p className="font-medium">MetaMask is not installed.</p>
        <a
          className="mt-1 block text-muted-foreground underline underline-offset-4"
          href="https://metamask.io/download/"
          rel="noreferrer"
          target="_blank"
        >
          Install MetaMask to connect a wallet.
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-sm sm:min-w-72">
      <div className="grid gap-1">
        <p className="text-muted-foreground">Status: {connectionStatus}</p>
        <p>Address: {formattedAddress}</p>
        <p>
          Network: {chain?.name ?? (chainId ? `Unsupported #${chainId}` : "Unknown")}
        </p>
      </div>

      {wrongNetwork ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
          Wrong network. Please switch MetaMask to {requiredChain.name}.
        </p>
      ) : null}

      {connectError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
          {connectError.message}
        </p>
      ) : null}

      {isConnected ? (
        <Button onClick={() => disconnect()} type="button" variant="outline">
          Disconnect
        </Button>
      ) : (
        <Button disabled={isConnecting} onClick={connectMetaMask} type="button">
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}
    </div>
  );
}
