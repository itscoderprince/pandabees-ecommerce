"use client"

import * as React from "react"
import {
  Settings,
  User,
  Search,
  LayoutDashboard,
  ExternalLink,
  Box,
  Layers,
  ShoppingCart,
  Users,
  Image,
  TicketPercent,
  MessageSquare,
  BarChart3,
  Home,
  LogOut,
  Files,
} from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { ADMIN_ROUTES } from "@/routes/Admin.Route"
import { WEBSITE_ROUTES } from "@/routes/Website.Route"
import { useRouter } from "next/navigation"

// Map route keys to specific icons
const routeIconMap = {
  DASHBOARD: LayoutDashboard,
  PRODUCTS: Box,
  CATEGORIES: Layers,
  ORDERS: ShoppingCart,
  CUSTOMERS: Users,
  BANNERS: Files,
  MEIDA: Image, // Handling the typo in original route file
  MEDIA: Image,
  COUPONS: TicketPercent,
  FAQS: MessageSquare,
  SETTINGS: Settings,
  ANALYTICS: BarChart3,
}

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full max-w-[260px] px-3 h-10 rounded-xl border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all text-sm group shadow-sm"
      >
        <Search className="h-4 w-4 group-hover:text-violet-500 transition-colors" />
        <span className="flex-1 text-left font-medium">Search commands...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded-md border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex shadow-xs">
          <span className="text-xs">⌘</span>J
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-none border-none shadow-none bg-transparent p-1.5">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className="max-h-[300px] custom-scrollbar overflow-x-hidden">
            <CommandEmpty className="py-6 text-center text-sm font-medium text-muted-foreground">No results found.</CommandEmpty>

            <CommandGroup heading="Admin Routes" className="px-2 font-semibold">
              {Object.entries(ADMIN_ROUTES).map(([key, value]) => {
                const Icon = routeIconMap[key] || LayoutDashboard
                return (
                  <CommandItem
                    key={value}
                    onSelect={() => runCommand(() => router.push(value))}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize text-sm">{key.toLowerCase().replace(/_/g, ' ')}</span>
                    <CommandShortcut className="text-[10px] font-mono tracking-tighter opacity-50">{value}</CommandShortcut>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            <CommandSeparator className="my-1" />

            <CommandGroup heading="Quick Links" className="px-2 font-semibold">
              <CommandItem onSelect={() => runCommand(() => router.push(WEBSITE_ROUTES.HOME))} className="flex items-center gap-2 px-2 py-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Go to Website</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push(ADMIN_ROUTES.SETTINGS))} className="flex items-center gap-2 px-2 py-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">General Settings</span>
              </CommandItem>
              <CommandItem className="flex items-center gap-2 px-2 py-2 text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout Admin</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
