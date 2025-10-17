import React from "react"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const TaskItem = ({ task, onComplete, onView }) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High": return "danger"
      case "Medium": return "warning"
      case "Low": return "success"
      default: return "default"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "Cleaning": return "Sparkles"
      case "Maintenance": return "Wrench"
      case "Inspection": return "CheckSquare"
      default: return "AlertCircle"
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-50">
          <ApperIcon name={getTypeIcon(task.type)} size={20} className="text-slate-600" />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900">Room {task.roomNumber}</h4>
            <Badge variant={getPriorityVariant(task.priority)} size="sm">
              {task.priority}
            </Badge>
          </div>
          <p className="text-sm text-slate-600">{task.type}</p>
          {task.assignedTo && (
            <p className="text-xs text-slate-500">Assigned to: {task.assignedTo}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onView(task)}
        >
          <ApperIcon name="Eye" size={16} />
        </Button>
        {task.status !== "Completed" && (
          <Button 
            variant="success" 
            size="sm"
            onClick={() => onComplete(task)}
          >
            <ApperIcon name="Check" size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default TaskItem