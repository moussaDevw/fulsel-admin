import { ResidenceForm } from "@/components/residence-form"

export default function EditResidencePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight">Modifier la Résidence</h1>
      <div className="mt-6">
        <ResidenceForm id={params.id} />
      </div>
    </div>
  )
}
