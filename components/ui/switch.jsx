"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

import { Sun, Moon } from "lucide-react"

function Switch({

  className,
  size = "default",
  ...props
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9 data-checked:bg-primary data-unchecked:bg-zinc-300 dark:data-unchecked:bg-zinc-700",
        className
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none sticky flex items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-all duration-300 group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4 group-data-[size=default]/switch:data-checked:translate-x-5 group-data-[size=default]/switch:data-unchecked:translate-x-0.5 group-data-[size=sm]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-unchecked:translate-x-0.5"
        )}>
        {/* Sun Icon: Visible and upright in light mode, hidden and rotated in dark mode */}
        <Sun className="h-3 w-3 text-amber-500 transition-all duration-300 rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0 absolute" />
        
        {/* Moon Icon: Hidden and rotated in light mode, visible and upright in dark mode */}
        <Moon className="h-3 w-3 text-slate-900 transition-all duration-300 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100 absolute" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}



export { Switch }
