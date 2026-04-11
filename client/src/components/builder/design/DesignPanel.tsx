import { Palette } from 'lucide-react'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import JsonImportExport from './JsonImportExport'
import TemplateSelector from './TemplateSelector'
import ThemePicker from './ThemePicker'

export default function DesignPanel() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Tasarım
          </CardTitle>
          <CardDescription>
            Şablonu ve renk paletini buradan ayarla. Değişiklikler önizlemeye
            anında yansır.
          </CardDescription>
        </CardHeader>
      </Card>

      <TemplateSelector />
      <ThemePicker />
      <JsonImportExport />
    </div>
  )
}
