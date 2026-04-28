import Link from "next/link";

import { Button } from "@/components/ui/button";

const workflowCards = [
  {
    step: "01",
    title: "Lock agreement",
    description:
      "Define parties, value, deadline, and acceptance criteria before the work begins.",
  },
  {
    step: "02",
    title: "Submit evidence",
    description:
      "Capture work links, claims, and dispute evidence in a structured arbitration record.",
  },
  {
    step: "03",
    title: "Resolve with AI",
    description:
      "Preview how an Intelligent Contract can reason over subjective delivery disputes.",
  },
];

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen flex-1 overflow-hidden bg-[#05050a] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.28),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.14),transparent_28%),linear-gradient(180deg,#05050a_0%,#070711_48%,#030305_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25 [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/25 blur-3xl sm:h-[34rem] sm:w-[34rem]" />

      <section className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:pt-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.045] px-4 py-2 text-xs font-medium text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_60px_rgba(124,58,237,0.18)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.95)]" />
            Demo Mode — arbitration is simulated
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.075em] text-white sm:text-7xl lg:text-8xl">
            AI-enforced agreements on GenLayer
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-7 text-zinc-300 sm:text-xl sm:leading-8">
            TrustCourt demonstrates how Intelligent Contracts can resolve freelance disputes using evidence, reasoning, and simulated AI arbitration.
          </p>

          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-xl bg-white px-6 text-sm font-semibold text-black shadow-[0_18px_60px_rgba(255,255,255,0.14)] hover:bg-zinc-200 sm:h-11"
              size="lg"
            >
              <Link href="/demo">View Demo Dispute</Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-xl border-white/12 bg-white/[0.045] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.075] sm:h-11"
              size="lg"
              variant="outline"
            >
              <Link href="/create">Create Agreement</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3 lg:mt-20">
          {workflowCards.map((card) => (
            <article
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-white/[0.065]"
              key={card.title}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                  {card.step}
                </span>
                <span className="h-2 w-2 rounded-full bg-violet-300/80 shadow-[0_0_24px_rgba(167,139,250,0.8)]" />
              </div>
              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.045em] text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{card.description}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.035))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:mt-6 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-violet-200">
                Why GenLayer?
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.055em] text-white sm:text-5xl">
                Subjective work needs more than deterministic code.
              </h2>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6">
              <p className="text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
                Normal smart contracts are excellent at enforcing objective rules, but they cannot judge whether freelance work matches a brief, whether evidence is persuasive, or how to split payment when delivery is partial. GenLayer Intelligent Contracts are designed for AI-assisted decisions, making them a natural fit for evidence-based dispute resolution.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
