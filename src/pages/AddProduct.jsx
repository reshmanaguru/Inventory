import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const initialState = {
  name: '',
  description: '',
  category: 'Electronics',
  price: '',
  stock: '',
  image: '',
  favorite: false,
}

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialState)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      })
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell narrow-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Add new product</h2>
        </div>
      </div>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Product name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Electronics</option>
              <option>Home</option>
              <option>Office</option>
              <option>Accessories</option>
              <option>Apparel</option>
            </select>
          </label>

          <label>
            Price
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          </label>

          <label>
            Stock
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
          </label>

          <label className="full-width">
            Description
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} required />
          </label>

          <label className="full-width">
            Image URL
            <input name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://..." required />
          </label>

          <label className="check-row full-width">
            <input name="favorite" type="checkbox" checked={form.favorite} onChange={handleChange} />
            Mark as favorite
          </label>
        </div>

        {error ? <p className="auth-error">{error}</p> : null}

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate('/products')}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save product'}
          </button>
        </div>
      </form>
    </div>
  )
}
