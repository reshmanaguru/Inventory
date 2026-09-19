import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('inventory-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async ({ email, password }) => {
    const response = await api.post('/login', { email, password })
    const userData = response.data.user || response.data
    setUser(userData)
    localStorage.setItem('inventory-user', JSON.stringify(userData))
    return userData
  }

  const signup = async ({ name, email, password }) => {
    const response = await api.post('/signup', { name, email, password })
    const userData = response.data.user || response.data
    setUser(userData)
    localStorage.setItem('inventory-user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('inventory-user')
  }

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
