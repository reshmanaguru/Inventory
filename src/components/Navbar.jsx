import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="brand-inline">
          <span className="brand-dot" />
          <div>
            <p className="eyebrow">Operations</p>
            <h2>Inventory Pulse</h2>
          </div>
        </div>
      </div>

      <div className="topbar__right">
        <div className="user-chip">
          <span className="avatar">{user?.name?.charAt(0) || 'U'}</span>
          <div>
            <strong>{user?.name || 'User'}</strong>
            <small>{user?.email || 'member'}</small>
          </div>
        </div>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
