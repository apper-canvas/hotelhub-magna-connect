import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  children, 
  className = "", 
  variant = "default",
  ...props 
}, ref) => {
  const baseStyles = "rounded-xl transition-all duration-200"
  
  const variants = {
    default: "bg-white shadow-soft hover:shadow-glow border border-slate-100",
    glass: "glass-effect shadow-soft hover:shadow-glow",
    gradient: "bg-gradient-to-br from-white to-slate-50 shadow-soft hover:shadow-glow border border-slate-100",
    elevated: "bg-white shadow-lg hover:shadow-xl border border-slate-100 transform hover:scale-[1.02]"
  }

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card