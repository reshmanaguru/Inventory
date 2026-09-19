import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { api } from '../services/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category))]
    return ['All', ...unique]
  }, [products])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || product.category === category
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleToggleFavorite = async (id) => {
    const current = products.find((product) => product.id === id)
    if (!current) return

    try {
      const updated = await api.put(`/products/${id}`, {
        ...current,
        favorite: !current.favorite,
      })

      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updated.data : product)))
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Product list</h2>
        </div>

        <Link to="/add-product" className="primary-btn">
          + Add product
        </Link>
      </div>

      <div className="panel filters-panel">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : filteredProducts.length ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
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
          <h3>No products found</h3>
          <p>Try changing the category or search query.</p>
        </div>
      )}
    </div>
  )
}
