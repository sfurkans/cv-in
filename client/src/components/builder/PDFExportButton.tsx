import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, Loader2 } from 'lucide-react'

import { PDF_TEMPLATES } from '@/components/preview/pdf'
import { Button } from '@/components/ui/button'
import { slugify } from '@/lib/slugify'
import { useResumeStore } from '@/store/resumeStore'

export default function PDFExportButton() {
  const resume = useResumeStore((state) => state.resume)

  const TemplateComponent = PDF_TEMPLATES[resume.templateId]
  const nameSlug = slugify(resume.basics.name) || 'CV'
  const fileName = `${nameSlug}_CV.pdf`

  return (
    <PDFDownloadLink
      document={<TemplateComponent resume={resume} />}
      fileName={fileName}
    >
      {({ loading, error }) => (
        <Button
          type="button"
          size="sm"
          disabled={loading || !!error}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Hazırlanıyor...
            </>
          ) : error ? (
            <>PDF hatası</>
          ) : (
            <>
              <Download className="h-4 w-4" />
              PDF İndir
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
