"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getStoredUser } from "@/utils/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = getStoredUser()

    if (!user) {
      router.replace("/login")
      return
    }

    router.replace("/dashboard")
  }, [router])

  return null
}