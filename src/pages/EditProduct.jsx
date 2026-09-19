import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'

export default function EditProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await api.get(`/products/${id}`)
      setForm(data)
    }

    fetchProduct()
  }, [id])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await api.put(`/products/${id}`, {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    })
    navigate('/products')
  }

  if (!form) {
    return <div className="loading-state">Loading product...</div>
  }

  return (
    <div className="page-shell narrow-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Edit product</h2>
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
            <input name="image" type="url" value={form.image} onChange={handleChange} required />
          </label>

          <label className="check-row full-width">
            <input name="favorite" type="checkbox" checked={form.favorite} onChange={handleChange} />
            Favorite product
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate('/products')}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Update product
          </button>
        </div>
      </form>
    </div>
  )
}
