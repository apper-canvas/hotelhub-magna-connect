import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import billingService from "@/services/api/billingService"
import bookingsService from "@/services/api/bookingsService"

const Billing = () => {
  const [invoices, setInvoices] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [filter, setFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const loadBillingData = async () => {
    try {
      setError("")
      setLoading(true)
      const [invoicesData, bookingsData] = await Promise.all([
        billingService.getAllInvoices(),
        bookingsService.getAll()
      ])
      setInvoices(invoicesData)
      setBookings(bookingsData)
    } catch (err) {
      setError("Failed to load billing data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBillingData()
  }, [])

  const handleGenerateInvoice = async (bookingId) => {
    try {
      const booking = bookings.find(b => b.Id === bookingId)
      if (!booking) return
      
      const invoice = await billingService.generateInvoice(booking)
      setInvoices(prev => [invoice, ...prev])
      toast.success("Invoice generated successfully!")
    } catch (err) {
      toast.error("Failed to generate invoice")
    }
  }

  const handlePaymentProcess = async (invoiceId, paymentData) => {
    try {
      const updatedInvoice = await billingService.processPayment(invoiceId, paymentData)
      setInvoices(prev => prev.map(inv => inv.Id === invoiceId ? updatedInvoice : inv))
      toast.success("Payment processed successfully!")
    } catch (err) {
      toast.error("Payment processing failed")
    }
  }

  const handleSendInvoice = async (invoiceId) => {
    try {
      await billingService.sendInvoice(invoiceId)
      toast.success("Invoice sent to guest!")
    } catch (err) {
      toast.error("Failed to send invoice")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBillingData} />

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === "All" || invoice.status === filter
    const matchesSearch = 
      invoice.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalRevenue = invoices.reduce((sum, inv) => inv.status === "Paid" ? sum + inv.totalAmount : sum, 0)
  const pendingAmount = invoices.reduce((sum, inv) => inv.status === "Pending" ? sum + inv.totalAmount : sum, 0)
  const overdueAmount = invoices.reduce((sum, inv) => inv.status === "Overdue" ? sum + inv.totalAmount : sum, 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Advanced Billing System</h1>
          <p className="text-slate-600">Comprehensive payment and invoice management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <ApperIcon name="Download" size={18} className="mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={() => setShowNewInvoice(true)}>
            <ApperIcon name="Plus" size={18} className="mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="gradient" className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500 text-white">
              <ApperIcon name="DollarSign" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-emerald-600">+15% this month</p>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500 text-white">
              <ApperIcon name="Clock" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Payments</p>
              <p className="text-2xl font-bold text-slate-900">${pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-amber-600">{invoices.filter(i => i.status === "Pending").length} invoices</p>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500 text-white">
              <ApperIcon name="AlertTriangle" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Overdue Amount</p>
              <p className="text-2xl font-bold text-slate-900">${overdueAmount.toLocaleString()}</p>
              <p className="text-sm text-red-600">{invoices.filter(i => i.status === "Overdue").length} overdue</p>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <ApperIcon name="CreditCard" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Transaction</p>
              <p className="text-2xl font-bold text-slate-900">${Math.round(totalRevenue / invoices.filter(i => i.status === "Paid").length || 0)}</p>
              <p className="text-sm text-blue-600">Per invoice</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card variant="gradient" className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <FormField
              placeholder="Search invoices by guest name or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-0"
            >
              <div className="relative">
                <ApperIcon name="Search" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search invoices by guest name or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400"
                />
              </div>
            </FormField>
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <Button variant="outline">
              <ApperIcon name="Filter" size={18} className="mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Empty
          title="No invoices found"
          description="No invoices match your current search criteria"
          icon="FileText"
          actionLabel="Create Invoice"
          onAction={() => setShowNewInvoice(true)}
        />
      ) : (
        <Card variant="gradient" className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Invoice #</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Guest</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Amount</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Date</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.Id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-2">
                      <span className="font-medium text-primary-600">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        <p className="font-medium text-slate-900">{invoice.guestName}</p>
                        <p className="text-sm text-slate-600">Room {invoice.roomNumber}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-bold text-slate-900">${invoice.totalAmount}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-slate-600">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-2">
                      <Badge 
                        variant={
                          invoice.status === "Paid" ? "success" :
                          invoice.status === "Pending" ? "warning" :
                          invoice.status === "Overdue" ? "danger" : "secondary"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <ApperIcon name="Eye" size={14} />
                        </Button>
                        {invoice.status === "Pending" && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handlePaymentProcess(invoice.Id, { method: "card", amount: invoice.totalAmount })}
                          >
                            <ApperIcon name="CreditCard" size={14} />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendInvoice(invoice.Id)}
                        >
                          <ApperIcon name="Mail" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Payment Methods Section */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Payment Methods Supported</h2>
            <p className="text-sm text-slate-600">Multiple payment options for guest convenience</p>
          </div>
        </div>

<div className="flex justify-center">
          <div className="bg-slate-50 rounded-xl p-8 text-center max-w-md">
            <div className="p-4 rounded-lg bg-blue-500 text-white inline-flex mb-4">
              <ApperIcon name="CreditCard" size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3">Stripe Payment Processing</h4>
            <p className="text-slate-600 mb-4">Secure credit card processing with industry-leading security standards</p>
            <div className="bg-white rounded-lg p-4 text-left">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Supported Cards:</span>
                  <p className="font-medium">Visa, Mastercard, Amex</p>
                </div>
                <div>
                  <span className="text-slate-600">Processing Fee:</span>
                  <p className="font-medium">2.9% per transaction</p>
                </div>
                <div>
                  <span className="text-slate-600">Processing Time:</span>
                  <p className="font-medium">Instant</p>
                </div>
                <div>
                  <span className="text-slate-600">Security:</span>
                  <p className="font-medium">PCI DSS Level 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Expense Management Section */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Expense Management</h2>
            <p className="text-sm text-slate-600">Business traveler expense tracking and reporting</p>
          </div>
          <Button variant="outline">
            <ApperIcon name="Upload" size={18} className="mr-2" />
            Upload Receipt
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {[
                { category: "Accommodation", amount: 1250, taxDeductible: true, date: "2024-01-15" },
                { category: "Meals & Entertainment", amount: 340, taxDeductible: true, date: "2024-01-16" },
                { category: "Business Center", amount: 45, taxDeductible: true, date: "2024-01-17" },
                { category: "Spa Services", amount: 180, taxDeductible: false, date: "2024-01-17" }
              ].map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                      <ApperIcon 
                        name={
                          expense.category.includes("Accommodation") ? "Home" :
                          expense.category.includes("Meals") ? "UtensilsCrossed" :
                          expense.category.includes("Business") ? "Building" : "Sparkles"
                        } 
                        size={18} 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{expense.category}</p>
                      <p className="text-sm text-slate-600">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${expense.amount}</p>
                    {expense.taxDeductible && (
                      <Badge variant="success" className="text-xs">Tax Deductible</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-25 p-5 rounded-xl">
              <h4 className="font-semibold text-emerald-900 mb-2">Total Expenses</h4>
              <p className="text-2xl font-bold text-emerald-900">$1,815</p>
              <p className="text-sm text-emerald-600">Tax deductible: $1,635</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-25 p-5 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">Export Options</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <ApperIcon name="FileSpreadsheet" size={16} className="mr-2" />
                  Export to Excel
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <ApperIcon name="FileText" size={16} className="mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Invoice Details</h2>
                  <p className="text-slate-600">{selectedInvoice.invoiceNumber}</p>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Billing Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600">Guest Name</p>
                      <p className="font-medium">{selectedInvoice.guestName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Room Number</p>
                      <p className="font-medium">{selectedInvoice.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Check-in/Check-out</p>
                      <p className="font-medium">{selectedInvoice.stayDates}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Itemized Charges</h3>
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-slate-600">{item.description}</span>
                        <span className="font-medium">${item.amount}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${selectedInvoice.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="primary" className="flex-1">
                  <ApperIcon name="Download" size={18} className="mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <ApperIcon name="Mail" size={18} className="mr-2" />
                  Email Invoice
                </Button>
                {selectedInvoice.status === "Pending" && (
                  <Button variant="success" className="flex-1">
                    <ApperIcon name="CreditCard" size={18} className="mr-2" />
                    Process Payment
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Billing