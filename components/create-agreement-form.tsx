"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateAgreementDraft(draft);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    const agreement = createAgreementFromDraft(draft);
    saveAgreement(agreement);
    router.push(`/agreements/${agreement.id}`);
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

      <Button className="w-fit" type="submit">
        Create Agreement
      </Button>
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
