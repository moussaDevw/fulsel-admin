"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface DynamicListProps {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  emptyMessage?: string
  addButtonText?: string
}

export function DynamicList({
  items = [],
  onChange,
  placeholder = "Ajouter un élément...",
  emptyMessage = "Aucun élément ajouté",
  addButtonText = "Ajouter un élément",
}: DynamicListProps) {
  const [newItem, setNewItem] = useState("")

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()])
      setNewItem("")
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    onChange(newItems)
  }

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return

    const newItems = [...items]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddItem()
            }
          }}
        />
        <Button type="button" onClick={handleAddItem} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground py-2">{emptyMessage}</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2 group">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="cursor-grab opacity-50 group-hover:opacity-100"
                onClick={() => {}}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <div className="flex-1 border rounded-md px-3 py-2">{item}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
                className="opacity-50 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItem(index, index - 1)}
                  disabled={index === 0}
                  className="h-8 w-8 opacity-50 group-hover:opacity-100"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItem(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="h-8 w-8 opacity-50 group-hover:opacity-100"
                >
                  ↓
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
