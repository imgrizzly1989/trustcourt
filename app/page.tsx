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
      <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08),transparent_62%)] blur-2xl" />

      <div className="mx-auto max-w-[1100px] px-6">
        <section className="grid min-h-[80vh] items-center gap-14 pb-24 pt-[120px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="inline-flex rounded-full bg-[rgba(124,58,237,0.15)] px-3 py-1.5 text-xs font-medium text-[#C4B5FD] ring-1 ring-[#7C3AED]/20">
              Demo Mode — Simulated Arbitration
            </div>

            <h1 className="mt-8 max-w-[720px] text-[44px] font-bold leading-[1.02] tracking-[-0.02em] text-white sm:text-[56px]">
              Resolve freelance disputes with AI
            </h1>

            <p className="mx-auto mt-4 max-w-[600px] text-base leading-7 text-[#A1A1AA] lg:mx-0">
              TrustCourt demonstrates how GenLayer Intelligent Contracts evaluate real work and enforce outcomes using AI.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#7C3AED,#3B82F6)] px-5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(59,130,246,0.26)] transition hover:brightness-110"
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
          </div>

          <div className="relative mx-auto w-full max-w-[430px] lg:mx-0 lg:justify-self-end">
            <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.24),rgba(59,130,246,0.10)_36%,transparent_68%)] blur-2xl" />
            <div className="rounded-[22px] bg-[linear-gradient(135deg,rgba(124,58,237,0.55),rgba(59,130,246,0.38),rgba(255,255,255,0.08))] p-px shadow-[0_34px_110px_rgba(0,0,0,0.55),0_0_80px_rgba(124,58,237,0.12)]">
              <div className="rounded-[21px] border border-white/[0.04] bg-[#111113]/95 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4 border-b border-[#1F1F23] pb-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#71717A]">
                      Agreement
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
                      Landing Page Build
                    </h2>
                  </div>
                  <span className="rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-3 py-1.5 text-xs font-medium text-[#C4B5FD]">
                    Disputed
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border border-[#1F1F23] bg-[#0A0A0B]/70 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#71717A]">
                      AI Verdict
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <p className="bg-[linear-gradient(90deg,#C4B5FD,#93C5FD)] bg-clip-text text-3xl font-semibold tracking-[-0.04em] text-transparent">
                        Split 70/30
                      </p>
                      <span className="mb-1 rounded-full bg-white/[0.04] px-2.5 py-1 text-xs text-[#A1A1AA] ring-1 ring-white/[0.06]">
                        mock
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#1F1F23] bg-[#0A0A0B]/70 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#A1A1AA]">Confidence</span>
                      <span className="font-semibold text-white">82%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1F1F23]">
                      <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,#7C3AED,#3B82F6)] shadow-[0_0_24px_rgba(59,130,246,0.45)]" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-[#1F1F23] bg-white/[0.025] p-4">
                    <p className="text-[#71717A]">Client</p>
                    <p className="mt-2 font-semibold text-white">70%</p>
                  </div>
                  <div className="rounded-2xl border border-[#1F1F23] bg-white/[0.025] p-4">
                    <p className="text-[#71717A]">Builder</p>
                    <p className="mt-2 font-semibold text-white">30%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-[140px]">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
            How it works
          </h2>

          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                className="rounded-2xl border border-[#1F1F23] bg-[#111113] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:border-[#2A2A31]"
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

        <section className="mt-[140px] text-center">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
            See a dispute resolved
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-[#A1A1AA]">
            Walk through a simulated arbitration where AI evaluates claims and determines payout.
          </p>
          <Link
            className="mt-8 inline-flex h-12 items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#7C3AED,#3B82F6)] px-5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(59,130,246,0.26)] transition hover:brightness-110"
            href="/demo"
          >
            Open Demo
          </Link>
        </section>

        <section className="mt-[140px] grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white">
              Why GenLayer?
            </h2>
            <p className="mt-4 max-w-[520px] text-base leading-7 text-[#A1A1AA]">
              Traditional smart contracts execute strict rules. GenLayer introduces AI-assisted decision-making, enabling contracts to evaluate subjective outcomes like quality of work.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F1F23] bg-[#111113] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
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

        <footer className="mt-[140px] flex flex-col gap-3 pb-10 text-sm text-[#71717A] sm:flex-row sm:items-center sm:justify-between">
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
