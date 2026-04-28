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
    <main className="relative isolate min-h-screen overflow-hidden bg-[#0A0A0B] text-white [font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      <style>{`body > header { display: none; }`}</style>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="mx-auto max-w-[1100px] px-6">
        <section className="flex min-h-[80vh] flex-col items-center justify-center pb-20 pt-[120px] text-center">
          <div className="rounded-full bg-[rgba(124,58,237,0.15)] px-3 py-1.5 text-xs font-medium text-[#C4B5FD]">
            Demo Mode — Simulated Arbitration
          </div>

          <h1 className="mt-8 max-w-[720px] text-[44px] font-bold leading-[1.02] tracking-[-0.02em] text-white sm:text-[56px]">
            Resolve freelance disputes with AI
          </h1>

          <p className="mx-auto mt-4 max-w-[600px] text-base leading-7 text-[#A1A1AA]">
            TrustCourt demonstrates how GenLayer Intelligent Contracts evaluate real work and enforce outcomes using AI.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#7C3AED,#3B82F6)] px-5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(59,130,246,0.22)] transition hover:brightness-110"
              href="/demo"
            >
              View Demo
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#2A2A2E] bg-transparent px-5 text-sm font-semibold text-[#E4E4E7] transition hover:border-[#3A3A40] hover:bg-white/[0.03]"
              href="/create"
            >
              Create Agreement
            </Link>
          </div>
        </section>

        <section className="mt-[120px]">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
            How it works
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                className="rounded-2xl border border-[#1F1F23] bg-[#111113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1"
                key={step.title}
              >
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[240px] text-base leading-6 text-[#A1A1AA]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-[120px] text-center">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
            See a dispute resolved
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-[#A1A1AA]">
            Walk through a simulated arbitration where AI evaluates claims and determines payout.
          </p>
          <Link
            className="mt-8 inline-flex h-12 items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#7C3AED,#3B82F6)] px-5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(59,130,246,0.22)] transition hover:brightness-110"
            href="/demo"
          >
            Open Demo
          </Link>
        </section>

        <section className="mt-[120px] grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
              Why GenLayer?
            </h2>
            <p className="mt-4 max-w-[520px] text-base leading-7 text-[#A1A1AA]">
              Traditional smart contracts execute strict rules. GenLayer introduces AI-assisted decision-making, enabling contracts to evaluate subjective outcomes like quality of work.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F1F23] bg-[#111113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-6 border-b border-[#1F1F23] pb-4">
                <span className="text-sm font-medium text-white">Rules</span>
                <span className="text-sm text-[#A1A1AA]">predictable</span>
              </div>
              <div className="flex items-center justify-between gap-6 border-b border-[#1F1F23] pb-4">
                <span className="text-sm font-medium text-white">Decisions</span>
                <span className="text-sm text-[#A1A1AA]">flexible</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="bg-[linear-gradient(90deg,#7C3AED,#3B82F6)] bg-clip-text text-sm font-semibold text-transparent">
                  AI Validators
                </span>
                <span className="text-sm text-[#A1A1AA]">reasoning layer</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-[120px] flex flex-col gap-3 pb-10 text-sm text-[#71717A] sm:flex-row sm:items-center sm:justify-between">
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
