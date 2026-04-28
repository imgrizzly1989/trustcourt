import Link from "next/link";

import { Button } from "@/components/ui/button";

const features = [
  {
    eyebrow: "01",
    title: "Agreement memory",
    description:
      "Structure parties, amount, deadline, and acceptance criteria before work starts — so disputes have facts, not chat screenshots.",
  },
  {
    eyebrow: "02",
    title: "Evidence-first disputes",
    description:
      "Submit work links, claims, and evidence in one review surface designed for fast AI-assisted arbitration.",
  },
  {
    eyebrow: "03",
    title: "GenLayer-ready boundary",
    description:
      "Deterministic escrow state stays separate from subjective natural-language arbitration logic.",
  },
];

const stats = [
  { label: "Demo escrow", value: "$3.2k" },
  { label: "Simulated confidence", value: "86%" },
  { label: "Client refund", value: "80%" },
];

export function LandingPage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl sm:h-[34rem] sm:w-[34rem]" />
        <div className="pointer-events-none absolute right-0 top-56 -z-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-100 shadow-[0_0_40px_rgba(139,92,246,0.16)]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                Demo Mode
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                AI escrow arbitration
              </span>
            </div>

            <h1 className="mt-8 max-w-4xl text-6xl font-semibold leading-[0.86] tracking-[-0.085em] text-foreground sm:text-7xl lg:text-8xl">
              TrustCourt
            </h1>
            <p className="mt-6 max-w-2xl text-2xl font-medium leading-[1.12] tracking-[-0.045em] text-foreground/90 sm:text-3xl lg:text-4xl">
              AI-enforced agreements powered by GenLayer.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A premium frontend MVP for freelance escrow: create an agreement, submit work, raise a dispute, and preview an evidence-based mock verdict. No real funds move in this demo.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/create">Create Agreement</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/demo">View Demo Dispute</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-8 -top-8 h-24 rounded-full bg-gradient-to-r from-violet-500/30 via-cyan-300/16 to-blue-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.032))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-6">
              <div className="absolute right-[-6rem] top-[-6rem] h-56 w-56 rounded-full bg-violet-500/24 blur-3xl" />
              <div className="relative flex items-start justify-between gap-5 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Arbitration console
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-foreground sm:text-3xl">
                    Broken delivery dispute
                  </h2>
                </div>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-cyan-100">
                  Resolved
                </span>
              </div>

              <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    className="rounded-[1.15rem] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    key={stat.label}
                  >
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 rounded-[1.35rem] border border-white/10 bg-black/25 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-100">
                    Simulated AI reasoning
                  </p>
                  <p className="text-xs text-muted-foreground">local verdict preview</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Core deliverables were missing, build failed after deadline, and partial UI work existed. The conservative split favors the client while recognizing completed work.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-3 lg:mt-16">
          {features.map((feature) => (
            <article
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-white/[0.055] sm:p-6"
              key={feature.title}
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-sm font-semibold text-violet-100">
                {feature.eyebrow}
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Demo Mode explanation
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-foreground">
                Honest MVP boundaries
              </h2>
            </div>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              TrustCourt currently demonstrates the product flow, contract boundary, and arbitration UX with local browser state and mock verdicts. It does not execute real GenLayer transactions, move escrowed funds, or call live AI arbitration yet.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
