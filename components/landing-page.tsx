import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-20 text-foreground">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p className="mb-6 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
          Freelance escrow + AI arbitration
        </p>

        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          TrustCourt
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          AI-enforced agreements powered by GenLayer
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href="/create">Create Agreement</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/demo">View Demo Dispute</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
