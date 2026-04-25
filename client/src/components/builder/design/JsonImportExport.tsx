import { AlertCircle, CheckCircle2, Download, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { importEuropassJson } from '@/lib/europass/fromEuropass'
import { downloadEuropassJson } from '@/lib/europass/toEuropass'
import { exportResumeAsJson, importResumeFromJson } from '@/lib/jsonIO'
import { useResumeStore } from '@/store/resumeStore'

type Status =
  | { kind: 'idle' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }

export default function JsonImportExport() {
  const resume = useResumeStore((state) => state.resume)
  const loadResume = useResumeStore((state) => state.loadResume)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const europassFileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const handleExport = () => {
    exportResumeAsJson(resume)
    setStatus({ kind: 'success', message: 'JSON dosyası indirildi.' })
  }

  const handleEuropassExport = () => {
    downloadEuropassJson(resume)
    setStatus({ kind: 'success', message: 'Europass JSON dosyası indirildi.' })
  }

  const handleEuropassImportClick = () => {
    europassFileRef.current?.click()
  }

  const handleEuropassFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const result = importEuropassJson(text)

      if (result.ok) {
        const confirmed = window.confirm(
          'Mevcut CV tamamen üzerine yazılacak. Devam edilsin mi?',
        )
        if (!confirmed) {
          setStatus({ kind: 'idle' })
          return
        }
        loadResume(result.resume)
        setStatus({
          kind: 'success',
          message: `"${file.name}" Europass formatından yüklendi.`,
        })
      } else {
        setStatus({ kind: 'error', message: result.error })
      }
    } catch {
      setStatus({ kind: 'error', message: 'Dosya okunamadı.' })
    } finally {
      if (europassFileRef.current) europassFileRef.current.value = ''
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const result = importResumeFromJson(text)

      if (result.ok) {
        loadResume(result.resume)
        setStatus({
          kind: 'success',
          message: `"${file.name}" yüklendi, CV güncellendi.`,
        })
      } else {
        setStatus({ kind: 'error', message: result.error })
      }
    } catch {
      setStatus({
        kind: 'error',
        message: 'Dosya okunamadı. Lütfen tekrar dene.',
      })
    } finally {
      // Input'u temizle ki aynı dosya tekrar seçilebilsin
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div>
          <h3 className="text-sm font-medium">Yedekleme</h3>
          <p className="text-xs text-muted-foreground">
            CV'ni JSON olarak yedekle veya başka bir cihazdan içeri aktar.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            JSON Dışa Aktar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleImportClick}
          >
            <Upload className="h-4 w-4" />
            JSON İçe Aktar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleEuropassExport}
          >
            <Download className="h-4 w-4" />
            Europass İndir
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleEuropassImportClick}
          >
            <Upload className="h-4 w-4" />
            Europass Yükle
          </Button>
          <input
            ref={europassFileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleEuropassFileChange}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        {status.kind === 'success' && (
          <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {status.kind === 'error' && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          İçe aktarma mevcut CV'ni tamamen değiştirir — önce dışa aktarıp
          yedek almak iyi fikir.
        </p>
      </CardContent>
    </Card>
  )
}
