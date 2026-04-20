import ResumePreview from '@/components/preview/ResumePreview'

import PDFExportButton from './PDFExportButton'
import SaveButton from './SaveButton'
import SyncStatusIndicator from './SyncStatusIndicator'

export default function PreviewPanel() {
  return (
    <div className="flex h-full w-full shrink-0 flex-col border-l border-border/60 bg-muted/20 lg:w-[calc(210mm+48px)]">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur">
        <SyncStatusIndicator />
        <div className="flex items-center gap-2">
          <SaveButton />
          <PDFExportButton />
        </div>
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <ResumePreview />
      </div>
    </div>
  )
}
