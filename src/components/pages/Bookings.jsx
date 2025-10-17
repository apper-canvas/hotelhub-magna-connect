import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import BookingCard from "@/components/molecules/BookingCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import bookingsService from "@/services/api/bookingsService"

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("All")
  const [selectedBooking, setSelectedBooking] = useState(null)

  const loadBookings = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await bookingsService.getAll()
      setBookings(data)
    } catch (err) {
      setError("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find(b => b.Id === bookingId)
      await bookingsService.update(bookingId, { ...booking, status: newStatus })
      setBookings(bookings.map(b => b.Id === bookingId ? { ...b, status: newStatus } : b))
      toast.success(`Booking #${booking.Id} status updated to ${newStatus}`)
    } catch (err) {
      toast.error("Failed to update booking status")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBookings} />

  const filteredBookings = filter === "All" ? bookings : bookings.filter(booking => booking.status === filter)
  const statusCounts = {
    All: bookings.length,
    Confirmed: bookings.filter(b => b.status === "Confirmed").length,
    Pending: bookings.filter(b => b.status === "Pending").length,
    "Checked In": bookings.filter(b => b.status === "Checked In").length,
    "Checked Out": bookings.filter(b => b.status === "Checked Out").length,
    Cancelled: bookings.filter(b => b.status === "Cancelled").length
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Management</h1>
          <p className="text-slate-600">Monitor and manage all reservations</p>
        </div>
        <Button variant="primary" className="sm:w-auto w-full">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          New Booking
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

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <Empty
          title="No bookings found"
          description={filter === "All" ? "No reservations have been made yet" : `No bookings with status: ${filter}`}
          icon="Calendar"
          actionLabel={filter === "All" ? "New Booking" : "Clear Filter"}
          onAction={filter === "All" ? () => {} : () => setFilter("All")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard 
              key={booking.Id} 
              booking={booking} 
              onClick={setSelectedBooking}
            />
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Booking #{selectedBooking.Id}
                  </h2>
                  <p className="text-slate-600">Room {selectedBooking.roomNumber}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Booking Details */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Check-in Date
                        </label>
                        <p className="text-slate-900 font-medium">
                          {new Date(selectedBooking.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Check-out Date
                        </label>
                        <p className="text-slate-900 font-medium">
                          {new Date(selectedBooking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Guest Name
                        </label>
                        <p className="text-slate-900 font-medium">{selectedBooking.guestName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Total Amount
                        </label>
                        <p className="text-2xl font-bold text-gradient">${selectedBooking.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Special Requests</h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-slate-700 italic">{selectedBooking.specialRequests}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Status Management */}
                  <Card variant="gradient" className="p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Status Management</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Current Status
                        </label>
                        <select
                          value={selectedBooking.status}
                          onChange={(e) => handleStatusUpdate(selectedBooking.Id, e.target.value)}
                          className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Checked In">Checked In</option>
                          <option value="Checked Out">Checked Out</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    {selectedBooking.status === "Confirmed" && (
                      <Button 
                        variant="primary" 
                        className="w-full"
                        onClick={() => handleStatusUpdate(selectedBooking.Id, "Checked In")}
                      >
                        <ApperIcon name="UserCheck" size={18} className="mr-2" />
                        Check In
                      </Button>
                    )}
                    {selectedBooking.status === "Checked In" && (
                      <Button 
                        variant="success" 
                        className="w-full"
                        onClick={() => handleStatusUpdate(selectedBooking.Id, "Checked Out")}
                      >
                        <ApperIcon name="UserX" size={18} className="mr-2" />
                        Check Out
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <ApperIcon name="Edit" size={18} className="mr-2" />
                      Modify Booking
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <ApperIcon name="Mail" size={18} className="mr-2" />
                      Send Email
                    </Button>
                    {selectedBooking.status !== "Cancelled" && (
                      <Button 
                        variant="danger" 
                        className="w-full"
                        onClick={() => handleStatusUpdate(selectedBooking.Id, "Cancelled")}
                      >
                        <ApperIcon name="X" size={18} className="mr-2" />
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Bookings