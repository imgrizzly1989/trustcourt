import Link from "next/link";

import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Lock Agreement",
    description: "Define terms and deposit funds",
  },
  {
    title: "Submit Work",
    description: "Provide deliverables and evidence",
  },
  {
    title: "AI Resolves",
    description: "Simulated AI evaluates and decides outcome",
  },
];

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 overflow-hidden bg-[#0b0b0f] text-white">
      <style>{`body > header { display: none; }`}</style>

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.20),transparent_34%),radial-gradient(circle_at_78%_12%,rgba(37,99,235,0.16),transparent_28%),linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_58%,#060609_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30 [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <section className="flex min-h-[720px] flex-col items-center justify-center pb-20 pt-[120px] text-center">
          <div className="rounded-full border border-[#222] bg-[#111]/80 px-4 py-2 text-xs font-medium text-[#aaa] shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            Demo Mode — simulated arbitration
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.065em] text-white sm:text-7xl lg:text-8xl">
            Resolve freelance disputes with AI
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-7 text-[#aaa] sm:text-xl sm:leading-8">
            TrustCourt demonstrates how GenLayer Intelligent Contracts can evaluate real work and enforce outcomes using AI.
          </p>

          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-xl border-0 bg-gradient-to-r from-violet-500 to-blue-500 px-7 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(99,102,241,0.32)] hover:from-violet-400 hover:to-blue-400"
              size="lg"
            >
              <Link href="/demo">View Demo</Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-xl border border-[#222] bg-transparent px-7 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.04]"
              size="lg"
              variant="outline"
            >
              <Link href="/create">Create Agreement</Link>
            </Button>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                className="group rounded-xl border border-[#222] bg-[#111] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.26)] transition duration-200 hover:-translate-y-1 hover:border-violet-400/40"
                key={step.title}
              >
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/18 to-blue-500/18 text-sm font-semibold text-violet-100 ring-1 ring-white/10">
                  0{index + 1}
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#aaa]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-20 text-center sm:py-24">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#222] bg-[#111] px-6 py-12 shadow-[0_26px_100px_rgba(0,0,0,0.34)] sm:px-10 sm:py-16">
            <h2 className="text-3xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
              See a real dispute resolved
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#aaa] sm:text-lg">
              Walk through a simulated arbitration where AI evaluates claims and determines payout.
            </p>
            <Button
              asChild
              className="mt-8 h-12 rounded-xl border-0 bg-gradient-to-r from-violet-500 to-blue-500 px-7 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(99,102,241,0.28)] hover:from-violet-400 hover:to-blue-400"
              size="lg"
            >
              <Link href="/demo">Open Demo</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-8 py-20 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
              Why GenLayer?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#aaa] sm:text-lg sm:leading-8">
              Traditional smart contracts execute rules. GenLayer introduces AI-assisted decision-making, enabling contracts to evaluate subjective outcomes like quality of work.
            </p>
          </div>

          <div className="rounded-xl border border-[#222] bg-[#111] p-6 shadow-[0_22px_90px_rgba(0,0,0,0.3)]">
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#0b0b0f] px-4 py-4">
                <span className="text-sm font-medium text-white">Rules</span>
                <span className="text-sm text-[#aaa]">predictable</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#0b0b0f] px-4 py-4">
                <span className="text-sm font-medium text-white">Decisions</span>
                <span className="text-sm text-[#aaa]">flexible</span>
              </div>
              <div className="rounded-xl border border-violet-400/30 bg-gradient-to-r from-violet-500/16 to-blue-500/16 px-4 py-5 shadow-[0_0_70px_rgba(99,102,241,0.12)]">
                <p className="text-sm font-semibold text-white">AI Validators</p>
                <p className="mt-2 text-sm leading-6 text-violet-100/75">
                  Bring reasoning to outcomes that cannot be captured by rigid if/then logic.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-[#222] py-8 text-sm text-[#aaa] sm:flex-row sm:items-center sm:justify-between">
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
