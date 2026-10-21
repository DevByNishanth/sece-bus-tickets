import { Route, Routes } from 'react-router-dom'
import Home from './pages/landing/Home.jsx'
import Dashboard from './pages/vendor/Dashboard.jsx'
import SeatGenerationPage from './pages/vendor/SeatGenerationPage.jsx'

function App() {
  return <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vendor" element={<Dashboard />} />
      <Route path="/vendor/seatGeneration/:busId" element={<SeatGenerationPage />} />
    </Routes>
  </>
}

export default App
