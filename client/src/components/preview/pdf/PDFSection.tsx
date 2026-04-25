import { View } from '@react-pdf/renderer'
import type { ComponentProps, ReactNode } from 'react'

interface PDFSectionProps<T> {
  items: T[]
  heading: ReactNode
  renderItem: (item: T) => ReactNode
  style?: ComponentProps<typeof View>['style']
}

export default function PDFSection<T>({
  items,
  heading,
  renderItem,
  style,
}: PDFSectionProps<T>) {
  if (items.length === 0) return null
  const [first, ...rest] = items
  return (
    <View style={style} wrap={false}>
      <View wrap={false}>
        {heading}
        {renderItem(first)}
      </View>
      {rest.map(renderItem)}
    </View>
  )
}
