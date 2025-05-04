"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

interface KeyValueItem {
  key: string
  value: string
}

interface KeyValueViewerProps {
  items: KeyValueItem[]
}

export function KeyValueViewer({ items }: KeyValueViewerProps) {
  return (
    <ScrollArea className="h-full">
      {items.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">No items to display</div>
      ) : (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_2fr] gap-2 py-1 border-b">
              <div className="font-medium text-sm truncate">{item.key}</div>
              <div className="text-sm text-muted-foreground break-all">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
