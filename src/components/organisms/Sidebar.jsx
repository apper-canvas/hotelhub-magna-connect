import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ className = "" }) => {
  const location = useLocation()

const menuItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/rooms", icon: "Home", label: "Rooms" },
    { to: "/guests", icon: "Users", label: "Guests" },
    { to: "/bookings", icon: "Calendar", label: "Bookings" },
    { to: "/staff", icon: "UserCheck", label: "Staff" },
    { to: "/reports", icon: "BarChart3", label: "Reports" },
    { to: "/profile", icon: "User", label: "Profile" }
  ]

  return (
    <div className={cn("bg-white border-r border-slate-200 h-full", className)}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg">
            <ApperIcon name="Building2" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">HotelHub Pro</h1>
            <p className="text-sm text-slate-600">Management System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg" 
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary-600"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  size={20}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-primary-600"
                  )}
                />
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Globe" size={16} className="text-primary-600" />
            <span className="text-sm font-semibold text-slate-700">Guest Portal</span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Access the public booking system
          </p>
          <a
            href="/guest-booking"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-500 transition-all duration-200 w-full justify-center"
          >
            <ApperIcon name="ExternalLink" size={14} />
            View Portal
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sidebar