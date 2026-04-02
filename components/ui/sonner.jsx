"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-full group-[.toaster]:px-4 group-[.toaster]:py-2 group-[.toaster]:font-medium",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:text-green-600",
          error: "group-[.toaster]:text-red-600",
          warning: "group-[.toaster]:text-yellow-600",
          info: "group-[.toaster]:text-blue-600",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-500" />,
        error: <OctagonXIcon className="size-5 text-red-500" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-500" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        loading: <Loader2Icon className="size-5 animate-spin text-muted-foreground" />,
      }}
      {...props} />
  );
}

export { Toaster }
