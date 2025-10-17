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
  const [showModal, setShowModal] = useState(false)
const [formData, setFormData] = useState({
    roomNumber: "",
    type: "",
    floor: "",
    rate: "",
    status: "Available",
    description: "",
    room_images: [""],
    thumbnail_image: "",
    bed_count: "",
    max_occupancy: "",
    room_size: "",
    view_type: ""
  })
  const [formErrors, setFormErrors] = useState({})
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

  const initializeRooms = async () => {
    try {
      setLoading(true)
      const data = await roomsService.getAll()
      setRooms(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load rooms")
    } finally {
      setLoading(false)
    }
  }

  const handleAddRoom = () => {
    setShowModal(true)
setFormData({
      roomNumber: "",
      type: "",
      floor: "",
      rate: "",
      status: "Available",
      description: "",
      room_images: [""],
      thumbnail_image: "",
      bed_count: "",
      max_occupancy: "",
      room_size: "",
      view_type: ""
    })
    setFormErrors({})
  }

  const handleCloseModal = () => {
    setShowModal(false)
setFormData({
      roomNumber: "",
      type: "",
      floor: "",
      rate: "",
      status: "Available",
      description: "",
      room_images: [""],
      thumbnail_image: "",
      bed_count: "",
      max_occupancy: "",
      room_size: "",
      view_type: ""
    })
    setFormErrors({})
  }

const validateForm = () => {
    const errors = {}
    if (!formData.roomNumber.trim()) {
      errors.roomNumber = "Room number is required"
    }
    if (!formData.type) {
      errors.type = "Room type is required"
    }
    if (!formData.floor || formData.floor < 1) {
      errors.floor = "Valid floor number is required"
    }
    if (!formData.rate || formData.rate < 1) {
      errors.rate = "Valid rate is required"
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }
    if (!formData.thumbnail_image.trim()) {
      errors.thumbnail_image = "Thumbnail image is required"
    }
    if (!formData.bed_count || formData.bed_count < 1) {
      errors.bed_count = "Valid bed count is required"
    }
    if (!formData.max_occupancy || formData.max_occupancy < 1) {
      errors.max_occupancy = "Valid max occupancy is required"
    }
    if (!formData.room_size || formData.room_size < 1) {
      errors.room_size = "Valid room size is required"
    }
    if (!formData.view_type) {
      errors.view_type = "View type is required"
    }

    // Validate room_images - at least one non-empty URL required
    const validImages = formData.room_images.filter(img => img.trim())
    if (validImages.length === 0) {
      errors.room_images = "At least one room image is required"
    }

    // Check for duplicate room number
    const isDuplicate = rooms.some(
      room => room.roomNumber.toLowerCase() === formData.roomNumber.trim().toLowerCase()
    )
    if (isDuplicate) {
      errors.roomNumber = "Room number already exists"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix form errors")
      return
    }

    try {
const newRoom = {
        roomNumber: formData.roomNumber.trim(),
        type: formData.type,
        floor: parseInt(formData.floor),
        rate: parseFloat(formData.rate),
        status: formData.status,
        description: formData.description.trim(),
        room_images: formData.room_images.filter(img => img.trim()),
        thumbnail_image: formData.thumbnail_image.trim(),
        bed_count: parseInt(formData.bed_count),
        max_occupancy: parseInt(formData.max_occupancy),
        room_size: parseInt(formData.room_size),
        view_type: formData.view_type,
        amenities: []
      }

      const createdRoom = await roomsService.create(newRoom)
      setRooms(prev => [...prev, createdRoom])
      toast.success(`Room ${createdRoom.roomNumber} created successfully`)
      handleCloseModal()
    } catch (err) {
      toast.error("Failed to create room")
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
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
<Button variant="primary" className="sm:w-auto w-full" onClick={handleAddRoom}>
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
          onAction={filter === "All" ? handleAddRoom : () => setFilter("All")}
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
{/* Create Room Modal */}
{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Add New Room</h2>
              <button
                onClick={handleCloseModal}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
<form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pl-2 pr-2">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Room Number *
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange("roomNumber", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.roomNumber ? "border-red-500" : "border-secondary-300"
                  }`}
                  placeholder="e.g., 101"
                />
                {formErrors.roomNumber && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Room Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.type ? "border-red-500" : "border-secondary-300"
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
                {formErrors.type && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.description ? "border-red-500" : "border-secondary-300"
                  }`}
                  placeholder="Detailed description of the room"
                  rows="3"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Room Images *
                </label>
                {formData.room_images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.room_images]
                        newImages[index] = e.target.value
                        setFormData(prev => ({ ...prev, room_images: newImages }))
                      }}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        formErrors.room_images ? "border-red-500" : "border-secondary-300"
                      }`}
                      placeholder="Image URL or path"
                    />
                    {formData.room_images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.room_images.filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, room_images: newImages }))
                        }}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, room_images: [...prev.room_images, ""] }))
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  + Add Another Image
                </button>
                {formErrors.room_images && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.room_images}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Thumbnail Image *
                </label>
                <input
                  type="text"
                  value={formData.thumbnail_image}
                  onChange={(e) => handleInputChange("thumbnail_image", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.thumbnail_image ? "border-red-500" : "border-secondary-300"
                  }`}
                  placeholder="Thumbnail image URL or path"
                />
                {formErrors.thumbnail_image && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.thumbnail_image}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Bed Count *
                  </label>
                  <input
                    type="number"
                    value={formData.bed_count}
                    onChange={(e) => handleInputChange("bed_count", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.bed_count ? "border-red-500" : "border-secondary-300"
                    }`}
                    placeholder="e.g., 2"
                    min="1"
                  />
                  {formErrors.bed_count && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.bed_count}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Max Occupancy *
                  </label>
                  <input
                    type="number"
                    value={formData.max_occupancy}
                    onChange={(e) => handleInputChange("max_occupancy", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.max_occupancy ? "border-red-500" : "border-secondary-300"
                    }`}
                    placeholder="e.g., 4"
                    min="1"
                  />
                  {formErrors.max_occupancy && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.max_occupancy}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Room Size (sq ft) *
                </label>
                <input
                  type="number"
                  value={formData.room_size}
                  onChange={(e) => handleInputChange("room_size", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.room_size ? "border-red-500" : "border-secondary-300"
                  }`}
                  placeholder="e.g., 350"
                  min="1"
                />
                {formErrors.room_size && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.room_size}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  View Type *
                </label>
                <select
                  value={formData.view_type}
                  onChange={(e) => handleInputChange("view_type", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.view_type ? "border-red-500" : "border-secondary-300"
                  }`}
                >
                  <option value="">Select view type</option>
                  <option value="Ocean View">Ocean View</option>
                  <option value="City View">City View</option>
                  <option value="Garden View">Garden View</option>
                  <option value="Mountain View">Mountain View</option>
                  <option value="No View">No View</option>
                </select>
                {formErrors.view_type && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.view_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Floor *
                </label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleInputChange("floor", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.floor ? "border-red-500" : "border-secondary-300"
                  }`}
                  placeholder="e.g., 1"
                  min="1"
                />
                {formErrors.floor && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.floor}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Rate Per Night *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-secondary-500">$</span>
                  <input
                    type="number"
                    value={formData.rate}
                    onChange={(e) => handleInputChange("rate", e.target.value)}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.rate ? "border-red-500" : "border-secondary-300"
                    }`}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                  />
                </div>
                {formErrors.rate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.rate}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Create Room
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Rooms