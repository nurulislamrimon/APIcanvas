"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KeyValueItem {
  key: string
  value: string
  enabled: boolean
}

interface KeyValueEditorProps {
  items: KeyValueItem[]
  onChange: (items: KeyValueItem[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export function KeyValueEditor({
  items,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: KeyValueEditorProps) {
  // Add a new item
  const addItem = () => {
    onChange([...items, { key: "", value: "", enabled: true }])
  }

  // Remove an item
  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    onChange(newItems)
  }

  // Update an item
  const updateItem = (index: number, field: keyof KeyValueItem, value: string | boolean) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    onChange(newItems)
  }

  return (
    <div className="space-y-2">
      <ScrollArea className="max-h-[300px]">
        {items.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No items yet. Add one below.</div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Checkbox checked={item.enabled} onCheckedChange={(checked) => updateItem(index, "enabled", !!checked)} />
              <Input
                placeholder={keyPlaceholder}
                value={item.key}
                onChange={(e) => updateItem(index, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder={valuePlaceholder}
                value={item.value}
                onChange={(e) => updateItem(index, "value", e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </ScrollArea>

      <Button variant="outline" size="sm" className="w-full" onClick={addItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  )
}
