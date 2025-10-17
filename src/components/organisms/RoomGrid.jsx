import React from "react"
import RoomStatusCard from "@/components/molecules/RoomStatusCard"

const RoomGrid = ({ rooms, onRoomClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {rooms.map((room) => (
        <RoomStatusCard 
          key={room.Id} 
          room={room} 
          onClick={onRoomClick}
        />
      ))}
    </div>
  )
}

export default RoomGrid