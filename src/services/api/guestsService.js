import guestsData from "@/services/mockData/guests.json"

const guestsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...guestsData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const guest = guestsData.find(guest => guest.Id === id)
    if (!guest) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    return { ...guest }
  },

async create(guestData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...guestsData.map(guest => guest.Id)) + 1
    const newGuest = { 
      ...guestData, 
      Id: newId,
      preferences: {},
      vipStatus: false,
      stayHistory: []
    }
    guestsData.push(newGuest)

    // Send welcome email asynchronously (non-blocking)
    this.sendWelcomeEmail(newGuest).catch(error => {
      console.info(`apper_info: Welcome email failed for guest ${newGuest.Id}. Error: ${error.message}`)
    })

    return { ...newGuest }
  },

  async sendWelcomeEmail(guestData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const result = await apperClient.functions.invoke(import.meta.env.VITE_SEND_WELCOME_EMAIL, {
body: JSON.stringify({
          firstName: guestData.firstName,
          lastName: guestData.lastName,
          email: guestData.email
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!result.success) {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_SEND_WELCOME_EMAIL}. The response body is: ${JSON.stringify(result)}.`)
      }

      return result
    } catch (error) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_SEND_WELCOME_EMAIL}. The error is: ${error.message}`)
      throw error
    }
  },

  async update(id, guestData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = guestsData.findIndex(guest => guest.Id === id)
    if (index === -1) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    guestsData[index] = { ...guestData, Id: id }
    return { ...guestsData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = guestsData.findIndex(guest => guest.Id === id)
    if (index === -1) {
      throw new Error(`Guest with ID ${id} not found`)
    }
    guestsData.splice(index, 1)
    return true
  }
}

export default guestsService