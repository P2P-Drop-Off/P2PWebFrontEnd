import { Routes, Route } from 'react-router-dom'
import MapComponent from './components/MapComponent'
import CreateAccount from './pages/CreateAccount'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          <MapComponent />
        </div>
      } />
      <Route path="/create-account" element={<CreateAccount />} />
    </Routes>
  )
}

export default App
