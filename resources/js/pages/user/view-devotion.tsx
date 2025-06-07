import { DevotionView } from "@/components/devotion-view"

export default function DevotionPage({ params }: { params: { id: string } }) {
  return <DevotionView devotionId={params.id} />
}
