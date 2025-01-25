import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Departments from './pages/Departments'
import Positions from './pages/Positions'
import Sidebar from './components/dashboard/Sidebar'
import TopNav from './components/dashboard/TopNav'
import Employees from './pages/Employees'
import NotFound from './pages/NotFound'
import Services from './pages/Services'
import Applications from './pages/Applications'
import CreateApplication from './pages/CreateApplication'

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // Himoyalangan route uchun wrapper komponent
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token')

    if (!token) {
      return <Navigate to="/login" />
    }

    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`flex-1 flex flex-col overflow-hidden ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out bg-gray-100`}>
          <TopNav onLogout={handleLogout} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<Login />} />

      {/* Registratsiya route */}
      <Route path="/register" element={<Register />} />

      {/* Dashboard route (himoyalangan) */}
      <Route path="/" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      {/* Departments route (himoyalangan) */}
      <Route path="/departments" element={
        <PrivateRoute>
          <Departments />
        </PrivateRoute>
      } />

      {/* Positions route (himoyalangan) */}
      <Route path="/positions" element={
        <PrivateRoute>
          <Positions />
        </PrivateRoute>
      } />

      {/* Employees route (himoyalangan) */}
      <Route path="/employees" element={
        <PrivateRoute>
          <Employees />
        </PrivateRoute>
      } />

      {/* Services route (himoyalangan) */}
      <Route path="/services" element={
        <PrivateRoute>
          <Services />
        </PrivateRoute>
      } />

      {/* Applications route (himoyalangan) */}
      <Route path="/applications" element={
        <PrivateRoute>
          <Applications />
        </PrivateRoute>
      } />

      {/* Create Application route (himoyalangan) */}
      <Route path="/applications/create" element={
        <PrivateRoute>
          <CreateApplication />
        </PrivateRoute>
      } />

      {/* 404 sahifasi */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
