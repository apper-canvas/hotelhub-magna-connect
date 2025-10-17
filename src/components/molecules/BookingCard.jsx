import React from "react"
import { format } from "date-fns"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const BookingCard = ({ booking, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Confirmed": return "success"
      case "Pending": return "warning"
      case "Cancelled": return "danger"
      case "Checked In": return "info"
      case "Checked Out": return "default"
      default: return "default"
    }
  }

  return (
    <Card 
      variant="elevated" 
      className="p-6 cursor-pointer hover:shadow-glow transition-all duration-300"
      onClick={() => onClick(booking)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Booking #{booking.id}
          </h3>
          <p className="text-sm text-slate-600">Room {booking.roomNumber}</p>
        </div>
        <Badge variant={getStatusVariant(booking.status)}>
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Check-in</p>
          <p className="text-sm font-semibold text-slate-900">
            {format(new Date(booking.checkIn), "MMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Check-out</p>
          <p className="text-sm font-semibold text-slate-900">
            {format(new Date(booking.checkOut), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <ApperIcon name="User" size={14} />
            <span>{booking.guestName}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <ApperIcon name="DollarSign" size={14} />
            <span>Total Amount</span>
          </div>
          <span className="font-bold text-lg text-gradient">
            ${booking.totalAmount}
          </span>
        </div>
      </div>

      {booking.specialRequests && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <ApperIcon name="MessageSquare" size={14} className="mt-0.5" />
            <span className="italic">{booking.specialRequests}</span>
          </div>
        </div>
      )}
    </Card>
  )
}

export default BookingCard