import profilesData from "@/services/mockData/profiles.json"

const profileService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...profilesData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const profile = profilesData.find(profile => profile.Id === id)
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`)
    }
    return { ...profile }
  },

  async getCurrentProfile() {
    // Mock current user - in real app would get from auth context
    await new Promise(resolve => setTimeout(resolve, 200))
    return { ...profilesData[0] } // Return admin user as current user
  },

  async getByRole(role) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return profilesData.filter(profile => profile.role === role).map(profile => ({ ...profile }))
  },

  async create(profileData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...profilesData.map(profile => profile.Id)) + 1
    const newProfile = { 
      ...profileData, 
      Id: newId,
      joinDate: new Date().toISOString(),
      status: "Active",
      permissions: this._getPermissionsByRole(profileData.role)
    }
    profilesData.push(newProfile)
    return { ...newProfile }
  },

  async update(id, profileData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = profilesData.findIndex(profile => profile.Id === id)
    if (index === -1) {
      throw new Error(`Profile with ID ${id} not found`)
    }
    
    // Update permissions if role changed
    const updatedData = { ...profileData }
    if (updatedData.role) {
      updatedData.permissions = this._getPermissionsByRole(updatedData.role)
    }
    
    profilesData[index] = { ...profilesData[index], ...updatedData, Id: id }
    return { ...profilesData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = profilesData.findIndex(profile => profile.Id === id)
    if (index === -1) {
      throw new Error(`Profile with ID ${id} not found`)
    }
    profilesData.splice(index, 1)
    return true
  },

  async updatePassword(id, oldPassword, newPassword) {
    await new Promise(resolve => setTimeout(resolve, 400))
    // Mock password update - in real app would validate old password
    const profile = profilesData.find(p => p.Id === id)
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`)
    }
    // In real app, would hash and store password
    return true
  },

  _getPermissionsByRole(role) {
    const rolePermissions = {
      ADMIN: ["manage_users", "manage_bookings", "manage_rooms", "view_reports", "manage_billing", "system_admin"],
      MANAGER: ["manage_bookings", "manage_rooms", "view_reports", "manage_staff"],
      RECEPTION: ["manage_bookings", "view_guests", "basic_reports"],
      STAFF: ["view_tasks", "update_room_status", "update_maintenance_status"],
      GUEST: ["view_bookings", "manage_profile"]
    }
    return rolePermissions[role] || []
  },

  getRoleHierarchy() {
    return ["GUEST", "STAFF", "RECEPTION", "MANAGER", "ADMIN"]
  },

  getRolePermissions(role) {
    return this._getPermissionsByRole(role)
  }
}

export default profileService