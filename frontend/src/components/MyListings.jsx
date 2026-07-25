import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config.js';

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's listings
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your listings');
        }

        const response = await fetch(API_URL + '/api/seller/my-listings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while fetching your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  return (
    <main className="my-listings-page">
      <h1>My Listings</h1>

      {loading ? (
        <div className="loading">
          <p>Loading your listings...</p>
        </div>
      ) : error ? (
        <div className="error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <span className="no-products-icon">🚫</span>
          <p>You have no listings. <Link to="/post">Post an item</Link> to get started!</p>
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
                <p className="price">₹{item.asking_price.toLocaleString()}</p>
                <div className="button-group">
                  <Link
                    to={`/seller/product?product_id=${item.product_id}`}
                    className="btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx="true">{`
        .my-listings-page {
          max-width: 1200px;
          margin: 40px auto;
          padding: 32px;
          background: linear-gradient(180deg, #ffffff, #f8f9fa);
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .my-listings-page {
          background: linear-gradient(180deg, #2d2d2d, #252525);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          text-align: center;
          margin-bottom: 40px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .dark-mode h1 {
          color: #e0e0e0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
          color: #ff4757;
          text-decoration: none;
          font-weight: 600;
        }

        .no-products a:hover {
          text-decoration: underline;
        }

        .dark-mode .no-products a {
          color: #61dafb;
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
          padding-top: 75%; /* 4:3 aspect ratio */
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
          background: #ff4757;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
        }

        .dark-mode .category-badge {
          background: #61dafb;
          color: #121212;
          box-shadow: 0 2px 8px rgba(97, 218, 251, 0.3);
        }

        .card-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
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
          color: #ff4757;
          margin: 0;
        }

        .dark-mode .price {
          color: #61dafb;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        .btn {
          flex: 1;
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          color: #ffffff;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
          cursor: pointer;
        }

        .btn:hover {
          background: linear-gradient(45deg, #ff2e43, #ff5b6b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
        }

        .dark-mode .btn {
          background: linear-gradient(45deg, #61dafb, #7be6ff);
          color: #121212;
          box-shadow: 0 2px 8px rgba(97, 218, 251, 0.3);
        }

        .dark-mode .btn:hover {
          background: linear-gradient(45deg, #4ccaf9, #69d6ff);
          box-shadow: 0 4px 12px rgba(97, 218, 251, 0.5);
        }

        @media (max-width: 768px) {
          .my-listings-page {
            margin: 24px 16px;
            padding: 24px;
          }

          h1 {
            font-size: 2rem;
          }

          .listing-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.8rem;
          }

          .card-content h2 {
            font-size: 1.2rem;
          }

          .price {
            font-size: 1.1rem;
          }

          .btn {
            font-size: 0.9rem;
            padding: 10px;
          }
        }
      `}</style>
    </main>
  );
}