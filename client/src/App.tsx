import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import DashboardPage from './pages/DashboardPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import WalletContextProvider from './contexts/WalletContextProvider'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="text-gray-300 p-6">Loading...</div>
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <WalletContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<FeedPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </WalletContextProvider>
  )
}

export default App
