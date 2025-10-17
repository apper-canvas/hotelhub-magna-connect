import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = "primary",
  className = "" 
}) => {
  const colorVariants = {
    primary: "from-primary-500 to-primary-400",
    success: "from-emerald-500 to-emerald-400",
    warning: "from-amber-500 to-amber-400",
    danger: "from-red-500 to-red-400",
    info: "from-blue-500 to-blue-400"
  }

  return (
    <Card variant="gradient" className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 mb-2">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16}
                className={trend === "up" ? "text-emerald-600" : "text-red-600"}
              />
              <span className={trend === "up" ? "text-emerald-600" : "text-red-600"}>
                {trendValue}
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-r text-white shadow-lg",
          colorVariants[color]
        )}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  )
}

export default StatsCard