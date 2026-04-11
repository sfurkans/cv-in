import type { ComponentType } from 'react'

import type { Resume, TemplateId } from '@/types/resume'

import PDFClassicTemplate from './PDFClassicTemplate'
import PDFCreativeTemplate from './PDFCreativeTemplate'
import PDFModernTemplate from './PDFModernTemplate'

export { default as PDFClassicTemplate } from './PDFClassicTemplate'
export { default as PDFCreativeTemplate } from './PDFCreativeTemplate'
export { default as PDFModernTemplate } from './PDFModernTemplate'

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
}
