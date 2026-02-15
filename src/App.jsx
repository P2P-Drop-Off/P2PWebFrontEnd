// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import MapComponent from './components/MapComponent'
import CreateAccount from './pages/CreateAccount'
import LogIn from './pages/LogIn'
import Home from './pages/Home'
import PartnerForm from './pages/PartnerForm'
import SellingPage from './pages/SellingPage'
import CreateListing from './pages/CreateListing'
import Admin from './pages/admin'
import { ListingsProvider } from './context/ListingsContext'
import './App.css'

function App() {
  return (
    <ListingsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selling" element={<SellingPage />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/map" element={
          <div className="app">
            <MapComponent />
          </div>
        } />
        <Route path="/login" element={<LogIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/partner-form" element={<PartnerForm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </ListingsProvider>
  )
}

export default App
