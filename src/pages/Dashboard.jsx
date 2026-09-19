import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

const summaryCards = [
  { label: 'Total products', key: 'total' },
  { label: 'Low stock', key: 'lowStock' },
  { label: 'Favorites', key: 'favoriteCount' },
  { label: 'Revenue', key: 'revenue' },
]

export default function Dashboard() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get('/products')
      setProducts(data)
    }

    fetchData()
  }, [])

  const stats = useMemo(() => {
    const total = products.length
    const lowStock = products.filter((product) => product.stock <= 10).length
    const favoriteCount = products.filter((product) => product.favorite).length
    const revenue = products.reduce((sum, product) => sum + Number(product.price) * Number(product.stock), 0)

    return {
      total,
      lowStock,
      favoriteCount,
      revenue: `$${revenue.toFixed(2)}`,
    }
  }, [products])

  const recentProducts = [...products].slice(0, 5)

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
        <Link to="/add-product" className="primary-btn">
          + Add product
        </Link>
      </div>

      <div className="stats-grid">
        {summaryCards.map((card) => (
          <div key={card.key} className="panel stat-card">
            <p>{card.label}</p>
            <h3>{stats[card.key]}</h3>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="panel panel--large">
          <div className="mini-header">
            <h3>Recent products</h3>
            <Link to="/products">View all</Link>
          </div>

          <div className="simple-list">
            {recentProducts.map((product) => (
              <div key={product.id} className="list-row">
                <div className="list-row__left">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.category}</small>
                  </div>
                </div>

                <span className="stock-pill">{product.stock} left</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel panel--large">
          <div className="mini-header">
            <h3>Inventory health</h3>
          </div>

          <div className="health-box">
            <div className="ring-ring">
              <span>{Math.round((products.length ? (products.filter((p) => p.stock > 10).length / products.length) * 100 : 0))}%</span>
            </div>
            <div className="health-copy">
              <strong>Healthy stock</strong>
              <p>Most items are above the minimum threshold.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
