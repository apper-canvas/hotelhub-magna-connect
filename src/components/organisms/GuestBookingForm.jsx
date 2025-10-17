import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import PaymentForm from "@/components/organisms/PaymentForm";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
// Stripe-only payment processing - no billing service needed
const GuestBookingForm = ({ selectedRoom, checkIn, checkOut, onBookingComplete }) => {
const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  })
  const [paymentData, setPaymentData] = useState({
    method: "",
    termsAccepted: false,
    cancellationPolicyAccepted: false
  })
const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

// Stripe is the only payment method - no loading needed

// No useEffect needed - Stripe-only processing

  const handleGuestInfoSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // Create preliminary booking data
    const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase()
    const preliminaryBooking = {
      id: bookingId,
      guest: formData,
      room: selectedRoom,
      checkIn,
      checkOut,
      totalAmount,
      nights,
      status: 'Pending Payment',
      createdAt: new Date().toISOString()
    }
    
    setBookingData(preliminaryBooking)
    setCurrentStep(2)
    toast.success("Guest information saved. Please select payment method.")
  }

// Stripe is hardcoded as the only payment method

  const handleTermsChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

const handleProceedToPayment = () => {
    if (!paymentData.termsAccepted) {
      toast.error("Please accept the terms and conditions")
      return
    }
    if (!paymentData.cancellationPolicyAccepted) {
      toast.error("Please accept the cancellation policy")
      return
    }
    setCurrentStep(3)
  }

  const handlePaymentComplete = (paymentResult) => {
    const finalBooking = {
      ...bookingData,
      paymentId: paymentResult.paymentId,
      paymentMethod: paymentData.method,
      paymentStatus: 'Completed',
      status: 'Confirmed',
      paidAt: new Date().toISOString()
    }
    
    toast.success("Payment completed successfully!")
    onBookingComplete(finalBooking)
  }

  const handleBackToStep = (step) => {
    setCurrentStep(step)
  }

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  const totalAmount = selectedRoom?.pricePerNight * nights || 0

  return (
    <Card variant="elevated" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Booking</h2>
        <p className="text-slate-600">Please fill in your details to confirm your reservation</p>
      </div>

{/* Step Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-8">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-primary-100 text-primary-600' : 'bg-slate-100'}`}>
              {currentStep > 1 ? <ApperIcon name="Check" size={16} /> : '1'}
            </div>
            <span className="ml-2 text-sm font-medium">Guest Info</span>
          </div>
          
          <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
          
          <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-primary-100 text-primary-600' : 'bg-slate-100'}`}>
              {currentStep > 2 ? <ApperIcon name="Check" size={16} /> : '2'}
            </div>
            <span className="ml-2 text-sm font-medium">Payment</span>
          </div>
          
          <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
          
          <div className={`flex items-center ${currentStep >= 3 ? 'text-primary-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 3 ? 'bg-primary-100 text-primary-600' : 'bg-slate-100'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Complete</span>
          </div>
        </div>
      </div>

      {/* Step 1: Guest Information */}
      {currentStep === 1 && (
        <form onSubmit={handleGuestInfoSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>

          <FormField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
          />

          <FormField
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />

          <FormField
            label="Special Requests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Any special requests or preferences?"
          >
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400"
              placeholder="Any special requests or preferences?"
            />
          </FormField>

{/* Booking Summary */}
          <Card variant="gradient" className="p-6 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Room:</span>
                <span className="font-semibold">{selectedRoom?.type} - Room {selectedRoom?.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Check-in:</span>
                <span className="font-semibold">{new Date(checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Check-out:</span>
                <span className="font-semibold">{new Date(checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nights:</span>
                <span className="font-semibold">{nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rate per night:</span>
                <span className="font-semibold">${selectedRoom?.pricePerNight}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-slate-900">Total Amount:</span>
                  <span className="text-2xl font-black text-gradient">${totalAmount}</span>
                </div>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
          >
            <ApperIcon name="ArrowRight" size={20} className="mr-2" />
            Continue to Payment
          </Button>
        </form>
      )}

      {/* Step 2: Payment Method Selection */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Select Payment Method</h3>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleBackToStep(1)}
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back
            </Button>
</div>

          <div className="space-y-4">
            <Card className="p-4 border-2 border-primary-500 bg-primary-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-primary-500 bg-primary-500 mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Stripe Payment</h4>
                    <p className="text-sm text-slate-600">Secure credit card processing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">2.9% fee</p>
                  <p className="text-xs text-slate-500">Instant processing</p>
                </div>
              </div>
            </Card>
          </div>
          {/* Terms and Conditions */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={paymentData.termsAccepted}
                onChange={(e) => handleTermsChange('termsAccepted', e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-slate-700">
                I agree to the <span className="text-primary-600 font-medium cursor-pointer hover:underline">Terms and Conditions</span> and 
                <span className="text-primary-600 font-medium cursor-pointer hover:underline ml-1">Privacy Policy</span>
              </label>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="cancellation"
                checked={paymentData.cancellationPolicyAccepted}
                onChange={(e) => handleTermsChange('cancellationPolicyAccepted', e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
              />
              <label htmlFor="cancellation" className="text-sm text-slate-700">
                I understand and accept the <span className="text-primary-600 font-medium cursor-pointer hover:underline">Cancellation Policy</span>
                <span className="text-xs text-slate-500 block mt-1">
                  Free cancellation up to 24 hours before check-in. Late cancellations subject to one night charge.
                </span>
              </label>
            </div>
          </div>

          {/* Booking Summary */}
          <Card variant="gradient" className="p-6 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Room:</span>
                <span className="font-semibold">{selectedRoom?.type} - Room {selectedRoom?.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Guest:</span>
                <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Check-in:</span>
                <span className="font-semibold">{new Date(checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Check-out:</span>
                <span className="font-semibold">{new Date(checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nights:</span>
                <span className="font-semibold">{nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rate per night:</span>
                <span className="font-semibold">${selectedRoom?.pricePerNight}</span>
              </div>
<div className="flex justify-between">
                <span className="text-slate-600">Processing fee:</span>
                <span className="font-semibold">
                  ${Math.round(totalAmount * 2.9 / 100)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-slate-900">Total Amount:</span>
                  <span className="text-2xl font-black text-gradient">
                    ${totalAmount + Math.round(totalAmount * 2.9 / 100)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleProceedToPayment}
          >
            <ApperIcon name="CreditCard" size={20} className="mr-2" />
            Proceed to Payment
          </Button>
        </div>
      )}

{/* Step 3: Payment Processing */}
      {currentStep === 3 && (
        <PaymentForm
          bookingData={bookingData}
          paymentMethod={{ id: 'stripe', name: 'Stripe Payment', provider: 'stripe' }}
          onPaymentComplete={handlePaymentComplete}
          onBack={() => handleBackToStep(2)}
        />
      )}
    </Card>
  )
}

export default GuestBookingForm