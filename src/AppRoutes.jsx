import React from 'react'
import { Route, Routes } from 'react-router'
import LoginPage from './pages/login1/Login1'
import SignUpPage from './pages/signup1/Signup1'
import MenuPage from './pages/customer/Customer1'
import KitchenStaffDashboard from './pages/kitchenStaff/Kitchenstaff1'
import Admin from './pages/admin/Admin'
import ReservationPage from './pages/reservation/Reservation1'
import FeedbackPage from './pages/feedback/FeedbackPage' // Add this import
import InventoryStatus from './pages/inventorytracker/Inventorytracker'
import OrderDashboard from './pages/ordermanagement/Ordermanagement'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/customer" element={<MenuPage/>} />
      <Route path="/kitchen" element={<KitchenStaffDashboard/>} />
      <Route path="/admin" element={<Admin/>} />
      <Route path="/reservation" element={<ReservationPage/>} />
      <Route path="/feedback" element={<FeedbackPage/>} /> {/* Add this route */}
       <Route path="/InventoryStatus" element={<InventoryStatus/>} />  
      <Route path="/OrderDashboard" element={<OrderDashboard/>} /> 

    </Routes>
  )
}

export default AppRoutes