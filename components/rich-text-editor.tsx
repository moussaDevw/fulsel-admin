"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorContent, setEditorContent] = useState(value)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [])

  // Handle editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      setEditorContent(content)
      onChange(content)
    }
  }

  // Execute command on the editor
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleEditorChange()
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  // Insert HTML at cursor position
  const insertHTML = (html: string) => {
    document.execCommand("insertHTML", false, html)
    handleEditorChange()
  }

  // Handle toolbar button clicks
  const handleFormat = (format: string) => {
    execCommand(format)
  }

  const handleHeading = (level: string) => {
    execCommand("formatBlock", level)
  }

  const handleLink = () => {
    const url = prompt("Entrez l'URL du lien:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const handleImage = () => {
    const url = prompt("Entrez l'URL de l'image:")
    if (url) {
      insertHTML(`<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`)
    }
  }

  const handleAlignment = (alignment: string) => {
    execCommand("justify" + alignment)
  }

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      <Tabs defaultValue="edit" onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <div className="flex items-center justify-between border-b bg-muted/50 px-2">
          <TabsList className="h-10">
            <TabsTrigger value="edit">Éditer</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>

          {activeTab === "edit" && (
            <div className="flex flex-wrap items-center gap-1 py-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormat("bold")}
              >
                <Bold className="h-4 w-4" />
                <span className="sr-only">Gras</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormat("italic")}
              >
                <Italic className="h-4 w-4" />
                <span className="sr-only">Italique</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormat("underline")}
              >
                <Underline className="h-4 w-4" />
                <span className="sr-only">Souligné</span>
              </Button>
              <span className="mx-1 h-4 w-px bg-muted-foreground/20"></span>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleHeading("h1")}>
                <Heading1 className="h-4 w-4" />
                <span className="sr-only">Titre 1</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleHeading("h2")}>
                <Heading2 className="h-4 w-4" />
                <span className="sr-only">Titre 2</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleHeading("h3")}>
                <Heading3 className="h-4 w-4" />
                <span className="sr-only">Titre 3</span>
              </Button>
              <span className="mx-1 h-4 w-px bg-muted-foreground/20"></span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormat("insertUnorderedList")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">Liste à puces</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormat("insertOrderedList")}
              >
                <ListOrdered className="h-4 w-4" />
                <span className="sr-only">Liste numérotée</span>
              </Button>
              <span className="mx-1 h-4 w-px bg-muted-foreground/20"></span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleAlignment("Left")}
              >
                <AlignLeft className="h-4 w-4" />
                <span className="sr-only">Aligner à gauche</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleAlignment("Center")}
              >
                <AlignCenter className="h-4 w-4" />
                <span className="sr-only">Centrer</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleAlignment("Right")}
              >
                <AlignRight className="h-4 w-4" />
                <span className="sr-only">Aligner à droite</span>
              </Button>
              <span className="mx-1 h-4 w-px bg-muted-foreground/20"></span>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleLink}>
                <Link className="h-4 w-4" />
                <span className="sr-only">Lien</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleImage}>
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Image</span>
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="edit" className="p-0 m-0">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] p-4 focus:outline-none"
            onInput={handleEditorChange}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-0 m-0">
          <div
            className="prose prose-sm max-w-none p-4 min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
