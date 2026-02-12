import { ResidenceForm } from "@/components/residence-form"

export default function NewResidencePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Nouvelle Résidence</h1>
      <ResidenceForm />
    </div>
  )
}
