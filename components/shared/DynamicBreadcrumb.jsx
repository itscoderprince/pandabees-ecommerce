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

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Split the path into segments and filter out any empty strings
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Always show a "Home" or initial segment if needed, e.g. "Admin Panel" */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/admin">
                Admin Panel
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          // Calculate the full path for this segment's link
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          
          // Don't repeat "admin" if it's already shown as "Admin Panel"
          if (segment.toLowerCase() === "admin") return null;

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                      {segment.replace(/-/g, ' ')}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="capitalize">
                    <Link href={href}>
                      {segment.replace(/-/g, ' ')}
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
