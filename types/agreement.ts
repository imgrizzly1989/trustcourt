export enum AgreementStatus {
  CREATED = "CREATED",
  FUNDED = "FUNDED",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  DISPUTED = "DISPUTED",
  RESOLVED = "RESOLVED",
}

export type AgreementClaim = {
  clientClaim: string;
  builderClaim: string;
  evidenceLinks: string[];
  createdAt: string;
};

export type AgreementVerdict = {
  winner: "client" | "builder" | "split";
  paymentSplit: {
    clientPercent: number;
    builderPercent: number;
  };
  confidence: number;
  reasoning: string;
  missingEvidence: string[];
  riskFlags: string[];
};

export type AgreementGenLayerTx = {
  action: string;
  mode: "demo" | "real";
  hash?: string;
  createdAt: string;
};

export type Agreement = {
  id: string;
  client: string;
  builder: string;
  amount: number;
  deadline: string;
  title: string;
  terms: string;
  status: AgreementStatus;
  workUrl: string;
  createdAt: string;
  genLayerMode?: "demo" | "real";
  genLayerContractAddress?: string;
  genLayerTxs?: AgreementGenLayerTx[];
  claims?: AgreementClaim[];
  verdict?: AgreementVerdict;
};
