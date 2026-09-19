import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { api } from '../services/api'

export default function Favorites() {
  const [products, setProducts] = useState([])

  const fetchFavorites = async () => {
    const { data } = await api.get('/products')
    setProducts(data.filter((product) => product.favorite))
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`)
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  const handleToggleFavorite = async (id) => {
    const current = products.find((product) => product.id === id)
    if (!current) return

    const updated = await api.put(`/products/${id}`, {
      ...current,
      favorite: !current.favorite,
    })

    setProducts((prev) =>
      prev
        .map((product) => (product.id === id ? updated.data : product))
        .filter((product) => product.favorite),
    )
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Favorites</p>
          <h2>Starred items</h2>
        </div>
      </div>

      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No favorites yet</h3>
          <p>Tap the heart icon on any product to save it here.</p>
        </div>
      )}
    </div>
  )
}
