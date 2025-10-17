// Mock billing data
const mockInvoices = [
  {
    Id: 1,
    invoiceNumber: "INV-2024-001",
    guestName: "John Smith",
    roomNumber: "301",
    totalAmount: 1600,
    status: "Paid",
    createdAt: "2024-01-15T10:00:00Z",
    stayDates: "Jan 15 - Jan 20, 2024",
    items: [
      { description: "Room charges (5 nights)", amount: 1250 },
      { description: "Room service", amount: 180 },
      { description: "Spa services", amount: 120 },
      { description: "Taxes", amount: 50 }
    ]
  },
  {
    Id: 2,
    invoiceNumber: "INV-2024-002",
    guestName: "Sarah Johnson",
    roomNumber: "101",
    totalAmount: 480,
    status: "Pending",
    createdAt: "2024-01-18T14:30:00Z",
    stayDates: "Jan 18 - Jan 22, 2024",
    items: [
      { description: "Room charges (4 nights)", amount: 400 },
      { description: "Mini bar", amount: 45 },
      { description: "Taxes", amount: 35 }
    ]
  },
  {
    Id: 3,
    invoiceNumber: "INV-2024-003",
    guestName: "Michael Davis",
    roomNumber: "401",
    totalAmount: 3500,
    status: "Overdue",
    createdAt: "2024-01-10T09:15:00Z",
    stayDates: "Jan 20 - Jan 27, 2024",
    items: [
      { description: "Presidential suite (7 nights)", amount: 3000 },
      { description: "Business center", amount: 150 },
      { description: "Room service", amount: 250 },
      { description: "Taxes", amount: 100 }
    ]
  },
  {
    Id: 4,
    invoiceNumber: "INV-2024-004",
    guestName: "Emily Wilson",
    roomNumber: "103",
    totalAmount: 540,
    status: "Paid",
    createdAt: "2024-01-16T16:45:00Z",
    stayDates: "Jan 16 - Jan 19, 2024",
    items: [
      { description: "Deluxe room (3 nights)", amount: 450 },
      { description: "Breakfast", amount: 60 },
      { description: "Taxes", amount: 30 }
    ]
  }
]

const billingService = {
  async getAllInvoices() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockInvoices]
  },

  async getInvoiceById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const invoice = mockInvoices.find(inv => inv.Id === id)
    if (!invoice) {
      throw new Error(`Invoice with ID ${id} not found`)
    }
    return { ...invoice }
  },

  async generateInvoice(bookingData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newId = Math.max(...mockInvoices.map(inv => inv.Id)) + 1
    const invoiceNumber = `INV-2024-${String(newId).padStart(3, '0')}`
    
    // Calculate itemized charges
    const roomCharges = bookingData.totalAmount * 0.8
    const services = bookingData.totalAmount * 0.15
    const taxes = bookingData.totalAmount * 0.05
    
    const newInvoice = {
      Id: newId,
      invoiceNumber,
      guestName: bookingData.guestName,
      roomNumber: bookingData.roomNumber,
      totalAmount: bookingData.totalAmount,
      status: "Pending",
      createdAt: new Date().toISOString(),
      stayDates: `${new Date(bookingData.checkIn).toLocaleDateString()} - ${new Date(bookingData.checkOut).toLocaleDateString()}`,
      items: [
        { description: "Room charges", amount: roomCharges },
        { description: "Additional services", amount: services },
        { description: "Taxes and fees", amount: taxes }
      ]
    }
    
    mockInvoices.push(newInvoice)
    return { ...newInvoice }
  },

async processPayment(invoiceId, paymentData) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const index = mockInvoices.findIndex(inv => inv.Id === invoiceId)
    if (index === -1) {
      throw new Error(`Invoice with ID ${invoiceId} not found`)
    }
    
    // Simulate payment processing with Stripe-compatible data
    const paymentMethods = {
      credit_card: { processingFee: 0.029, processingTime: "Instant", stripeMethod: "card" },
      digital_wallet: { processingFee: 0.025, processingTime: "Instant", stripeMethod: "card" },
      bank_transfer: { processingFee: 0.015, processingTime: "1-2 business days", stripeMethod: "ach_debit" },
      corporate: { processingFee: 0, processingTime: "Net 30", stripeMethod: "corporate" }
    }
    
    const method = paymentMethods[paymentData.method] || paymentMethods.credit_card
    const processingFee = Math.round(paymentData.amount * method.processingFee)
    
    mockInvoices[index] = {
      ...mockInvoices[index],
      status: "Paid",
      paymentMethod: paymentData.method,
      stripePaymentIntentId: paymentData.stripePaymentIntentId || null,
      paymentDate: new Date().toISOString(),
      processingFee,
      netAmount: paymentData.amount - processingFee
    }
    return { ...mockInvoices[index] }
  },

  async sendInvoice(invoiceId) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const invoice = mockInvoices.find(inv => inv.Id === invoiceId)
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`)
    }
    
    // Simulate email sending
    return {
      success: true,
      emailSent: true,
      sentAt: new Date().toISOString()
    }
  },

async getPaymentMethods() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [
      {
        id: "credit_card",
        name: "Credit Card",
        description: "Visa, Mastercard, American Express",
        processingFee: 2.9,
        processingTime: "Instant",
        supported: true,
        stripeCompatible: true
      },
      {
        id: "digital_wallet",
        name: "Digital Wallet",
        description: "Apple Pay, Google Pay, PayPal",
        processingFee: 2.5,
        processingTime: "Instant",
        supported: true,
        stripeCompatible: true
      },
      {
        id: "bank_transfer",
        name: "Bank Transfer",
        description: "ACH, Wire transfer",
        processingFee: 1.5,
        processingTime: "1-2 business days",
        supported: true,
        stripeCompatible: false
      },
      {
        id: "corporate",
        name: "Corporate Billing",
        description: "Purchase order, Net terms",
        processingFee: 0,
        processingTime: "Net 30",
        supported: true,
        stripeCompatible: false
      }
    ]
  },

  async getExpenses(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockExpenses = [
      {
        Id: 1,
        category: "Accommodation",
        amount: 1250,
        date: "2024-01-15T00:00:00Z",
        description: "Hotel room - Business trip",
        taxDeductible: true,
        receiptUrl: "/receipts/receipt-001.pdf",
        guestName: "John Smith"
      },
      {
        Id: 2,
        category: "Meals & Entertainment",
        amount: 340,
        date: "2024-01-16T00:00:00Z",
        description: "Client dinner",
        taxDeductible: true,
        receiptUrl: "/receipts/receipt-002.pdf",
        guestName: "Sarah Johnson"
      },
      {
        Id: 3,
        category: "Business Center",
        amount: 45,
        date: "2024-01-17T00:00:00Z",
        description: "Printing and copying",
        taxDeductible: true,
        receiptUrl: "/receipts/receipt-003.pdf",
        guestName: "Michael Davis"
      },
      {
        Id: 4,
        category: "Spa Services",
        amount: 180,
        date: "2024-01-17T00:00:00Z",
        description: "Personal wellness",
        taxDeductible: false,
        receiptUrl: "/receipts/receipt-004.pdf",
        guestName: "Emily Wilson"
      }
    ]
    
    return mockExpenses
  },

  async exportExpenseReport(format = "excel") {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Simulate report generation
    return {
      success: true,
      format,
      downloadUrl: `/reports/expense-report-${Date.now()}.${format}`,
      generatedAt: new Date().toISOString()
    }
  }
}

export default billingService