import { Link } from 'react-router-dom'

export default function ProductCard({ product, onDelete, onToggleFavorite }) {
  return (
    <article className={`product-card ${product.stock <= 10 ? 'product-card--low' : ''}`}>
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.name} className="product-card__image" />
      </div>

      <div className="product-card__content">
        <div className="product-card__topline">
          <span className="product-card__category">{product.category}</span>
          <button
            type="button"
            className={`favorite-btn ${product.favorite ? 'favorite-btn--active' : ''}`}
            onClick={() => onToggleFavorite(product.id)}
            aria-label={product.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {product.favorite ? '♥' : '♡'}
          </button>
        </div>

        <h3>{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__meta">
          <span>
            <strong>{product.stock}</strong> in stock
          </span>
          <span>
            <strong>${Number(product.price).toFixed(2)}</strong>
          </span>
        </div>

        <div className="product-card__actions">
          <Link to={`/products/edit/${product.id}`} className="secondary-btn">
            Edit
          </Link>
          <button type="button" className="danger-btn" onClick={() => onDelete(product.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
