'use client'

import { Badge } from '@/features/shadcn/components/ui/badge'

interface MediaTabsProps {
  activeTab: 'my-files' | 'gallery'
  onTabChange: (tab: 'my-files' | 'gallery') => void
  uploadsCount: number
  galleryCount: number
}

export function MediaTabs({ 
  activeTab, 
  onTabChange, 
  uploadsCount, 
  galleryCount 
}: MediaTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg mb-3">
      <button
        type="button"
        onClick={() => onTabChange('my-files')}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'my-files'
            ? 'bg-background shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span className="flex items-center gap-2 justify-center">
          Mis Archivos
          <Badge variant="secondary">{uploadsCount}/4</Badge>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onTabChange('gallery')}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'gallery'
            ? 'bg-background shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span className="flex items-center gap-2 justify-center">
          Galería
          {galleryCount > 0 && (
            <Badge variant="outline">{galleryCount}</Badge>
          )}
        </span>
      </button>
    </div>
  )
}