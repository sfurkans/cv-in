import { zodResolver } from '@hookform/resolvers/zod'
import { Layers, Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  customSectionSchema,
  type CustomSectionFormValues,
} from '@/schemas/customSectionSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { CustomField, CustomSection } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

function CustomFieldRow({
  sectionId,
  field,
}: {
  sectionId: string
  field: CustomField
}) {
  const updateCustomFieldAt = useResumeStore(
    (s) => s.updateCustomFieldAt
  )
  const removeCustomFieldFrom = useResumeStore(
    (s) => s.removeCustomFieldFrom
  )

  return (
    <div className="flex items-start gap-2 rounded-md border bg-muted/30 p-2">
      <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr]">
        <Input
          placeholder="Alan Başlığı"
          value={field.label}
          onChange={(e) =>
            updateCustomFieldAt(sectionId, field.id, {
              label: e.target.value,
            })
          }
          aria-label="Alan başlığı"
        />
        <Textarea
          placeholder="Değer"
          value={field.value}
          onChange={(e) =>
            updateCustomFieldAt(sectionId, field.id, {
              value: e.target.value,
            })
          }
          className="min-h-9 resize-none"
          rows={1}
          aria-label="Alan değeri"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => removeCustomFieldFrom(sectionId, field.id)}
        aria-label="Alanı kaldır"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

function CustomSectionCard({
  section,
  index,
}: {
  section: CustomSection
  index: number
}) {
  const updateCustomSectionAt = useResumeStore(
    (s) => s.updateCustomSectionAt
  )
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection)
  const addCustomFieldTo = useResumeStore((s) => s.addCustomFieldTo)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<CustomSectionFormValues>({
    resolver: zodResolver(customSectionSchema),
    mode: 'onChange',
    defaultValues: {
      title: section.title,
      fields: section.fields,
    },
  })

  const watchedTitle = watch('title')

  useEffect(() => {
    const timer = setTimeout(() => {
      updateCustomSectionAt(section.id, { title: watchedTitle })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [watchedTitle, updateCustomSectionAt, section.id])

  const headerTitle = section.title || `Özel Bölüm #${index + 1}`

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="truncate text-sm font-medium text-muted-foreground">
            {headerTitle}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeCustomSection(section.id)}
            aria-label="Bölümü kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor={`custom-title-${section.id}`}>
            Bölüm Başlığı <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`custom-title-${section.id}`}
            placeholder="Hobiler, Ödüller, Referanslar..."
            aria-invalid={!!errors.title}
            {...register('title')}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Alanlar</Label>
          {section.fields.length === 0 ? (
            <div className="rounded-md border border-dashed bg-muted/20 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Henüz alan yok. Aşağıdaki butonla ekle.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {section.fields.map((field) => (
                <CustomFieldRow
                  key={field.id}
                  sectionId={section.id}
                  field={field}
                />
              ))}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => addCustomFieldTo(section.id)}
          >
            <Plus className="h-4 w-4" />
            Alan Ekle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CustomSectionsForm() {
  const customSections = useResumeStore((s) => s.resume.customSections)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const reorderCustomSections = useResumeStore(
    (s) => s.reorderCustomSections
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Özel Bölümler
          </CardTitle>
          <CardDescription>
            Kendi bölümlerini tanımla — Hobiler, Ödüller, Referanslar veya
            istediğin başka bir kategori.
          </CardDescription>
        </CardHeader>
      </Card>

      {customSections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Layers className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz özel bölüm eklenmedi.
            </p>
            <Button type="button" onClick={() => addCustomSection()}>
              <Plus className="h-4 w-4" />
              İlk Bölümünü Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={customSections.map((s) => s.id)}
            onReorder={reorderCustomSections}
          >
            <div className="space-y-4">
              {customSections.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <CustomSectionCard section={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addCustomSection()}
          >
            <Plus className="h-4 w-4" />
            Yeni Özel Bölüm Ekle
          </Button>
        </>
      )}
    </div>
  )
}
