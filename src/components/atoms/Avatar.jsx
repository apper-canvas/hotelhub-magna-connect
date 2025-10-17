import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Avatar = forwardRef(({ 
  src,
  alt = "",
  fallback = "User",
  size = "md",
  className = "",
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl"
  }

  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("rounded-full object-cover ring-2 ring-white shadow-lg", sizes[size], className)}
        {...props}
      />
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-lg",
        sizes[size], 
        className
      )}
      {...props}
    >
      {fallback ? (
        fallback.charAt(0).toUpperCase()
      ) : (
        <ApperIcon name="User" className="w-1/2 h-1/2" />
      )}
    </div>
  )
})

Avatar.displayName = "Avatar"

export default Avatar