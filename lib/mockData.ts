import { Agreement, AgreementStatus } from "@/types/agreement";

export const mockAgreements: Agreement[] = [
  {
    id: "agr-001",
    client: "Atlas Studio",
    builder: "Nora Chen",
    amount: 2400,
    deadline: "2026-05-15",
    title: "Landing page redesign",
    terms:
      "Builder will deliver a responsive marketing landing page with final copy, componentized sections, and deployment-ready assets.",
    status: AgreementStatus.CREATED,
    workUrl: "",
    createdAt: "2026-04-20T09:00:00.000Z",
  },
  {
    id: "agr-002",
    client: "Northwind Labs",
    builder: "Malik Rivera",
    amount: 5200,
    deadline: "2026-05-30",
    title: "AI support dashboard MVP",
    terms:
      "Builder will create an internal dashboard prototype for reviewing AI support tickets, including filtering, status views, and handoff notes.",
    status: AgreementStatus.SUBMITTED,
    workUrl: "https://example.com/work/agr-002",
    createdAt: "2026-04-18T14:30:00.000Z",
  },
  {
    id: "agr-003",
    client: "Cedar Commerce",
    builder: "Priya Shah",
    amount: 1800,
    deadline: "2026-05-08",
    title: "Checkout audit and fixes",
    terms:
      "Builder will audit checkout UX, fix critical responsive issues, and provide a concise report of remaining recommendations.",
    status: AgreementStatus.DISPUTED,
    workUrl: "https://example.com/work/agr-003",
    createdAt: "2026-04-12T11:15:00.000Z",
  },
];

export function getAgreementById(id: string): Agreement | undefined {
  return mockAgreements.find((agreement) => agreement.id === id);
}
