import ResumePreview from '@/components/preview/ResumePreview'

import PDFExportButton from './PDFExportButton'
import SaveButton from './SaveButton'
import SyncStatusIndicator from './SyncStatusIndicator'

export default function PreviewPanel() {
  return (
    <div className="flex w-[calc(210mm+48px)] shrink-0 flex-col border-l bg-muted/20">
      <div className="flex items-center justify-between gap-3 border-b bg-background/50 px-4 py-2">
        <SyncStatusIndicator />
        <div className="flex items-center gap-2">
          <SaveButton />
          <PDFExportButton />
        </div>
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-6">
        <ResumePreview />
      </div>
    </div>
  )
}
