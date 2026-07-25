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
      <h1>Browse Listings</h1>
      <div className="filter-bar">
        <div className="search-group">
          <input type="text" placeholder="Search listings..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        </div>
        <div className="category-group">
          <label htmlFor="category">Filter by Category:</label>
          <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="loading"><p>Loading products...</p></div>
      ) : error ? (
        <div className="error"><span className="error-icon">⚠️</span><p>{error}</p></div>
      ) : filteredListings.length === 0 ? (
        <div className="no-products"><span className="no-products-icon">🚫</span><p>No products found.</p></div>
      ) : (
        <div className="listing-grid">
          {filteredListings.map((item) => (
            <div key={item.id} className="listing-card">
              <div className="image-container">
                <img src={item.image} alt={item.name} />
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="card-content">
                <h2>{item.name}</h2>
                <p className="price">₹{item.asking_price.toLocaleString()}</p>
                <Link to={`/product?product_id=${encodeURIComponent(item.product_id)}`} className="btn">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>
        {`
        .browse-page { max-width: 1200px; margin: 40px auto; padding: 32px; background: linear-gradient(180deg, #ffffff, #f8f9fa); border-radius: 16px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
        .dark-mode .browse-page { background: linear-gradient(180deg, #2d2d2d, #252525); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
        h1 { font-size: 2.5rem; font-weight: 800; color: #2d2d2d; text-align: center; margin-bottom: 40px; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .dark-mode h1 { color: #e0e0e0; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        .filter-bar { display: flex; flex-wrap: wrap; gap: 24px; margin-bottom: 32px; align-items: center; }
        .search-group, .category-group { display: flex; align-items: center; gap: 12px; }
        .category-group label { font-size: 1.1rem; font-weight: 600; color: #2d2d2d; }
        .dark-mode .category-group label { color: #e0e0e0; }
        .search-input, select { padding: 12px; font-size: 1rem; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; color: #2d2d2d; transition: border-color 0.3s, box-shadow 0.3s; min-width: 200px; }
        .dark-mode .search-input, .dark-mode select { border-color: #555; background: #333; color: #e0e0e0; }
        .search-input:focus, select:focus { outline: none; border-color: #ff4757; box-shadow: 0 0 8px rgba(255,71,87,0.3); }
        .dark-mode .search-input:focus, .dark-mode select:focus { border-color: #61dafb; box-shadow: 0 0 8px rgba(97,218,251,0.3); }
        .no-products, .loading, .error { text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .dark-mode .no-products, .dark-mode .loading, .dark-mode .error { background: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .no-products-icon, .error-icon { font-size: 2.5rem; display: block; margin-bottom: 16px; }
        .no-products p, .loading p, .error p { font-size: 1.2rem; color: #555; }
        .dark-mode .no-products p, .dark-mode .loading p, .dark-mode .error p { color: #ccc; }
        .listing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .listing-card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; flex-direction: column; }
        .listing-card:hover { transform: translateY(-4px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
        .dark-mode .listing-card { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .image-container { position: relative; width: 100%; padding-top: 75%; }
        .image-container img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .category-badge { position: absolute; top: 12px; right: 12px; background: #ff4757; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 0.9rem; font-weight: 600; box-shadow: 0 2px 8px rgba(255,71,87,0.3); }
        .dark-mode .category-badge { background: #61dafb; color: #121212; box-shadow: 0 2px 8px rgba(97,218,251,0.3); }
        .card-content { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
        .card-content h2 { font-size: 1.4rem; font-weight: 700; color: #2d2d2d; margin: 0; }
        .dark-mode .card-content h2 { color: #e0e0e0; }
        .price { font-size: 1.2rem; font-weight: 600; color: #ff4757; margin: 0; }
        .dark-mode .price { color: #61dafb; }
        .btn { background: linear-gradient(45deg, #ff4757, #ff6b7b); color: #ffffff; padding: 12px; font-size: 1rem; font-weight: 600; border: none; border-radius: 8px; text-align: center; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(255,71,87,0.3); margin-top: auto; }
        .btn:hover { background: linear-gradient(45deg, #ff2e43, #ff5b6b); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,71,87,0.5); }
        .dark-mode .btn { background: linear-gradient(45deg, #61dafb, #7be6ff); color: #121212; box-shadow: 0 2px 8px rgba(97,218,251,0.3); }
        .dark-mode .btn:hover { background: linear-gradient(45deg, #4ccaf9, #69d6ff); box-shadow: 0 4px 12px rgba(97,218,251,0.5); }
        @media (max-width: 768px) { .browse-page { margin: 24px 16px; padding: 24px; } h1 { font-size: 2rem; } .filter-bar { flex-direction: column; align-items: stretch; gap: 16px; } .search-input, select { min-width: 100%; } .listing-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { h1 { font-size: 1.8rem; } .category-group label { font-size: 1rem; } .search-input, select { font-size: 0.9rem; } .card-content h2 { font-size: 1.2rem; } .price { font-size: 1.1rem; } .btn { font-size: 0.9rem; padding: 10px; } }
      `}
      </style>
    </main>
  );
}