import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import Rooms from "@/components/pages/Rooms"
import Guests from "@/components/pages/Guests"
import Bookings from "@/components/pages/Bookings"
import Staff from "@/components/pages/Staff"
import Reports from "@/components/pages/Reports"
import Analytics from "@/components/pages/Analytics"
import Billing from "@/components/pages/Billing"
import GuestBooking from "@/components/pages/GuestBooking"
import Profile from "@/components/pages/Profile"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
<Routes>
          <Route path="/guest-booking" element={<GuestBooking />} />
          <Route path="/guest-booking/profile" element={<Profile />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="guests" element={<Guests />} />
            <Route path="bookings" element={<Bookings />} />
<Route path="staff" element={<Staff />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="billing" element={<Billing />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  )
}

export default App