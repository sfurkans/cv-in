import type { ComponentType } from 'react'

import type { Resume, TemplateId } from '@/types/resume'

import ClassicTemplate from './ClassicTemplate'
import CreativeTemplate from './CreativeTemplate'
import ModernTemplate from './ModernTemplate'

export { default as ClassicTemplate } from './ClassicTemplate'
export { default as CreativeTemplate } from './CreativeTemplate'
export { default as ModernTemplate } from './ModernTemplate'

export interface TemplateProps {
  resume: Resume
}

export interface TemplateMeta {
  id: TemplateId
  name: string
  description: string
  Component: ComponentType<TemplateProps>
}

// Adım 4 ve 7 de Modern ve Creative componentleri yazılınca burası güncellenecek.
// Şimdilik üçü de Classic e map ediliyor — dispatch altyapısı çalışıyor mu test
// edebilelim diye.
export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  classic: {
    id: 'classic',
    name: 'Klasik',
    description: 'Tek sütun, sade ve profesyonel — ATS uyumlu varsayılan.',
    Component: ClassicTemplate,
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Timeline çizgili, büyük tipografili, sade ve havalı.',
    Component: ModernTemplate,
  },
  creative: {
    id: 'creative',
    name: 'Yaratıcı',
    description: 'İki sütunlu, renkli sidebar ve çarpıcı görsel kimlik.',
    Component: CreativeTemplate,
  },
}

export const TEMPLATE_LIST: TemplateMeta[] = Object.values(TEMPLATES)
