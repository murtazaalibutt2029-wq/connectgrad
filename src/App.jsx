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
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import MassApplyPage from './pages/MassApplyPage'
import OnboardingPage from './pages/OnboardingPage'
import EmployerSignupPage from './pages/EmployerSignupPage'
import EmployerDashboard from './pages/EmployerDashboard'

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/apply/review" element={<MassApplyPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/employer/signup" element={<EmployerSignupPage />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
