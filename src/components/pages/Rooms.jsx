import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import RoomGrid from "@/components/organisms/RoomGrid"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import roomsService from "@/services/api/roomsService"

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("All")
  const [selectedRoom, setSelectedRoom] = useState(null)

  const loadRooms = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await roomsService.getAll()
      setRooms(data)
    } catch (err) {
      setError("Failed to load rooms")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const room = rooms.find(r => r.Id === roomId)
      await roomsService.update(roomId, { ...room, status: newStatus })
      setRooms(rooms.map(r => r.Id === roomId ? { ...r, status: newStatus } : r))
      toast.success(`Room ${room.number} status updated to ${newStatus}`)
    } catch (err) {
      toast.error("Failed to update room status")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadRooms} />

  const filteredRooms = filter === "All" ? rooms : rooms.filter(room => room.status === filter)
  const statusCounts = {
    All: rooms.length,
    Available: rooms.filter(r => r.status === "Available").length,
    Occupied: rooms.filter(r => r.status === "Occupied").length,
    Maintenance: rooms.filter(r => r.status === "Maintenance").length,
    Clean: rooms.filter(r => r.status === "Clean").length,
    Dirty: rooms.filter(r => r.status === "Dirty").length
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Room Management</h1>
          <p className="text-slate-600">Monitor and manage all hotel rooms</p>
        </div>
        <Button variant="primary" className="sm:w-auto w-full">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add New Room
        </Button>
      </div>

      {/* Status Filter */}
      <Card variant="gradient" className="p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Filter by Status</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                filter === status
                  ? "bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <span className="font-semibold">{status}</span>
              <Badge variant="default" size="sm" className={filter === status ? "bg-white/20 text-white" : ""}>
                {count}
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <Empty
          title="No rooms found"
          description={filter === "All" ? "Get started by adding rooms to your hotel" : `No rooms with status: ${filter}`}
          icon="Home"
          actionLabel={filter === "All" ? "Add Room" : "Clear Filter"}
          onAction={filter === "All" ? () => {} : () => setFilter("All")}
        />
      ) : (
        <RoomGrid 
          rooms={filteredRooms} 
          onRoomClick={setSelectedRoom}
        />
      )}

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Room {selectedRoom.number}</h2>
                  <p className="text-slate-600 capitalize">{selectedRoom.type}</p>
                </div>
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current Status
                    </label>
                    <select
                      value={selectedRoom.status}
                      onChange={(e) => handleStatusChange(selectedRoom.Id, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Clean">Clean</option>
                      <option value="Dirty">Dirty</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Price per Night
                    </label>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="DollarSign" size={18} className="text-slate-600" />
                      <span className="text-lg font-bold text-slate-900">{selectedRoom.pricePerNight}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities && selectedRoom.amenities.map((amenity, index) => (
                      <Badge key={index} variant="default">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    <ApperIcon name="Edit" size={18} className="mr-2" />
                    Edit Room
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ApperIcon name="Eye" size={18} className="mr-2" />
                    View History
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Rooms