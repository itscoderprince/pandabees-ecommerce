"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { CheckCircle2, XCircle, Info, AlertTriangle, Loader2 } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
        }
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-background text-foreground border-border border shadow-lg !rounded-full px-5 py-2 gap-3.5 font-sans text-[16px] font-semibold leading-snug !w-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        success: <CheckCircle2 strokeWidth={2} className="w-5 h-5 text-white fill-emerald-600" />,
        error: <XCircle strokeWidth={2} className="w-5 h-5 text-white fill-red-600" />,
        info: <Info strokeWidth={2} className="w-5 h-5 text-white fill-blue-600" />,
        warning: <AlertTriangle strokeWidth={2} className="w-5 h-5 text-white fill-amber-600" />,
        loading: <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />,
      }}
      {...props} />
  );
}

export { Toaster }
