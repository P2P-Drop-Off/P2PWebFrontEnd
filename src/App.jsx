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
import Terms from './pages/Terms'
import Listing from './pages/Listing'
import ConfirmTransaction from './pages/ConfirmTransaction'
import ListingCreated from './pages/ListingCreated';
import ParnterDashboard from './pages/PartnerDashboard';

function App() {
  return (
    <Routes>
      <Route path="/partner-dashboard/:locationId" element={<ParnterDashboard />} />
    <Route
    path="/*"
    element={
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
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/listing-created/:id" element={<ListingCreated />} />
          <Route path="/confirm/:id" element={<ConfirmTransaction />} />
          
        </Routes>
      </ListingsProvider>
    }
    />
    </Routes>
  )
}

export default App
