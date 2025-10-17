import React from "react"

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {/* Header skeleton */}
      <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg w-1/3"></div>
      
      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-effect rounded-xl p-6 space-y-4">
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-2/3"></div>
            <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-full"></div>
              <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-4/5"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg w-full"></div>
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="glass-effect rounded-xl p-6 space-y-4">
        <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading