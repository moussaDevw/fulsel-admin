import { ResidenceForm } from "@/components/residence-form"

export default function NewResidencePage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight">Créer une Nouvelle Résidence</h1>
      <div className="mt-6">
        <ResidenceForm />
      </div>
    </div>
  )
}
