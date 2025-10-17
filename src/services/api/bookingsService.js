import bookingsData from "@/services/mockData/bookings.json"

const bookingsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...bookingsData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const booking = bookingsData.find(booking => booking.Id === id)
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`)
    }
    return { ...booking }
  },

async create(bookingData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...bookingsData.map(booking => booking.Id)) + 1
    const newBooking = { 
      ...bookingData, 
      Id: newId,
      createdAt: bookingData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    bookingsData.push(newBooking)
    return { ...newBooking }
  },

async update(id, bookingData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = bookingsData.findIndex(booking => booking.Id === id)
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`)
    }
    bookingsData[index] = { 
      ...bookingData, 
      Id: id,
      updatedAt: new Date().toISOString()
    }
    return { ...bookingsData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = bookingsData.findIndex(booking => booking.Id === id)
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`)
    }
    bookingsData.splice(index, 1)
    return true
  }
}

export default bookingsService