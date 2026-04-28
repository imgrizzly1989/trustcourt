import Link from "next/link";

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

        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl backdrop-blur before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-purple-500/10 before:to-blue-500/10 before:blur-xl before:content-['']">
          <div className="text-sm text-zinc-400">Agreement: Landing Page Build</div>

          <div className="mt-4 flex justify-between">
            <div className="text-xs text-zinc-500">Status</div>
            <div className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-400">Disputed</div>
          </div>

          <div className="my-4 border-t border-zinc-800" />

          <div className="text-sm text-zinc-400">AI Verdict</div>
          <div className="mt-1 text-lg font-medium text-white">Split 70 / 30</div>

          <div className="mt-3 text-xs text-zinc-500">
            <span className="font-medium text-purple-400">Confidence: 82%</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-6">
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
