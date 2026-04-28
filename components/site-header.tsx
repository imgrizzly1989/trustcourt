import Link from "next/link";

import { ConnectMetaMaskButton } from "@/components/connect-metamask-button";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#05050a]/80 px-5 py-4 text-white backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="flex items-center gap-3 text-sm font-semibold tracking-tight" href="/">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            TC
          </span>
          <span>TrustCourt</span>
        </Link>
        <ConnectMetaMaskButton />
      </div>
    </header>
  );
}
