import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import SignupPage from './pages/SignupPage'
import EmployersPage from './pages/EmployersPage'
import ResourcesPage from './pages/ResourcesPage'
import TrackerPage from './pages/TrackerPage'
import JobDetailPage from './pages/JobDetailPage'

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
