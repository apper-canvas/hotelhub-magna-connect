import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ 
  children, 
  className = "", 
  variant = "default", 
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors"
  
  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700",
    success: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700",
    warning: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700",
    danger: "bg-gradient-to-r from-red-100 to-red-50 text-red-700",
    info: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700",
    available: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700",
    occupied: "bg-gradient-to-r from-red-100 to-red-50 text-red-700",
    maintenance: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700",
    clean: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700",
    dirty: "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge