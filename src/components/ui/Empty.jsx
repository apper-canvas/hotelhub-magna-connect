import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item",
  icon = "Package",
  actionLabel,
  onAction,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400">
        <ApperIcon name={icon} size={64} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-8 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty