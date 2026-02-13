"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function RootPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Redirection immédiate vers /auth/login
    router.push("/auth/login")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
