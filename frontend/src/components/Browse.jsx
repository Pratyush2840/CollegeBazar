import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../config.js';

export default function Browse() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const categories = ['All', 'Electronics', 'Textbooks', 'Furniture', 'Accessories', 'Miscellaneous'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products from /api/seller...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
        console.log(API_URL + '/api/seller/get-active-products');
        const response = await fetch(API_URL + '/api/seller/get-active-products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Fetch error:', err.message);
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check if the backend server is running.');
        } else {
          setError(err.message || 'Failed to fetch products. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredListings = products.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  ).filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  return (
    <main className="browse-page">
      <div className="browse-search">
        <input
          type="text"
          placeholder="Search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="button" className="search-btn" aria-label="Search">🔍</button>
      </div>

      <div className="browse-body">
        <aside className={`filters-panel ${filtersOpen ? "open" : "closed"}`}>
          <button type="button" className="filters-header" onClick={() => setFiltersOpen(!filtersOpen)}>
            <span>Filters</span>
            <span className={`chevron ${filtersOpen ? "up" : "down"}`}>▾</span>
          </button>
          {filtersOpen && (
            <div className="filters-body">
              <p className="filters-subtitle">Choose a category as per your buying needs</p>
              {categories.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={selectedCategory === cat}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          )}
        </aside>

        <div className="listing-area">
          {loading ? (
            <div className="status-box"><p>Loading products...</p></div>
          ) : error ? (
            <div className="status-box"><span className="status-icon">⚠️</span><p>{error}</p></div>
          ) : filteredListings.length === 0 ? (
            <div className="status-box"><span className="status-icon">🚫</span><p>No products found.</p></div>
          ) : (
            <div className="listing-grid">
              {filteredListings.map((item) => (
                <Link
                  key={item.product_id}
                  to={`/product?product_id=${encodeURIComponent(item.product_id)}`}
                  className="listing-card"
                >
                  <div className="image-container">
                    <img src={item.image} alt={item.name} />
                    <span className="category-badge">{item.category}</span>
                  </div>
                  <div className="card-content">
                    <h2>{item.name}</h2>
                    <p className="price">₹{item.asking_price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
        .browse-page {
          min-height: 100vh;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          margin-top: -3rem;
          margin-bottom: -3rem;
          padding: 32px;
          background-color: #12141c;
          background-image:
            linear-gradient(30deg, #1c1f2b 12%, transparent 12.5%, transparent 87%, #1c1f2b 87.5%, #1c1f2b),
            linear-gradient(150deg, #1c1f2b 12%, transparent 12.5%, transparent 87%, #1c1f2b 87.5%, #1c1f2b),
            linear-gradient(30deg, #1c1f2b 12%, transparent 12.5%, transparent 87%, #1c1f2b 87.5%, #1c1f2b),
            linear-gradient(150deg, #1c1f2b 12%, transparent 12.5%, transparent 87%, #1c1f2b 87.5%, #1c1f2b),
            linear-gradient(60deg, #191c26 25%, transparent 25.5%, transparent 75%, #191c26 75%, #191c26),
            linear-gradient(60deg, #191c26 25%, transparent 25.5%, transparent 75%, #191c26 75%, #191c26);
          background-size: 80px 140px;
          background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
        }

        .browse-search {
          max-width: 900px;
          margin: 0 auto 24px;
          display: flex;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .search-input {
          flex: 1;
          padding: 16px 20px;
          font-size: 1rem;
          border: none;
          background: #ffffff;
          color: #1f2937;
        }

        .search-input:focus {
          outline: none;
        }

        .search-btn {
          padding: 0 24px;
          background: #1d4ed8;
          border: none;
          color: #ffffff;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-btn:hover {
          background: #1e40af;
        }

        .browse-body {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          max-width: 1280px;
          margin: 0 auto;
        }

        .filters-panel {
          width: 260px;
          flex-shrink: 0;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .filters-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
        }

        .chevron {
          transition: transform 0.2s ease;
        }

        .chevron.up {
          transform: rotate(180deg);
        }

        .filters-body {
          padding: 0 20px 20px;
        }

        .filters-subtitle {
          font-size: 0.85rem;
          color: #6b7280;
          margin: 0 0 16px;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          font-size: 0.95rem;
          color: #1f2937;
          cursor: pointer;
        }

        .filter-option input {
          accent-color: #1d4ed8;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .listing-area {
          flex: 1;
          min-width: 0;
        }

        .status-box {
          text-align: center;
          padding: 60px 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .status-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 16px;
        }

        .status-box p {
          font-size: 1.1rem;
          color: #e5e7eb;
        }

        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .listing-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          aspect-ratio: 3 / 4;
          display: block;
          background: #1f2937;
        }

        .listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #d97706;
          color: #ffffff;
          padding: 5px 12px;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0));
        }

        .card-content h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px;
        }

        .price {
          font-size: 1rem;
          font-weight: 600;
          color: #93c5fd;
          margin: 0;
        }

        @media (max-width: 768px) {
          .browse-page {
            margin-top: -2rem;
            margin-bottom: -2rem;
            padding: 20px 16px;
          }

          .browse-body {
            flex-direction: column;
          }

          .filters-panel {
            width: 100%;
          }

          .listing-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
          }
        }
      `}
      </style>
    </main>
  );
}
