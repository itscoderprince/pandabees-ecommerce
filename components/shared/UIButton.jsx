"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Premium UIButton component with built-in loading states and consistent styling.
 * Supports a custom 'violet' theme as requested.
 * @param {string} className - Additional CSS classes
 * @param {boolean} loading - Displays a spinner and disables the button
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - Shadcn button variants (default, outline, ghost, etc.)
 */
const UIButton = ({ 
  className, 
  loading = false, 
  children, 
  variant = "default", 
  ...props 
}) => {
  return (
    <Button
      className={cn(
        "relative transition-all active:scale-[0.98] font-medium rounded-xl h-11",
        // Default Violet Theme for primary buttons
        variant === "default" && "bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg focus:ring-violet-500",
        loading && "text-transparent pointer-events-none",
        className
      )}
      variant={variant}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )}
      <span className={cn(loading ? "opacity-0" : "opacity-100")}>
        {children}
      </span>
    </Button>
  );
};

export default UIButton;