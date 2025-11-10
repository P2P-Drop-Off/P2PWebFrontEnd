// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import MapComponent from './components/MapComponent'
import CreateAccount from './pages/CreateAccount'
import LogIn from './pages/LogIn'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Home now shows the Home page (the design you uploaded) */}
      <Route path="/" element={<Home />} />

      {/* Keep the map available at /map */}
      <Route path="/map" element={
        <div className="app">
          <MapComponent />
        </div>
      } />

      <Route path="/login" element={<LogIn />} />
      <Route path="/create-account" element={<CreateAccount />} />
    </Routes>
  )
}

export default App
