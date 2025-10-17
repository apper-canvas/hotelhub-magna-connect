import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-red-600">
        <ApperIcon name="AlertTriangle" size={48} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-slate-600 mb-8 max-w-md">
        {message}. Please try again or contact support if the problem persists.
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
        >
          <ApperIcon name="RefreshCw" size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error