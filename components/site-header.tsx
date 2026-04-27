import Link from "next/link";

import { ConnectMetaMaskButton } from "@/components/connect-metamask-button";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-lg font-semibold tracking-tight" href="/">
          TrustCourt
        </Link>
        <ConnectMetaMaskButton />
      </div>
    </header>
  );
}
