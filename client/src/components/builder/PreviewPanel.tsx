import ResumePreview from '@/components/preview/ResumePreview'

import PDFExportButton from './PDFExportButton'

export default function PreviewPanel() {
  return (
    <div className="flex w-[420px] shrink-0 flex-col border-l bg-muted/20">
      <div className="flex items-center justify-between border-b bg-background/50 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Önizleme
        </span>
        <PDFExportButton />
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <ResumePreview />
      </div>
    </div>
  )
}
