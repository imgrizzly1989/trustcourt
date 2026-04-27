import { CreateAgreementForm } from "@/components/create-agreement-form";

export default function CreateAgreementPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <header>
        <p className="text-sm font-medium text-muted-foreground">New agreement</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Create Agreement
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Draft the client, builder, amount, deadline, and terms. This step
          stores agreements locally only; escrow funding comes later.
        </p>
      </header>

      <CreateAgreementForm />
    </main>
  );
}
