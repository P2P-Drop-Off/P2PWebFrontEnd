// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Map from './pages/Map'
import CreateAccount from './pages/CreateAccount'
import LogIn from './pages/LogIn'
import Home from './pages/Home'
import SellingPage from './pages/SellingPage'
import CreateListing from './pages/CreateListing'
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
      </Routes>
    </ListingsProvider>
  )
}

export default App
