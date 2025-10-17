import React from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const RoomStatusCard = ({ room, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Available": return "CheckCircle2"
      case "Occupied": return "User"
      case "Maintenance": return "Wrench"
      case "Clean": return "Sparkles"
      case "Dirty": return "AlertCircle"
      default: return "Home"
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Available": return "available"
      case "Occupied": return "occupied"
      case "Maintenance": return "maintenance"
      case "Clean": return "clean"
      case "Dirty": return "dirty"
      default: return "default"
    }
  }

  return (
    <Card 
      variant="elevated" 
      className="p-4 cursor-pointer hover:shadow-glow transition-all duration-300"
      onClick={() => onClick(room)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Room {room.number}</h3>
          <p className="text-sm text-slate-600 capitalize">{room.type}</p>
        </div>
        <Badge variant={getStatusVariant(room.status)} className="flex items-center gap-1">
          <ApperIcon name={getStatusIcon(room.status)} size={12} />
          {room.status}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <ApperIcon name="Users" size={16} />
          <span>Capacity: {room.capacity}</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="DollarSign" size={16} />
          <span className="font-semibold text-slate-900">${room.pricePerNight}/night</span>
        </div>
      </div>

      {room.amenities && room.amenities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="default" size="sm">
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="default" size="sm">
                +{room.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default RoomStatusCard