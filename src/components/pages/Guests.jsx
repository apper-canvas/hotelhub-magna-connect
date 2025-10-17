import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import GuestCard from "@/components/molecules/GuestCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import guestsService from "@/services/api/guestsService"

const Guests = () => {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
const [selectedGuest, setSelectedGuest] = useState(null)
  const [showModal, setShowModal] = useState(false)
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  })
  const loadGuests = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await guestsService.getAll()
      setGuests(data)
    } catch (err) {
      setError("Failed to load guests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadGuests} />

const filteredGuests = guests.filter(guest => 
    `${guest.firstName || ''} ${guest.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Guest Management</h1>
          <p className="text-slate-600">Manage guest profiles and preferences</p>
        </div>
<Button 
          variant="primary" 
          className="sm:w-auto w-full"
          onClick={() => setShowModal(true)}
        >
          <ApperIcon name="UserPlus" size={18} className="mr-2" />
          Add New Guest
        </Button>
      </div>

      {/* Search and Filters */}
      <Card variant="gradient" className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FormField
              placeholder="Search guests by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-0"
            >
              <div className="relative">
                <ApperIcon name="Search" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search guests by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400"
                />
              </div>
            </FormField>
          </div>
          <Button variant="outline">
            <ApperIcon name="Filter" size={18} className="mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Guests Grid */}
      {filteredGuests.length === 0 ? (
        <Empty
          title={guests.length === 0 ? "No guests found" : "No matching guests"}
          description={guests.length === 0 ? "Get started by adding guest profiles" : "Try adjusting your search criteria"}
          icon="Users"
actionLabel={guests.length === 0 ? "Add Guest" : "Clear Search"}
          onAction={guests.length === 0 ? () => setShowModal(true) : () => setSearchTerm("")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <GuestCard 
              key={guest.Id} 
              guest={guest} 
              onClick={setSelectedGuest}
            />
          ))}
        </div>
      )}

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedGuest.firstName} {selectedGuest.lastName}
                  </h2>
                  <p className="text-slate-600">{selectedGuest.email}</p>
                </div>
                <button 
                  onClick={() => setSelectedGuest(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="First Name"
                        value={selectedGuest.firstName}
                        readOnly
                      />
                      <FormField
                        label="Last Name"
                        value={selectedGuest.lastName}
                        readOnly
                      />
                      <FormField
                        label="Email"
                        value={selectedGuest.email}
                        readOnly
                      />
                      <FormField
                        label="Phone"
                        value={selectedGuest.phone}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Preferences */}
                  {selectedGuest.preferences && Object.keys(selectedGuest.preferences).length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Preferences</h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        {Object.entries(selectedGuest.preferences).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-slate-200 last:border-b-0">
                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-slate-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Guest Status */}
                  <Card variant="gradient" className="p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Guest Status</h4>
                    <div className="space-y-2">
                      {selectedGuest.vipStatus && (
                        <div className="flex items-center gap-2 text-amber-700">
                          <ApperIcon name="Crown" size={16} />
                          <span className="font-semibold">VIP Guest</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-600">
                        <ApperIcon name="Calendar" size={16} />
                        <span>{selectedGuest.stayHistory?.length || 0} stays</span>
                      </div>
                    </div>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button variant="primary" className="w-full">
                      <ApperIcon name="Edit" size={18} className="mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ApperIcon name="Calendar" size={18} className="mr-2" />
                      View Bookings
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <ApperIcon name="MessageCircle" size={18} className="mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
)}

      {/* Add Guest Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Guest</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
<form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const newGuest = await guestsService.create(formData)
                  await loadGuests()
                  setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '' })
                  setShowModal(false)
                  toast.success('Guest added successfully! Welcome email sent to ' + formData.email)
                } catch (error) {
                  toast.error('Failed to add guest. Please try again.')
                }
              }}>
                <div className="space-y-4">
<FormField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    placeholder="Enter guest's first name"
                  />
                  
                  <FormField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    placeholder="Enter guest's last name"
                  />
                  
                  <FormField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Enter email address"
                  />
                  
                  <FormField
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="Enter phone number"
                  />
                  
                  <FormField
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address (optional)"
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
<Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                  >
                    Add Guest
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Guests