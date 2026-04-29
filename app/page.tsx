import Link from "next/link";

import { ConnectMetaMaskButton } from "@/components/connect-metamask-button";

const steps = [
  {
    title: "Lock Agreement",
    description: "Define terms and deposit funds.",
  },
  {
    title: "Submit Work",
    description: "Provide deliverables and evidence.",
  },
  {
    title: "AI Resolves",
    description: "Simulated AI evaluates and decides outcome.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white">
      <style>{`header { display: none; }`}</style>

      <section className="container mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 px-6 pb-24 pt-32 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
            Demo Mode — Simulated Arbitration
          </div>

          <h1 className="text-5xl font-semibold tracking-tight text-white lg:text-6xl">
            Resolve freelance disputes with AI
          </h1>

          <p className="mt-6 max-w-md text-base text-zinc-400">
            TrustCourt demonstrates how GenLayer Intelligent Contracts evaluate real work and enforce outcomes using AI.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-white"
              href="/create"
            >
              Create Agreement
            </Link>
            <Link
              className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300"
              href="/demo"
            >
              View Demo Dispute
            </Link>
          </div>
        </div>

        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 text-left shadow-2xl shadow-purple-950/20 backdrop-blur before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-purple-500/20 before:via-blue-500/10 before:to-cyan-500/20 before:blur-2xl before:content-['']">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Agreement</div>
          <div className="mt-2 text-base font-medium text-white">Landing Page Build</div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="text-sm text-zinc-500">Status</div>
            <div className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
              Disputed
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/45 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">Client</div>
              <div className="mt-2 text-sm font-medium text-white">Payment refused</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/45 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">Builder</div>
              <div className="mt-2 text-sm font-medium text-white">Work delivered</div>
            </div>
          </div>

          <div className="my-6 border-t border-zinc-800" />

          <div>
            <div className="text-sm font-medium text-zinc-300">AI Analysis</div>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Mobile layout partially broken. Requirements partially met.
            </p>
          </div>

          <div className="my-6 border-t border-zinc-800" />

          <div>
            <div className="text-sm font-medium text-zinc-300">Verdict</div>
            <div className="mt-3 bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent lg:text-4xl">
              Split payout: 70% / 30%
            </div>
            <div className="mt-3 text-sm font-medium text-purple-300">Confidence: 82%</div>
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-4 text-xs uppercase tracking-[0.18em] text-zinc-500">
            Simulated AI decision
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-6">
        <section className="mt-8 flex justify-end">
          <div className="max-w-full">
            <ConnectMetaMaskButton />
          </div>
        </section>

        <section className="mt-32">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
            How it works
          </h2>

          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl transition duration-200 hover:-translate-y-1 hover:border-zinc-700"
                key={step.title}
              >
                <h3 className="text-lg font-semibold tracking-tight text-white">{step.title}</h3>
                <p className="mt-3 max-w-[240px] text-base leading-6 text-zinc-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-32 text-center">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
            See a dispute resolved
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-zinc-400">
            Walk through a simulated arbitration where AI evaluates claims and determines payout.
          </p>
          <Link
            className="mt-8 inline-flex rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-white"
            href="/demo"
          >
            View Demo Dispute
          </Link>
        </section>

        <section className="mt-32 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
              Why GenLayer?
            </h2>
            <p className="mt-4 max-w-[520px] text-base leading-7 text-zinc-400">
              Traditional smart contracts execute strict rules. GenLayer introduces AI-assisted decision-making, enabling contracts to evaluate subjective outcomes like quality of work.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-6 border-b border-zinc-800 pb-4">
                <span className="text-sm font-medium text-white">Rules</span>
                <span className="text-sm text-zinc-400">predictable</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-b border-zinc-800 pb-4">
                <span className="text-sm font-medium text-white">Decisions</span>
                <span className="text-sm text-zinc-400">flexible</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-sm font-semibold text-transparent">
                  AI Validators
                </span>
                <span className="text-sm text-zinc-400">reasoning layer</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-32 flex flex-col gap-3 pb-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="transition hover:text-white"
            href="https://github.com/imgrizzly1989/trustcourt"
            target="_blank"
          >
            GitHub repo
          </Link>
          <p>Built for GenLayer Hackathon</p>
        </footer>
      </div>
    </main>
  );
}
