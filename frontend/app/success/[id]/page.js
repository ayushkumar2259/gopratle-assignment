import SuccessDetails from "@/components/SuccessDetails";

export default async function SuccessPage({ params }) {
  const { id } = await params;
  return <SuccessDetails id={id} />;
}
