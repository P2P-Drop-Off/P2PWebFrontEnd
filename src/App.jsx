import { Routes, Route } from 'react-router-dom'
import MapComponent from './components/MapComponent'
import CreateAccount from './pages/CreateAccount'
import LogIn from './pages/LogIn'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={
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
