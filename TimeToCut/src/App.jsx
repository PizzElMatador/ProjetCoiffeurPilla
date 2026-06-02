import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Pages
import Home from './pages/client/Home'
import Login from './pages/client/Login'
import SignUp from './pages/client/SignUp'
import Booking from './pages/client/Booking'
import Prestations from './pages/client/Prestations'
import Salons from './pages/client/Salons'
import SalonDetail from './pages/client/SalonDetail'
import Creneaux from './pages/client/Creneaux'
import Confirmation from './pages/client/Confirmation'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminPrestations from './pages/admin/AdminPrestations'
import AdminReservations from './pages/admin/AdminReservations'
import AdminProfil from './pages/admin/AdminProfil'
import MesReservations from './pages/client/MesReservations';

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/prestations" element={<Prestations />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/:id" element={<SalonDetail />} />
        <Route path="/creneaux" element={<Creneaux />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/mes-reservations" element={<MesReservations />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/prestations" element={<AdminPrestations />} />
        <Route path="/admin/reservations" element={<AdminReservations />} />
        <Route path="/admin/profil" element={<AdminProfil />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
