import { AgreementsView } from "@/components/agreements-view";

export default function AgreementsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header>
        <p className="text-sm font-medium text-muted-foreground">Workspace</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Agreements</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Review mock agreements plus agreements created locally in this
          browser.
        </p>
      </header>

      <AgreementsView />
    </main>
  );
}
