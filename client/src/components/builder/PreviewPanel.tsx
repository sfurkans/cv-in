import ResumePreview from '@/components/preview/ResumePreview'

export default function PreviewPanel() {
  return (
    <div className="w-[420px] shrink-0 overflow-y-auto border-l bg-muted/20 p-6">
      <ResumePreview />
    </div>
  )
}
