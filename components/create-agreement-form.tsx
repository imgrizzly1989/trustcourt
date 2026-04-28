"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  createAgreement as createGenLayerAgreement,
  getGenLayerModeLabel,
  getGenLayerReadinessMessage,
} from "@/lib/genlayerClient";
import { getGenLayerRuntimeConfig } from "@/lib/genlayerConfig";
import {
  AgreementDraft,
  AgreementValidationErrors,
  createAgreementFromDraft,
  hasValidationErrors,
  saveAgreement,
  validateAgreementDraft,
} from "@/lib/storage";

const initialDraft: AgreementDraft = {
  client: "",
  builder: "",
  amount: "",
  deadline: "",
  title: "",
  terms: "",
};

export function CreateAgreementForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<AgreementDraft>(initialDraft);
  const [errors, setErrors] = useState<AgreementValidationErrors>({});
  const [txError, setTxError] = useState("");
  const [txMessage, setTxMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    field: keyof AgreementDraft,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: event.target.value,
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateAgreementDraft(draft);
    setErrors(nextErrors);
    setTxError("");
    setTxMessage("");

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const agreement = createAgreementFromDraft(draft);
      const txResult = await createGenLayerAgreement({
        amount: agreement.amount,
        builder: agreement.builder,
        client: agreement.client,
        id: agreement.id,
        terms: agreement.terms,
        title: agreement.title,
      });

      if (txResult.state === "failure") {
        setTxError(txResult.error ?? "Unable to create agreement transaction.");
        return;
      }

      const config = getGenLayerRuntimeConfig();
      saveAgreement({
        ...agreement,
        genLayerContractAddress: config.contractAddress,
        genLayerMode: txResult.mode,
        genLayerTxs: [
          {
            action: "create_agreement",
            createdAt: new Date().toISOString(),
            hash: txResult.txHash,
            mode: txResult.mode,
          },
        ],
      });
      setTxMessage(
        txResult.mode === "real"
          ? "Agreement transaction sent to GenLayer."
          : "Agreement saved in demo mode with a mock transaction hash.",
      );
      router.push(`/agreements/${agreement.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          error={errors.client}
          label="Client wallet"
          name="client"
          onChange={(event) => updateField("client", event)}
          placeholder="0x..."
          value={draft.client}
        />
        <FormField
          error={errors.builder}
          label="Builder wallet"
          name="builder"
          onChange={(event) => updateField("builder", event)}
          placeholder="0x..."
          value={draft.builder}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          error={errors.amount}
          label="Amount"
          min="0"
          name="amount"
          onChange={(event) => updateField("amount", event)}
          placeholder="2500"
          step="0.01"
          type="number"
          value={draft.amount}
        />
        <FormField
          error={errors.deadline}
          label="Deadline"
          name="deadline"
          onChange={(event) => updateField("deadline", event)}
          type="date"
          value={draft.deadline}
        />
      </div>

      <FormField
        error={errors.title}
        label="Agreement title"
        name="title"
        onChange={(event) => updateField("title", event)}
        placeholder="Landing page redesign"
        value={draft.title}
      />

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="terms">
          Terms
        </label>
        <textarea
          className="min-h-36 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          id="terms"
          name="terms"
          onChange={(event) => updateField("terms", event)}
          placeholder="Describe exact deliverables, acceptance criteria, and dispute-relevant terms."
          value={draft.terms}
        />
        {errors.terms ? (
          <p className="text-sm text-destructive">{errors.terms}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">GenLayer mode: {getGenLayerModeLabel()}</p>
        <p className="mt-1">{getGenLayerReadinessMessage()}</p>
      </div>

      <Button className="w-fit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating..." : "Create Agreement"}
      </Button>

      {txError ? <p className="text-sm text-destructive">{txError}</p> : null}
      {txMessage ? <p className="text-sm text-muted-foreground">{txMessage}</p> : null}
    </form>
  );
}

type FormFieldProps = {
  error?: string;
  label: string;
  min?: string;
  name: keyof AgreementDraft;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  step?: string;
  type?: string;
  value: string;
};

function FormField({
  error,
  label,
  min,
  name,
  onChange,
  placeholder,
  step,
  type = "text",
  value,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        id={name}
        min={min}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        type={type}
        value={value}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
