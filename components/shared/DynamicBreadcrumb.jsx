"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { 
  Home, 
  LayoutDashboard, 
  Box, 
  Layers, 
  ShoppingCart, 
  Users, 
  Image, 
  TicketPercent, 
  MessageSquare, 
  Settings, 
  BarChart3,
  ChevronRight,
  FolderOpen
} from "lucide-react"

// Map segment strings to icons
const iconMap = {
  admin: LayoutDashboard,
  dashboard: LayoutDashboard,
  products: Box,
  categories: Layers,
  orders: ShoppingCart,
  customers: Users,
  media: Image,
  banners: FolderOpen,
  coupons: TicketPercent,
  faqs: MessageSquare,
  settings: Settings,
  analytics: BarChart3,
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Split path into segments and remove empty ones
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb className="transition-all duration-300">
      <BreadcrumbList className="flex items-center gap-1 sm:gap-2">
        {/* Simplified Admin Panel segment with Icon */}
        <BreadcrumbItem className="flex items-center">
          <BreadcrumbLink asChild className="flex items-center gap-1.5 hover:text-violet-600 transition-colors">
            <Link href="/admin/dashboard" className="flex items-center gap-1.5 font-semibold">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs mt-0.5">Admin</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          if (segment.toLowerCase() === "admin") return null;

          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const IconComponent = iconMap[segment.toLowerCase()] || FolderOpen
          
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator className="opacity-40">
                 <ChevronRight className="h-3.5 w-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="flex items-center">
                {isLast ? (
                  <BreadcrumbPage className="capitalize flex items-center gap-1.5 font-bold text-violet-600 animate-in fade-in zoom-in-95 duration-300">
                      <IconComponent className="h-3.5 w-3.5" />
                      <span className="text-xs mt-0.5">{segment.replace(/-/g, ' ')}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="capitalize flex items-center gap-1.5 hover:text-violet-600 transition-colors">
                    <Link href={href} className="flex items-center gap-1.5">
                      <IconComponent className="h-3.5 w-3.5" />
                      <span className="text-xs mt-0.5">{segment.replace(/-/g, ' ')}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
