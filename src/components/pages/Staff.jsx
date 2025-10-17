import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import TaskItem from "@/components/molecules/TaskItem"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import staffService from "@/services/api/staffService"
import tasksService from "@/services/api/tasksService"

const Staff = () => {
  const [staff, setStaff] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [activeTab, setActiveTab] = useState("staff")

  const loadData = async () => {
    try {
      setError("")
      setLoading(true)
      const [staffData, tasksData] = await Promise.all([
        staffService.getAll(),
        tasksService.getAll()
      ])
      setStaff(staffData)
      setTasks(tasksData)
    } catch (err) {
      setError("Failed to load staff data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCompleteTask = async (task) => {
    try {
      await tasksService.update(task.Id, { 
        ...task, 
        status: "Completed", 
        completedAt: new Date().toISOString() 
      })
      setTasks(tasks.map(t => t.Id === task.Id ? { ...t, status: "Completed", completedAt: new Date().toISOString() } : t))
      toast.success("Task marked as completed")
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const pendingTasks = tasks.filter(task => task.status !== "Completed")
  const completedTasks = tasks.filter(task => task.status === "Completed")

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Staff Management</h1>
          <p className="text-slate-600">Manage team members and assign tasks</p>
        </div>
        <Button variant="primary" className="sm:w-auto w-full">
          <ApperIcon name="UserPlus" size={18} className="mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === "staff"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          Staff Members ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === "tasks"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          Active Tasks ({pendingTasks.length})
        </button>
      </div>

      {activeTab === "staff" && (
        <div>
          {staff.length === 0 ? (
            <Empty
              title="No staff members found"
              description="Get started by adding your team members"
              icon="Users"
              actionLabel="Add Staff Member"
              onAction={() => {}}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {staff.map((member) => (
                <Card 
                  key={member.Id} 
                  variant="elevated" 
                  className="p-6 cursor-pointer hover:shadow-glow transition-all duration-300"
                  onClick={() => setSelectedStaff(member)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar 
                      fallback={member.name.split(' ').map(n => n[0]).join('')}
                      size="lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                          <p className="text-sm text-slate-600">{member.email}</p>
                        </div>
                        <Badge variant="primary" className="capitalize">
                          {member.role}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <ApperIcon name="Clock" size={14} />
                          <span>
                            {member.schedule ? `${member.schedule.length} shifts scheduled` : "No schedule"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <ApperIcon name="CheckSquare" size={14} />
                          <span>
                            {member.activeTasks ? `${member.activeTasks.length} active tasks` : "No active tasks"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Tasks ({pendingTasks.length})</h2>
            {pendingTasks.length === 0 ? (
              <Card variant="gradient" className="p-8 text-center">
                <ApperIcon name="CheckCircle2" size={48} className="mx-auto text-emerald-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">All tasks completed!</h3>
                <p className="text-slate-600">Great work! All pending tasks have been completed.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onView={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks Today */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Completed Tasks ({completedTasks.length})
              </h2>
              <div className="space-y-4">
                {completedTasks.slice(0, 5).map((task) => (
                  <div 
                    key={task.Id}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <ApperIcon name="CheckCircle2" size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Room {task.roomNumber}</h4>
                        <p className="text-sm text-slate-600">{task.type}</p>
                        {task.completedAt && (
                          <p className="text-xs text-emerald-600">
                            Completed: {new Date(task.completedAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <Avatar 
                    fallback={selectedStaff.name.split(' ').map(n => n[0]).join('')}
                    size="xl"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedStaff.name}</h2>
                    <p className="text-slate-600">{selectedStaff.email}</p>
                    <Badge variant="primary" className="mt-2 capitalize">
                      {selectedStaff.role}
                    </Badge>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Schedule</h3>
                  {selectedStaff.schedule && selectedStaff.schedule.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStaff.schedule.map((shift, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-semibold">{shift.day}</span>
                            <span className="text-slate-600">{shift.hours}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">No schedule assigned</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Active Tasks</h3>
                  {selectedStaff.activeTasks && selectedStaff.activeTasks.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStaff.activeTasks.map((task, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-semibold">Room {task.room}</span>
                            <Badge variant="warning" size="sm">{task.priority}</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{task.type}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">No active tasks</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="primary" className="flex-1">
                  <ApperIcon name="Edit" size={18} className="mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="flex-1">
                  <ApperIcon name="Calendar" size={18} className="mr-2" />
                  Manage Schedule
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Staff