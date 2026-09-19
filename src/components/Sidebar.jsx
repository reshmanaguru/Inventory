import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '▣' },
  { to: '/products', label: 'Products', icon: '◫' },
  { to: '/favorites', label: 'Favorites', icon: '♡' },
  { to: '/add-product', label: 'Add Product', icon: '+' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-mark">IP</div>
        <div>
          <span className="sidebar__eyebrow">Control center</span>
          <h1>Inventory</h1>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              ['nav-link', isActive ? 'nav-link--active' : ''].join(' ')
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p>Stock level</p>
        <strong>Healthy</strong>
      </div>
    </aside>
  )
}
