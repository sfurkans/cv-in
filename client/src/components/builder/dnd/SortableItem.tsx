import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { ReactNode } from 'react'

interface SortableItemProps {
  id: string
  children: ReactNode
}

export default function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle — sol üst köşede, Card'ın üzerine konumlanıyor.
          Sadece bu butona basılınca sürükleme başlar, içerideki
          input'lar/butonlar etkilenmez. */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-1 top-3 z-10 flex h-7 w-5 cursor-grab items-center justify-center rounded text-muted-foreground/60 hover:bg-muted hover:text-muted-foreground active:cursor-grabbing"
        aria-label="Sürükleyerek sırala"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="pl-6">{children}</div>
    </div>
  )
}
