import { Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/landing/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Signup from './pages/Signup.jsx'
import AgentSignup from './pages/AgentSignup.jsx'
import TravelAgentDashboard from './pages/TravelAgentDashboard.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'

/**
 * The landing page always renders as the "background" at /, /login and /signup
 * so the modal overlays appear on top of it — no nested <Routes> needed.
 */
function App() {
  const location = useLocation()

  // Routes that show an auth modal on top of the landing page
  const isAuthOverlay = ['/', '/login', '/signup', '/agent-signup'].includes(location.pathname)

  if (!isAuthOverlay) {
    // Other standalone routes (e.g. admin, travelagent, crew)
    return (
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/travelagent" element={<TravelAgentDashboard />} />
          <Route path="/agent-signup" element={<AgentSignup />} />
        </Routes>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      {/* Landing always visible as background */}
      <Home />

      {/* Auth modals rendered conditionally on top */}
      {location.pathname === '/login' && <LoginPage />}
      {location.pathname === '/signup' && <Signup />}
      {location.pathname === '/agent-signup' && <AgentSignup />}
    </AuthProvider>
  )
}

export default App
