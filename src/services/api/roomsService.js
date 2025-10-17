import roomsData from "@/services/mockData/rooms.json"

const roomsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...roomsData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const room = roomsData.find(room => room.Id === id)
    if (!room) {
      throw new Error(`Room with ID ${id} not found`)
    }
    return { ...room }
  },

async create(roomData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...roomsData.map(room => room.Id)) + 1
    const newRoom = {
      Id: newId,
      roomNumber: roomData.roomNumber,
      type: roomData.type,
      floor: roomData.floor,
      rate: roomData.rate,
      status: roomData.status,
      description: roomData.description,
      room_images: roomData.room_images,
      thumbnail_image: roomData.thumbnail_image,
      bed_count: roomData.bed_count,
      max_occupancy: roomData.max_occupancy,
      room_size: roomData.room_size,
      view_type: roomData.view_type,
      amenities: roomData.amenities || []
    }
    roomsData.push(newRoom)
    return { ...newRoom }
  },

  async update(id, roomData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = roomsData.findIndex(room => room.Id === id)
    if (index === -1) {
      throw new Error(`Room with ID ${id} not found`)
    }
    roomsData[index] = { ...roomData, Id: id }
    return { ...roomsData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = roomsData.findIndex(room => room.Id === id)
    if (index === -1) {
      throw new Error(`Room with ID ${id} not found`)
    }
    roomsData.splice(index, 1)
    return true
  }
}

export default roomsService