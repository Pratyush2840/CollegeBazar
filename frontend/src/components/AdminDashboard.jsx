import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';

const styles = `
  .admin-page { max-width: 1200px; margin: 40px auto; padding: 32px; background: linear-gradient(180deg, #ffffff, #f8f9fa); border-radius: 16px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
  .dark-mode .admin-page { background: linear-gradient(180deg, #2d2d2d, #252525); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
  .admin-container { display: flex; flex-direction: column; gap: 32px; }
  .login-container, .dashboard-container { background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .dark-mode .login-container, .dark-mode .dashboard-container { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .login-container h1, .dashboard-container h1 { font-size: 2rem; font-weight: 800; color: #2d2d2d; margin-bottom: 24px; text-align: center; }
  .dark-mode .login-container h1, .dark-mode .dashboard-container h1 { color: #e0e0e0; }
  .login-form { display: flex; flex-direction: column; gap: 16px; max-width: 400px; margin: 0 auto; }
  .input-group { display: flex; flex-direction: column; gap: 8px; }
  .input-group label { font-size: 1.1rem; font-weight: 600; color: #2d2d2d; }
  .dark-mode .input-group label { color: #e0e0e0; }
  input { padding: 12px; font-size: 1rem; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; color: #2d2d2d; width: 100%; transition: border-color 0.3s, box-shadow 0.3s; }
  .dark-mode input { border-color: #555; background: #333; color: #e0e0e0; }
  input:focus { outline: none; border-color: #ff4757; box-shadow: 0 0 8px rgba(255,71,87,0.3); }
  .dark-mode input:focus { border-color: #61dafb; box-shadow: 0 0 8px rgba(97,218,251,0.3); }
  .error { border-color: #e41e3f !important; }
  .error-message, .success-message { font-size: 0.9rem; margin-top: 8px; text-align: center; }
  .error-message { color: #e41e3f; }
  .success-message { color: #43a047; }
  .btn { background: linear-gradient(45deg, #ff4757, #ff6b7b); color: #ffffff; padding: 12px 24px; font-size: 1rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(255,71,87,0.3); }
  .btn:hover { background: linear-gradient(45deg, #ff2e43, #ff5b6b); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,71,87,0.5); }
  .dark-mode .btn { background: linear-gradient(45deg, #61dafb, #7be6ff); color: #121212; box-shadow: 0 2px 8px rgba(97,218,251,0.3); }
  .dark-mode .btn:hover { background: linear-gradient(45deg, #4ccaf9, #69d6ff); box-shadow: 0 4px 12px rgba(97,218,251,0.5); }
  .products-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 24px; }
  .product-card { background: #f8f9fa; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 12px; }
  .dark-mode .product-card { background: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .product-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; }
  .product-card h3 { font-size: 1.5rem; font-weight: 700; color: #2d2d2d; margin: 0; }
  .dark-mode .product-card h3 { color: #e0e0e0; }
  .product-card p { font-size: 1rem; color: #555; margin: 0; }
  .dark-mode .product-card p { color: #ccc; }
  .product-actions { display: flex; gap: 12px; justify-content: flex-end; }
  .btn.secondary { background: linear-gradient(45deg, #e3f2fd, #bbdefb); color: #1e88e5; box-shadow: 0 2px 8px rgba(30,136,229,0.3); }
  .btn.secondary:hover { background: linear-gradient(45deg, #bbdefb, #90caf9); box-shadow: 0 4px 12px rgba(30,136,229,0.5); }
  .dark-mode .btn.secondary { background: linear-gradient(45deg, #2a2a2a, #3a3a3a); color: #e0e0e0; box-shadow: 0 2px 8px rgba(255,255,255,0.2); }
  .dark-mode .btn.secondary:hover { background: linear-gradient(45deg, #3a3a3a, #4a4a4a); box-shadow: 0 4px 12px rgba(255,255,255,0.3); }
  .loading, .error { text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px; }
  .dark-mode .loading, .dark-mode .error { background: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  @media (max-width: 768px) { .admin-page { margin: 24px 16px; padding: 24px; } .products-list { grid-template-columns: 1fr; } }
  @media (max-width: 480px) { .login-container h1, .dashboard-container h1 { font-size: 1.8rem; } .input-group label { font-size: 1rem; } input { font-size: 0.9rem; } .btn { font-size: 0.9rem; padding: 10px; } .product-card h3 { font-size: 1.3rem; } .product-card p { font-size: 0.9rem; } }
`;

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchPendingProducts();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoading(true);

    try {
      const response = await fetch(API_URL + '/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      setLoginSuccess('Logged in successfully!');
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } catch (err) {
      setLoginError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL + '/api/admin/approval-pending-products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch approval-pending products');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL + '/api/admin/approve-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
        body: JSON.stringify({ product_id: productId, status: 'active' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve product');
      }

      setProducts(products.filter((product) => product.product_id !== productId));
    } catch (err) {
      setError(err.message || 'Failed to approve product');
    } finally {
      setLoading(false);
    }
  };

  const handleDisapprove = async (productId) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL + '/api/admin/approve-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
        body: JSON.stringify({ product_id: productId, status: 'disapproved' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to disapprove product');
      }

      setProducts(products.filter((product) => product.product_id !== productId));
    } catch (err) {
      setError(err.message || 'Failed to disapprove product');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setProducts([]);
    navigate('/admin');
  };

  if (loading) return (
    <main className="admin-page">
      <div className="loading">Loading...</div>
      <style>{styles}</style>
    </main>
  );

  if (error) return (
    <main className="admin-page">
      <div className="error">Error: {error}</div>
      <style>{styles}</style>
    </main>
  );

  if (!isLoggedIn) {
    return (
      <main className="admin-page">
        <div className="login-container">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={loginError ? 'error' : ''}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={loginError ? 'error' : ''}
                placeholder="Enter password"
                required
              />
            </div>
            {loginError && <p className="error-message">{loginError}</p>}
            {loginSuccess && <p className="success-message">{loginSuccess}</p>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <style>{styles}</style>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Approval Pending Products</h1>
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        </div>
        {products.length === 0 ? (
          <p className="no-comments">No approval-pending products found.</p>
        ) : (
          <div className="products-list">
            {products.map((product) => (
              <div key={product.product_id} className="product-card">
                <img src={product.image || '/assets/default.png'} alt={product.name} />
                <h3>{product.name}</h3>
                <p><strong>Description:</strong> {product.description || 'No description available'}</p>
                <p><strong>Asking Price:</strong> ₹{product.asking_price?.toLocaleString() || 'N/A'}</p>
                <div className="product-actions">
                  <button
                    className="btn"
                    onClick={() => handleApprove(product.product_id)}
                    disabled={loading}
                  >
                    Approve
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => handleDisapprove(product.product_id)}
                    disabled={loading}
                  >
                    Disapprove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{styles}</style>
    </main>
  );
};

export default AdminDashboard;