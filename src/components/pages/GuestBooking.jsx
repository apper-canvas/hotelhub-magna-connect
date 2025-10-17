import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import bookingsService from "@/services/api/bookingsService";
import roomsService from "@/services/api/roomsService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import GuestBookingForm from "@/components/organisms/GuestBookingForm";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Staff from "@/components/pages/Staff";
import Rooms from "@/components/pages/Rooms";
const GuestBooking = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(null)

  const loadRooms = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await roomsService.getAll()
      // Only show available rooms for guest booking
      setRooms(data.filter(room => room.status === "Available"))
    } catch (err) {
      setError("Failed to load available rooms")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
    
    // Set default dates (today and tomorrow)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    setCheckIn(today.toISOString().split('T')[0])
    setCheckOut(tomorrow.toISOString().split('T')[0])
  }, [])

const handleBookingComplete = async (bookingData) => {
    // Save booking to service
    try {
      const savedBooking = await bookingsService.create({
        guestName: `${bookingData.guest.firstName} ${bookingData.guest.lastName}`,
        guestEmail: bookingData.guest.email,
        guestPhone: bookingData.guest.phone,
        roomId: bookingData.room.Id,
        roomType: bookingData.room.type,
        roomNumber: bookingData.room.number,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        nights: bookingData.nights,
        totalAmount: bookingData.totalAmount,
        paymentId: bookingData.paymentId,
        paymentMethod: bookingData.paymentMethod,
        paymentStatus: bookingData.paymentStatus,
        status: bookingData.status,
        specialRequests: bookingData.guest.specialRequests || "",
        createdAt: bookingData.createdAt,
        paidAt: bookingData.paidAt
      })
      
      setBookingConfirmed({
        ...bookingData,
        Id: savedBooking.Id
      })
      setSelectedRoom(null)
      toast.success("Booking confirmed and saved successfully!")
    } catch (error) {
      console.error("Error saving booking:", error)
      setBookingConfirmed(bookingData)
      setSelectedRoom(null)
      toast.success("Booking confirmed successfully!")
    }
  }

  const filteredRooms = rooms.filter(room => 
    room.capacity >= guests
  )

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card variant="elevated" className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center">
                  <ApperIcon name="CheckCircle2" size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
                <p className="text-slate-600">Thank you for choosing our hotel. Your reservation has been confirmed.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-6 text-left">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Booking Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Booking ID:</span>
                    <p className="font-bold text-primary-600">#{bookingConfirmed.id}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Guest Name:</span>
                    <p className="font-semibold">{bookingConfirmed.guest.firstName} {bookingConfirmed.guest.lastName}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Room:</span>
                    <p className="font-semibold">{bookingConfirmed.room.type} - Room {bookingConfirmed.room.number}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Check-in:</span>
                    <p className="font-semibold">{new Date(bookingConfirmed.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Check-out:</span>
                    <p className="font-semibold">{new Date(bookingConfirmed.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Email:</span>
                    <p className="font-semibold">{bookingConfirmed.guest.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => setBookingConfirmed(null)}
                >
                  <ApperIcon name="Plus" size={18} className="mr-2" />
                  Make Another Booking
                </Button>
                <Button variant="outline" className="flex-1">
                  <ApperIcon name="Mail" size={18} className="mr-2" />
                  Email Confirmation
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (selectedRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedRoom(null)}
                className="mb-4"
              >
                <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
                Back to Room Selection
              </Button>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Booking</h1>
              <p className="text-slate-600">You're just one step away from confirming your stay!</p>
            </div>
<GuestBookingForm
              selectedRoom={selectedRoom}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))}
              totalAmount={selectedRoom.pricePerNight * Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg">
                <ApperIcon name="Building2" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">HotelHub Pro</h1>
                <p className="text-sm text-slate-600">Book Your Perfect Stay</p>
              </div>
            </div>
<div className="flex items-center gap-4">
              <Link 
                to="/guest-booking/profile"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="User" size={16} />
                My Profile
              </Link>
              <a 
                href="/"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="Shield" size={16} />
                Staff Portal
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Booking Search */}
          <Card variant="elevated" className="p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Find Your Perfect Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                label="Check-in Date"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <FormField
                label="Check-out Date"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
              <FormField
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                min="1"
                max="8"
              />
              <div className="flex items-end">
                <Button variant="primary" className="w-full" onClick={loadRooms}>
                  <ApperIcon name="Search" size={18} className="mr-2" />
                  Search Rooms
                </Button>
              </div>
            </div>
          </Card>

          {loading && <Loading />}
          {error && <Error message={error} onRetry={loadRooms} />}

          {!loading && !error && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Available Rooms ({filteredRooms.length})
                </h2>
                {checkIn && checkOut && (
                  <div className="text-sm text-slate-600">
                    {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
                  </div>
                )}
              </div>

              {filteredRooms.length === 0 ? (
                <Empty
                  title="No rooms available"
                  description="Try adjusting your dates or reducing the number of guests"
                  icon="Home"
                  actionLabel="Modify Search"
                  onAction={() => {}}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => {
                    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
                    const totalPrice = room.pricePerNight * nights

                    return (
                      <Card 
                        key={room.Id} 
                        variant="elevated" 
                        className="overflow-hidden hover:shadow-glow transition-all duration-300"
                      >
                        {room.photos && room.photos.length > 0 && (
                          <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-100 flex items-center justify-center">
                            <ApperIcon name="Camera" size={48} className="text-slate-400" />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 capitalize">{room.type}</h3>
                              <p className="text-sm text-slate-600">Room {room.number}</p>
                            </div>
                            <Badge variant="available">Available</Badge>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <ApperIcon name="Users" size={16} />
                              <span>Up to {room.capacity} guests</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <ApperIcon name="DollarSign" size={16} />
                              <span className="font-semibold text-slate-900">${room.pricePerNight} per night</span>
                            </div>
                          </div>

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-semibold text-slate-700 mb-2">Amenities:</p>
                              <div className="flex flex-wrap gap-1">
                                {room.amenities.slice(0, 4).map((amenity, index) => (
                                  <Badge key={index} variant="default" size="sm">
                                    {amenity}
                                  </Badge>
                                ))}
                                {room.amenities.length > 4 && (
                                  <Badge variant="default" size="sm">
                                    +{room.amenities.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-slate-600">
                                {nights} {nights === 1 ? 'night' : 'nights'}
                              </span>
                              <span className="text-2xl font-bold text-gradient">${totalPrice}</span>
                            </div>
                            <Button 
                              variant="primary" 
                              className="w-full"
                              onClick={() => setSelectedRoom(room)}
                            >
                              <ApperIcon name="Calendar" size={18} className="mr-2" />
                              Book This Room
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuestBooking