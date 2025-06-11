import type React from "react"
import Link from "next/link"
import { Building, FileText, Home } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Administration</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <Link
              href="/admin/residences"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Résidences</span>
            </Link>
            <Link
              href="/admin/articles"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Articles</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
