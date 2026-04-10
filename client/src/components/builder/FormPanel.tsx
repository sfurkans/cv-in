interface FormPanelProps {
  activeSection: string
}

export default function FormPanel({ activeSection }: FormPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="mb-4 text-lg font-semibold capitalize">
        {activeSection}
      </h2>
      <p className="text-sm text-muted-foreground">
        Form alanı — Phase 2'de doldurulacak.
      </p>
    </div>
  )
}
