import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import { AuthProvider, useAuth } from './context/AuthContext'
import AddProduct from './pages/AddProduct'
import Dashboard from './pages/Dashboard'
import EditProduct from './pages/EditProduct'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Products from './pages/Products'
import Signup from './pages/Signup'
import './App.css'

function AppLayout() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-shell">
        <Navbar />
        <main className="main-area">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </AuthProvider>
  )
}

export default App
