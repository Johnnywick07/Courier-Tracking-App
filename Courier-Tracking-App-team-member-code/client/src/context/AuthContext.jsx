import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('courier_user')
    const token = localStorage.getItem('courier_token')
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('courier_token')
        localStorage.removeItem('courier_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('courier_token', data.token)
    localStorage.setItem('courier_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async ({ name, email, password, role }) => {
    const { data } = await api.post('/auth/register', { name, email, password, role })
    localStorage.setItem('courier_token', data.token)
    localStorage.setItem('courier_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('courier_token')
    localStorage.removeItem('courier_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
