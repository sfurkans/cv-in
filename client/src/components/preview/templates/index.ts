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
  ats: boolean
  Component: ComponentType<TemplateProps>
}

export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  classic: {
    id: 'classic',
    name: 'Klasik',
    description: 'Tek sütun, sade ve profesyonel — ATS uyumlu varsayılan.',
    ats: true,
    Component: ClassicTemplate,
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Timeline çizgili, büyük tipografili, sade ve havalı.',
    ats: false,
    Component: ModernTemplate,
  },
  creative: {
    id: 'creative',
    name: 'Yaratıcı',
    description: 'İki sütunlu, renkli sidebar ve çarpıcı görsel kimlik.',
    ats: false,
    Component: CreativeTemplate,
  },
  'sidebar-left': {
    id: 'sidebar-left',
    name: 'İki Kolon — Sol',
    description: 'Soldaki sabit panelde fotoğraf, iletişim ve yetenekler.',
    ats: false,
    Component: SidebarLeftTemplate,
  },
  ats: {
    id: 'ats',
    name: 'ATS Dostu',
    description: 'Renksiz, grafiksiz, tek kolon — büyük şirket taramalarına ideal.',
    ats: true,
    Component: AtsTemplate,
  },
  'color-accent': {
    id: 'color-accent',
    name: 'Renk Vurgusu',
    description: 'Tek marka rengiyle çerçevelenmiş modern tek kolon.',
    ats: false,
    Component: ColorAccentTemplate,
  },
  'modern-clean': {
    id: 'modern-clean',
    name: 'Temiz Modern',
    description: 'Büyük sans-serif başlıklar, ferah boşluklar — ATS uyumlu.',
    ats: true,
    Component: ModernCleanTemplate,
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    description: 'Dark tema, monospace, terminal estetiği — yazılımcı showoff.',
    ats: false,
    Component: TerminalTemplate,
  },
  infographic: {
    id: 'infographic',
    name: 'Infografik',
    description: 'Yetenek çubukları ve görsel özet — tasarımcı portföyü hissi.',
    ats: false,
    Component: InfographicTemplate,
  },
}

export const TEMPLATE_LIST: TemplateMeta[] = Object.values(TEMPLATES)
