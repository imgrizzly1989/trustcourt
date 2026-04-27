import { AgreementDetailView } from "@/components/agreement-detail-view";

type AgreementPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AgreementPage({ params }: AgreementPageProps) {
  const { id } = await params;

  return <AgreementDetailView id={id} />;
}
