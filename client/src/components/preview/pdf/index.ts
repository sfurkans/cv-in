import type { ComponentType } from 'react'

import type { Resume, TemplateId } from '@/types/resume'

import PDFClassicTemplate from './PDFClassicTemplate'
import PDFCreativeTemplate from './PDFCreativeTemplate'
import PDFModernTemplate from './PDFModernTemplate'
import PDFSidebarLeftTemplate from './PDFSidebarLeftTemplate'
import PDFAtsTemplate from './PDFAtsTemplate'
import PDFColorAccentTemplate from './PDFColorAccentTemplate'
import PDFModernCleanTemplate from './PDFModernCleanTemplate'
import PDFTerminalTemplate from './PDFTerminalTemplate'
import PDFInfographicTemplate from './PDFInfographicTemplate'
import PDFEuropassTemplate from './PDFEuropassTemplate'

export { default as PDFClassicTemplate } from './PDFClassicTemplate'
export { default as PDFCreativeTemplate } from './PDFCreativeTemplate'
export { default as PDFModernTemplate } from './PDFModernTemplate'
export { default as PDFSidebarLeftTemplate } from './PDFSidebarLeftTemplate'
export { default as PDFAtsTemplate } from './PDFAtsTemplate'
export { default as PDFColorAccentTemplate } from './PDFColorAccentTemplate'
export { default as PDFModernCleanTemplate } from './PDFModernCleanTemplate'
export { default as PDFTerminalTemplate } from './PDFTerminalTemplate'
export { default as PDFInfographicTemplate } from './PDFInfographicTemplate'
export { default as PDFEuropassTemplate } from './PDFEuropassTemplate'

export interface PDFTemplateProps {
  resume: Resume
}

export const PDF_TEMPLATES: Record<
  TemplateId,
  ComponentType<PDFTemplateProps>
> = {
  classic: PDFClassicTemplate,
  modern: PDFModernTemplate,
  creative: PDFCreativeTemplate,
  'sidebar-left': PDFSidebarLeftTemplate,
  ats: PDFAtsTemplate,
  'color-accent': PDFColorAccentTemplate,
  'modern-clean': PDFModernCleanTemplate,
  terminal: PDFTerminalTemplate,
  infographic: PDFInfographicTemplate,
  europass: PDFEuropassTemplate,
}
