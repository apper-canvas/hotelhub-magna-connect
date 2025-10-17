import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Billing from "@/components/pages/Billing";

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const PaymentForm = ({ bookingData, onPaymentComplete, onBack }) => {
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    }
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1]
      setPaymentForm(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }))
    } else {
      // Format card number with spaces
      if (name === 'cardNumber') {
        const formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
        setPaymentForm(prev => ({ ...prev, [name]: formattedValue }))
      } 
      // Format expiry date
      else if (name === 'expiryDate') {
        const formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5)
        setPaymentForm(prev => ({ ...prev, [name]: formattedValue }))
      }
      // Limit CVV to 4 digits
      else if (name === 'cvv') {
        const formattedValue = value.replace(/\D/g, '').substring(0, 4)
        setPaymentForm(prev => ({ ...prev, [name]: formattedValue }))
      }
      else {
        setPaymentForm(prev => ({ ...prev, [name]: value }))
      }
    }
  }

  const validatePaymentForm = () => {
    const errors = []
    
    // Card number validation (simplified)
    const cardNumber = paymentForm.cardNumber.replace(/\s/g, '')
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      errors.push("Please enter a valid card number")
    }
    
    // Expiry date validation
    if (!paymentForm.expiryDate || paymentForm.expiryDate.length !== 5) {
      errors.push("Please enter a valid expiry date (MM/YY)")
    } else {
      const [month, year] = paymentForm.expiryDate.split('/')
      const currentDate = new Date()
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
      if (expiry <= currentDate) {
        errors.push("Card has expired")
      }
    }
    
    // CVV validation
    if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
      errors.push("Please enter a valid CVV")
    }
    
    // Cardholder name validation
    if (!paymentForm.cardHolderName.trim()) {
      errors.push("Please enter the cardholder name")
    }
    
    // Billing address validation
    if (!paymentForm.billingAddress.street.trim()) {
      errors.push("Please enter billing street address")
    }
    if (!paymentForm.billingAddress.city.trim()) {
      errors.push("Please enter billing city")
    }
    if (!paymentForm.billingAddress.state.trim()) {
      errors.push("Please enter billing state")
    }
    if (!paymentForm.billingAddress.zipCode.trim()) {
      errors.push("Please enter billing zip code")
    }
    
    return errors
  }

  const processPayment = async (e) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validatePaymentForm()
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      return
    }

    setIsProcessing(true)

try {
      // Calculate final amount with Stripe processing fee (2.9%)
      const processingFee = Math.round(bookingData.totalAmount * 2.9 / 100)
      const finalAmount = bookingData.totalAmount + processingFee
      // Prepare payment data for Stripe
      const stripePaymentData = {
        amount: finalAmount * 100, // Stripe expects amount in cents
        currency: 'usd',
        description: `Hotel booking - ${bookingData.room.type} Room ${bookingData.room.number}`,
        booking: {
          id: bookingData.id,
          guestName: `${bookingData.guest.firstName} ${bookingData.guest.lastName}`,
          guestEmail: bookingData.guest.email,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          room: bookingData.room
        },
        paymentMethod: {
          card: {
            number: paymentForm.cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(paymentForm.expiryDate.split('/')[0]),
            exp_year: 2000 + parseInt(paymentForm.expiryDate.split('/')[1]),
            cvc: paymentForm.cvv
          },
          billing_details: {
            name: paymentForm.cardHolderName,
            email: bookingData.guest.email,
            address: {
              line1: paymentForm.billingAddress.street,
              city: paymentForm.billingAddress.city,
              state: paymentForm.billingAddress.state,
              postal_code: paymentForm.billingAddress.zipCode,
              country: paymentForm.billingAddress.country
            }
          }
        },
        metadata: {
          bookingId: bookingData.id,
          guestEmail: bookingData.guest.email,
          roomNumber: bookingData.room.number.toString()
        }
      }

// Process payment through Stripe Edge function
      const result = await apperClient.functions.invoke(import.meta.env.VITE_STRIPE_PAYMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stripePaymentData)
      })

      const paymentResult = await result.json()

      if (!result.ok) {
        throw new Error(paymentResult.error || 'Payment processing failed')
      }

      if (paymentResult.success && paymentResult.paymentIntent) {
        // Payment successful
toast.success("Payment processed successfully!")
        onPaymentComplete({
          paymentId: paymentResult.paymentIntent.id,
          amount: finalAmount,
          processingFee,
          paymentMethod: 'stripe',
          status: 'completed'
        })
      } else {
        throw new Error(paymentResult.error || 'Payment was not successful')
      }

    } catch (error) {
      console.error('Payment processing error:', error)
      toast.error(`Payment failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '')
    if (number.match(/^4/)) return 'Visa'
    if (number.match(/^5[1-5]/)) return 'Mastercard'
    if (number.match(/^3[47]/)) return 'American Express'
    if (number.match(/^6/)) return 'Discover'
    return 'Card'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Payment Details</h3>
        <Button variant="secondary" size="sm" onClick={onBack}>
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back
        </Button>
      </div>

      <form onSubmit={processPayment} className="space-y-6">
{/* Stripe Payment Method */}
        <Card className="p-4 bg-primary-50 border border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ApperIcon name="CreditCard" size={20} className="text-primary-600 mr-3" />
              <div>
                <h4 className="font-semibold text-slate-900">Stripe Payment</h4>
                <p className="text-sm text-slate-600">Secure credit card processing</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary-700">2.9% fee</p>
              <p className="text-xs text-slate-500">Instant processing</p>
            </div>
          </div>
        </Card>

        {/* Card Information */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Card Information</h4>
          
          <div className="space-y-4">
            <FormField
              label="Card Number"
              name="cardNumber"
              value={paymentForm.cardNumber}
              onChange={handleFormChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Expiry Date"
                name="expiryDate"
                value={paymentForm.expiryDate}
                onChange={handleFormChange}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
              <FormField
                label="CVV"
                name="cvv"
                value={paymentForm.cvv}
                onChange={handleFormChange}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>

            <FormField
              label="Cardholder Name"
              name="cardHolderName"
              value={paymentForm.cardHolderName}
              onChange={handleFormChange}
              placeholder="Full name as shown on card"
              required
            />
          </div>
        </Card>

        {/* Billing Address */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Billing Address</h4>
          
          <div className="space-y-4">
            <FormField
              label="Street Address"
              name="billing.street"
              value={paymentForm.billingAddress.street}
              onChange={handleFormChange}
              placeholder="123 Main Street"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="City"
                name="billing.city"
                value={paymentForm.billingAddress.city}
                onChange={handleFormChange}
                placeholder="New York"
                required
              />
              <FormField
                label="State"
                name="billing.state"
                value={paymentForm.billingAddress.state}
                onChange={handleFormChange}
                placeholder="NY"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Zip Code"
                name="billing.zipCode"
                value={paymentForm.billingAddress.zipCode}
                onChange={handleFormChange}
                placeholder="10001"
                required
              />
              <FormField
                label="Country"
                name="billing.country"
                value={paymentForm.billingAddress.country}
                onChange={handleFormChange}
                disabled
                required
              />
            </div>
          </div>
        </Card>

        {/* Final Booking Summary */}
        <Card variant="gradient" className="p-6 bg-gradient-to-r from-slate-50 to-white">
          <h4 className="text-lg font-bold text-slate-900 mb-4">Payment Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Booking Amount:</span>
              <span className="font-semibold">${bookingData.totalAmount}</span>
</div>
            <div className="flex justify-between">
              <span className="text-slate-600">Processing Fee (2.9%):</span>
              <span className="font-semibold">
                ${Math.round(bookingData.totalAmount * 2.9 / 100)}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between">
<span className="text-xl font-bold text-slate-900">Total Charge:</span>
                <span className="text-2xl font-black text-gradient">
                  ${bookingData.totalAmount + Math.round(bookingData.totalAmount * 2.9 / 100)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Process Payment Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
              Processing Payment...
            </>
) : (
            <>
              <ApperIcon name="Lock" size={20} className="mr-2" />
              Pay ${bookingData.totalAmount + Math.round(bookingData.totalAmount * 2.9 / 100)}
            </>
          )}
        </Button>
        {/* Security Notice */}
        <div className="flex items-center justify-center text-sm text-slate-500 mt-4">
          <ApperIcon name="Shield" size={16} className="mr-2" />
          Your payment information is encrypted and secure
        </div>
      </form>
    </div>
  )
}

export default PaymentForm