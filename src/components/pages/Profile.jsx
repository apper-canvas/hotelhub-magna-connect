import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import profileService from "@/services/api/profileService"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({})

  const roleColors = {
    ADMIN: "success",
    MANAGER: "primary", 
    RECEPTION: "info",
    STAFF: "warning",
    GUEST: "default"
  }

  const loadProfile = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await profileService.getCurrentProfile()
      setProfile(data)
      setFormData(data)
    } catch (err) {
      setError(`Failed to load profile: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const updatedProfile = await profileService.update(profile.Id, formData)
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (err) {
      toast.error(`Failed to update profile: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }


  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProfile} />

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your personal information and account settings</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              <ApperIcon name="Edit2" size={18} />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center">
              <div className="mb-6">
                <Avatar
                  src={profile.avatar}
                  name={`${profile.firstName} ${profile.lastName}`}
                  size="xl"
                  className="mx-auto mb-4"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <Badge variant={roleColors[profile.role]} size="lg">
                    {profile.role}
                  </Badge>
                  {profile.department && (
                    <p className="text-slate-600">{profile.department}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <ApperIcon name="Mail" size={16} className="text-slate-500" />
                  <span className="text-slate-700">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ApperIcon name="Phone" size={16} className="text-slate-500" />
                  <span className="text-slate-700">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ApperIcon name="Calendar" size={16} className="text-slate-500" />
                  <span className="text-slate-700">
                    Joined {new Date(profile.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ApperIcon name="CheckCircle2" size={16} className="text-emerald-500" />
                  <span className="text-slate-700">Status: {profile.status}</span>
                </div>
              </div>

            </div>
          </Card>

</div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <ApperIcon name="User" size={20} />
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <Input
                  value={formData.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <Input
                  value={formData.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>

              {profile.role !== "GUEST" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <Input
                    value={formData.department || ""}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter department"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <div className="flex items-center h-10">
                  <Badge variant={roleColors[profile.role]} size="lg">
                    {profile.role}
                  </Badge>
                  <span className="text-xs text-slate-500 ml-2">Contact admin to change role</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <ApperIcon name="MapPin" size={20} />
              Contact Information
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <Input
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Contact
                </label>
                <Input
                  value={formData.emergencyContact || ""}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Name and phone number"
                />
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default Profile