import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config.js';

export default function BoughtProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoughtProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your bought products');
        }

        const response = await fetch(API_URL + '/api/bid/purchased', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bought products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while fetching your bought products');
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtProducts();
  }, []);

  return (
    <main className="bought-products-page">
      <h1>Bought Products</h1>

      {loading ? (
        <div className="loading">
          <p>Loading your bought products...</p>
        </div>
      ) : error ? (
        <div className="error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <span className="no-products-icon">🚫</span>
          <p>You haven't bought anything yet. <Link to="/browse">Browse listings</Link> to find something.</p>
        </div>
      ) : (
        <div className="listing-grid">
          {products.map((item) => (
            <div key={item.product_id} className="listing-card">
              <div className="image-container">
                <img src={item.image} alt={item.name} />
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="card-content">
                <h2>{item.name}</h2>
                <p className="price">₹{Number(item.purchase_price).toLocaleString()}</p>
                <p className="seller-info">Sold by {item.seller_name}</p>
                <Link
                  to={`/product?product_id=${item.product_id}`}
                  className="btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx="true">{`
        .bought-products-page {
          max-width: 1200px;
          margin: 40px auto;
          padding: 32px;
          background: linear-gradient(180deg, #ffffff, #f8f9fa);
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .bought-products-page {
          background: linear-gradient(180deg, #2d2d2d, #252525);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          text-align: center;
          margin-bottom: 40px;
        }

        .dark-mode h1 {
          color: #e0e0e0;
        }

        .no-products,
        .loading,
        .error {
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .no-products,
        .dark-mode .loading,
        .dark-mode .error {
          background: #333;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .no-products-icon,
        .error-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 16px;
        }

        .no-products p,
        .loading p,
        .error p {
          font-size: 1.2rem;
          color: #555;
        }

        .dark-mode .no-products p,
        .dark-mode .loading p,
        .dark-mode .error p {
          color: #ccc;
        }

        .no-products a {
          color: #1d4ed8;
          text-decoration: none;
          font-weight: 600;
        }

        .no-products a:hover {
          text-decoration: underline;
        }

        .dark-mode .no-products a {
          color: #60a5fa;
        }

        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .listing-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .dark-mode .listing-card {
          background: #2d2d2d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .image-container {
          position: relative;
          width: 100%;
          padding-top: 75%;
        }

        .image-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #1d4ed8;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .dark-mode .category-badge {
          background: #60a5fa;
          color: #121212;
        }

        .card-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-content h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2d2d2d;
          margin: 0;
        }

        .dark-mode .card-content h2 {
          color: #e0e0e0;
        }

        .price {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1d4ed8;
          margin: 0;
        }

        .dark-mode .price {
          color: #60a5fa;
        }

        .seller-info {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0 0 8px;
        }

        .dark-mode .seller-info {
          color: #cbd5e1;
        }

        .btn {
          background: #1d4ed8;
          color: #ffffff;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .btn:hover {
          background: #1e40af;
          transform: translateY(-2px);
        }

        .dark-mode .btn {
          background: #60a5fa;
          color: #121212;
        }

        .dark-mode .btn:hover {
          background: #3b82f6;
        }

        @media (max-width: 768px) {
          .bought-products-page {
            margin: 24px 16px;
            padding: 24px;
          }

          h1 {
            font-size: 2rem;
          }

          .listing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
