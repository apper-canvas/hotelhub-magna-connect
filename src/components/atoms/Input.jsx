import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className = "", 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400"
  
  const errorStyles = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""

  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input