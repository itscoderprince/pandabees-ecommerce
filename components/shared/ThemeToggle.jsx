"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-6 w-11" /> // Placeholder to avoid layout shift
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={isDark} 
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
    </div>
  )
}
