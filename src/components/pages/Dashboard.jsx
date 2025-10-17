import React, { useState, useEffect } from "react"
import StatsCard from "@/components/molecules/StatsCard"
import RoomGrid from "@/components/organisms/RoomGrid"
import TaskItem from "@/components/molecules/TaskItem"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import roomsService from "@/services/api/roomsService"
import tasksService from "@/services/api/tasksService"
import bookingsService from "@/services/api/bookingsService"
import analyticsService from "@/services/api/analyticsService"

const Dashboard = () => {
  const [rooms, setRooms] = useState([])
  const [tasks, setTasks] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [roomsData, tasksData, bookingsData] = await Promise.all([
        roomsService.getAll(),
        tasksService.getAll(),
        bookingsService.getAll()
      ])
      
      setRooms(roomsData)
      setTasks(tasksData.filter(task => task.status !== "Completed").slice(0, 5))
      setBookings(bookingsData)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleCompleteTask = async (task) => {
    try {
      await tasksService.update(task.Id, { ...task, status: "Completed", completedAt: new Date().toISOString() })
      setTasks(tasks.filter(t => t.Id !== task.Id))
    } catch (err) {
      setError("Failed to complete task")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const availableRooms = rooms.filter(room => room.status === "Available").length
  const occupiedRooms = rooms.filter(room => room.status === "Occupied").length
  const maintenanceRooms = rooms.filter(room => room.status === "Maintenance").length
  const todayBookings = bookings.filter(booking => {
    const today = new Date().toDateString()
    return new Date(booking.checkIn).toDateString() === today
  }).length

  return (
<div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Available Rooms"
          value={availableRooms}
          icon="CheckCircle2"
          color="success"
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Occupied Rooms"
          value={occupiedRooms}
          icon="User"
          color="primary"
          trend="up"
          trendValue="+8%"
        />
        <StatsCard
          title="Daily Revenue"
          value={`$${Math.round(bookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + (b.totalAmount / 5) : sum, 0))}`}
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+23%"
        />
        <StatsCard
          title="Today's Check-ins"
          value={todayBookings}
          icon="Calendar"
          color="info"
          trend="up"
          trendValue="+15%"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Room Status Overview */}
        <div className="xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Room Status Overview</h2>
            <p className="text-slate-600">Real-time status of all hotel rooms</p>
          </div>
          
          {rooms.length === 0 ? (
            <Empty
              title="No rooms found"
              description="Get started by adding rooms to your hotel"
              icon="Home"
              actionLabel="Add Room"
              onAction={() => {}}
            />
          ) : (
            <RoomGrid 
              rooms={rooms.slice(0, 8)} 
              onRoomClick={(room) => console.log("Room clicked:", room)}
            />
          )}
        </div>

        {/* Urgent Tasks */}
        <div>
          <Card variant="gradient" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Urgent Tasks</h3>
                <p className="text-sm text-slate-600">Pending housekeeping & maintenance</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-400 text-white">
                <ApperIcon name="AlertTriangle" size={20} />
              </div>
            </div>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle2" size={48} className="mx-auto text-emerald-500 mb-4" />
                  <p className="text-slate-600">All tasks completed!</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onView={() => {}}
                  />
                ))
              )}
            </div>

            {tasks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <button className="w-full text-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  View All Tasks ({tasks.length})
                </button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated" className="p-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary-50 to-primary-25 text-primary-700 hover:from-primary-100 hover:to-primary-50 transition-all duration-200">
                <ApperIcon name="UserPlus" size={18} />
                <span className="font-semibold">Check-in Guest</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-25 text-emerald-700 hover:from-emerald-100 hover:to-emerald-50 transition-all duration-200">
                <ApperIcon name="UserMinus" size={18} />
                <span className="font-semibold">Check-out Guest</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-amber-25 text-amber-700 hover:from-amber-100 hover:to-amber-50 transition-all duration-200">
                <ApperIcon name="Wrench" size={18} />
                <span className="font-semibold">Report Issue</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard