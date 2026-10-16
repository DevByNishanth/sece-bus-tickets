import { Route, Routes } from 'react-router-dom'
import Home from './pages/landing/Home.jsx'
import Dashboard from './pages/vendor/Dashboard.jsx'

function App() {
  return <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vendor" element={<Dashboard/>} />

    </Routes>
  </>
}

export default App
