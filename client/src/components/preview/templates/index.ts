import type { ComponentType } from 'react'

import type { Resume, TemplateId } from '@/types/resume'

import ClassicTemplate from './ClassicTemplate'
import CreativeTemplate from './CreativeTemplate'
import ModernTemplate from './ModernTemplate'
import SidebarLeftTemplate from './SidebarLeftTemplate'
import AtsTemplate from './AtsTemplate'
import ColorAccentTemplate from './ColorAccentTemplate'
import ModernCleanTemplate from './ModernCleanTemplate'
import TerminalTemplate from './TerminalTemplate'
import InfographicTemplate from './InfographicTemplate'

export { default as ClassicTemplate } from './ClassicTemplate'
export { default as CreativeTemplate } from './CreativeTemplate'
export { default as ModernTemplate } from './ModernTemplate'
export { default as SidebarLeftTemplate } from './SidebarLeftTemplate'
export { default as AtsTemplate } from './AtsTemplate'
export { default as ColorAccentTemplate } from './ColorAccentTemplate'
export { default as ModernCleanTemplate } from './ModernCleanTemplate'
export { default as TerminalTemplate } from './TerminalTemplate'
export { default as InfographicTemplate } from './InfographicTemplate'

export interface TemplateProps {
  resume: Resume
}

export interface TemplateMeta {
  id: TemplateId
  name: string
  description: string
  Component: ComponentType<TemplateProps>
}

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
  'sidebar-left': {
    id: 'sidebar-left',
    name: 'İki Kolon — Sol',
    description: 'Soldaki sabit panelde fotoğraf, iletişim ve yetenekler.',
    Component: SidebarLeftTemplate,
  },
  ats: {
    id: 'ats',
    name: 'ATS Dostu',
    description: 'Renksiz, grafiksiz, tek kolon — büyük şirket taramalarına ideal.',
    Component: AtsTemplate,
  },
  'color-accent': {
    id: 'color-accent',
    name: 'Renk Vurgusu',
    description: 'Tek marka rengiyle çerçevelenmiş modern tek kolon.',
    Component: ColorAccentTemplate,
  },
  'modern-clean': {
    id: 'modern-clean',
    name: 'Temiz Modern',
    description: 'Büyük sans-serif başlıklar ve ferah boşluklar.',
    Component: ModernCleanTemplate,
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    description: 'Dark tema, monospace, terminal estetiği — yazılımcı showoff.',
    Component: TerminalTemplate,
  },
  infographic: {
    id: 'infographic',
    name: 'Infografik',
    description: 'Yetenek çubukları ve görsel özet — tasarımcı portföyü hissi.',
    Component: InfographicTemplate,
  },
}

export const TEMPLATE_LIST: TemplateMeta[] = Object.values(TEMPLATES)
