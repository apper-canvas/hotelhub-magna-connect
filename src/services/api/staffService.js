import staffData from "@/services/mockData/staff.json"

const staffService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...staffData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const member = staffData.find(member => member.Id === id)
    if (!member) {
      throw new Error(`Staff member with ID ${id} not found`)
    }
    return { ...member }
  },

  async create(memberData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...staffData.map(member => member.Id)) + 1
    const newMember = { ...memberData, Id: newId }
    staffData.push(newMember)
    return { ...newMember }
  },

  async update(id, memberData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = staffData.findIndex(member => member.Id === id)
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`)
    }
    staffData[index] = { ...memberData, Id: id }
    return { ...staffData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = staffData.findIndex(member => member.Id === id)
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`)
    }
    staffData.splice(index, 1)
    return true
  }
}

export default staffService