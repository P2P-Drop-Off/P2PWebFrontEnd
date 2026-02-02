// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Map from './pages/Map'
import CreateAccount from './pages/CreateAccount'
import LogIn from './pages/LogIn'
import Home from './pages/Home'
import PartnerForm from './pages/PartnerForm'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Home now shows the Home page (the design you uploaded) */}
      <Route path="/" element={<Home />} />

      {/* Map page */}
      <Route path="/map" element={<Map />} />

      <Route path="/login" element={<LogIn />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/partner-form" element={<PartnerForm />} />
    </Routes>
  )
}

export default App
