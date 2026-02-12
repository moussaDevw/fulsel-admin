import { ResidenceForm } from "@/components/residence-form"

export default async function EditResidencePage({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Modifier la Résidence</h1>
      <ResidenceForm id={id} />
    </div>
  )
}
