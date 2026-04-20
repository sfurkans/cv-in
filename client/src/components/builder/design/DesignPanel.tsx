import JsonImportExport from './JsonImportExport'
import TemplateSelector from './TemplateSelector'
import ThemePicker from './ThemePicker'

export default function DesignPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Şablonu ve renk paletini buradan ayarla. Değişiklikler önizlemeye anında
        yansır.
      </p>
      <TemplateSelector />
      <ThemePicker />
      <JsonImportExport />
    </div>
  )
}
