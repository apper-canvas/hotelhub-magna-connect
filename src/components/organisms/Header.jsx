import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Avatar from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} className="text-slate-600" />
          </button>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900">Good morning, Admin</h2>
            <p className="text-sm text-slate-600">Here's what's happening at your hotel today</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <ApperIcon name="Bell" size={20} className="text-slate-600" />
              <Badge variant="danger" size="sm" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Avatar fallback="A" size="md" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Admin User</p>
              <p className="text-xs text-slate-600">Hotel Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header