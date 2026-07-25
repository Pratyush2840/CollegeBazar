import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';

const styles = `
  .seller-product-page { max-width: 1000px; margin: 40px auto; padding: 32px; background: linear-gradient(180deg, #ffffff, #f8f9fa); border-radius: 16px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
  .dark-mode .seller-product-page { background: linear-gradient(180deg, #2d2d2d, #252525); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
  .seller-product-page-container { display: grid; gap: 32px; }
  .product-container { display: flex; gap: 32px; background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .dark-mode .product-container { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .product-image { flex: 1; max-width: 400px; }
  .product-image img { width: 100%; height: auto; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .product-details { flex: 1; display: flex; flex-direction: column; gap: 16px; }
  .product-details h1 { font-size: 2rem; font-weight: 800; color: #2d2d2d; margin: 0; }
  .dark-mode .product-details h1 { color: #e0e0e0; }
  .product-details p { font-size: 1.1rem; color: #555; margin: 0; }
  .dark-mode .product-details p { color: #ccc; }
  .product-details p span { font-weight: 600; color: #2d2d2d; }
  .dark-mode .product-details p span { color: #e0e0e0; }
  .product-status { display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 0.95rem; font-weight: 600; text-transform: capitalize; }
  .status-active { background: #e6ffed; color: #2e7d32; }
  .status-sold { background: #e3f2fd; color: #1e88e5; }
  .status-expired { background: #fef2f2; color: #d32f2f; }
  .status-pending { background: #fff3e0; color: #f57c00; }
  .dark-mode .status-active { background: #1b5e20; color: #a5d6a7; }
  .dark-mode .status-sold { background: #1565c0; color: #90caf9; }
  .dark-mode .status-expired { background: #b71c1c; color: #ef9a9a; }
  .dark-mode .status-pending { background: #e65100; color: #ffcc80; }
  /* New styles for buyer section */
  .buyer-container { background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .dark-mode .buyer-container { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .buyer-container h2 { font-size: 1.8rem; font-weight: 700; color: #2d2d2d; margin-bottom: 16px; }
  .dark-mode .buyer-container h2 { color: #e0e0e0; }
  .buyer-details { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #e3f2fd; border-radius: 8px; }
  .dark-mode .buyer-details { background: #1565c0; }
  .buyer-field { display: flex; align-items: center; gap: 8px; font-size: 1rem; color: #2d2d2d; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; }
  .dark-mode .buyer-field { color: #e0e0e0; border-bottom: 1px solid #444; }
  .buyer-field span { font-weight: 600; color: #1e88e5; min-width: 100px; }
  .dark-mode .buyer-field span { color: #90caf9; }
  .no-buyer { font-size: 1.1rem; color: #555; text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px; }
  .dark-mode .no-buyer { color: #ccc; background: #333; }
  .management-container, .bids-container, .queries-container { background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .dark-mode .management-container, .dark-mode .bids-container, .dark-mode .queries-container { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .management-container h2, .bids-container h2, .queries-container h2 { font-size: 1.8rem; font-weight: 700; color: #2d2d2d; margin-bottom: 16px; }
  .dark-mode .management-container h2, .dark-mode .bids-container h2, .dark-mode .queries-container h2 { color: #e0e0e0; }
  .management-actions, .query-actions { display: flex; flex-direction: column; gap: 16px; }
  .input-group { display: flex; flex-direction: column; gap: 8px; }
  .input-group label { font-size: 1.1rem; font-weight: 600; color: #2d2d2d; }
  .dark-mode .input-group label { color: #e0e0e0; }
  input, textarea { padding: 12px; font-size: 1rem; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; color: #2d2d2d; width: 100%; transition: border-color 0.3s, box-shadow 0.3s; }
  .dark-mode input, .dark-mode textarea { border-color: #555; background: #333; color: #e0e0e0; }
  input:focus, textarea:focus { outline: none; border-color: #ff4757; box-shadow: 0 0 8px rgba(255,71,87,0.3); }
  .dark-mode input:focus, .dark-mode textarea:focus { border-color: #61dafb; box-shadow: 0 0 8px rgba(97,218,251,0.3); }
  .error { border-color: #e41e3f !important; }
  .error-message { color: #e41e3f; font-size: 0.9rem; margin-top: 8px; }
  .success-message { color: #43a047; font-size: 0.9rem; margin-top: 8px; }
  textarea { resize: vertical; min-height: 100px; }
  .bids-list, .queries-list { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; }
  .no-bids, .no-queries { font-size: 1.1rem; color: #555; text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px; }
  .dark-mode .no-bids, .dark-mode .no-queries { color: #ccc; background: #333; }
  .bid, .query { background: #f8f9fa; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .dark-mode .bid, .dark-mode .query { background: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .bid p, .query p { font-size: 1rem; color: #2d2d2d; margin: 0 0 12px; }
  .dark-mode .bid p, .dark-mode .query p { color: #e0e0e0; }
  .query-actions { display: flex; flex-direction: column; gap: 12px; }
  .btn.disabled { background: linear-gradient(45deg, #cccccc, #d9d9d9); color: #666666; cursor: not-allowed; box-shadow: none; }
  .dark-mode .btn.disabled { background: linear-gradient(45deg, #444444, #555555); color: #888888; box-shadow: none; }
  .btn.disabled:hover { background: linear-gradient(45deg, #cccccc, #d9d9d9); transform: none; box-shadow: none; }
  .dark-mode .btn.disabled:hover { background: linear-gradient(45deg, #444444, #555555); transform: none; box-shadow: none; }
  .btn { background: linear-gradient(45deg, #ff4757, #ff6b7b); color: #ffffff; padding: 12px 24px; font-size: 1rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(255,71,87,0.3); }
  .btn:hover { background: linear-gradient(45deg, #ff2e43, #ff5b6b); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,71,87,0.5); }
  .btn.secondary { background: linear-gradient(45deg, #e3f2fd, #bbdefb); color: #1e88e5; box-shadow: 0 2px 8px rgba(30,136,229,0.3); }
  .btn.secondary:hover { background: linear-gradient(45deg, #bbdefb, #90caf9); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(30,136,229,0.5); }
  .btn.danger { background: linear-gradient(45deg, #e41e3f, #ff4d6a); color: #ffffff; box-shadow: 0 2px 8px rgba(228,30,63,0.3); }
  .btn.danger:hover { background: linear-gradient(45deg, #cc1a36, #e63956); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(228,30,63,0.5); }
  .dark-mode .btn { background: linear-gradient(45deg, #61dafb, #7be6ff); color: #121212; box-shadow: 0 2px 8px rgba(97,218,251,0.3); }
  .dark-mode .btn:hover { background: linear-gradient(45deg, #4ccaf9, #69d6ff); box-shadow: 0 4px 12px rgba(97,218,251,0.5); }
  .dark-mode .btn.secondary { background: linear-gradient(45deg, #2a2a2a, #3a3a3a); color: #e0e0e0; box-shadow: 0 2px 8px rgba(255,255,255,0.2); }
  .dark-mode .btn.secondary:hover { background: linear-gradient(45deg, #3a3a3a, #4a4a4a); box-shadow: 0 4px 12px rgba(255,255,255,0.3); }
  .dark-mode .btn.danger { background: linear-gradient(45deg, #e41e3f, #ff4d6a); color: #ffffff; box-shadow: 0 2px 8px rgba(228,30,63,0.3); }
  .dark-mode .btn.danger:hover { background: linear-gradient(45deg, #cc1a36, #e63956); box-shadow: 0 4px 12px rgba(228,30,63,0.5); }
  .loading, .error { text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px; }
  .dark-mode .loading, .dark-mode .error { background: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  @media (max-width: 768px) { 
    .seller-product-page { margin: 24px 16px; padding: 24px; } 
    .product-container, .buyer-container { flex-direction: column; gap: 24px; } 
    .product-image { max-width: 100%; } 
    .product-details h1, .buyer-container h2 { font-size: 1.8rem; } 
    .management-container h2, .bids-container h2, .queries-container h2 { font-size: 1.6rem; } 
    .management-actions { gap: 12px; } 
    .btn { width: 100%; } 
    .buyer-field { flex-direction: column; align-items: flex-start; gap: 4px; }
  }
  @media (max-width: 480px) { 
    .product-details h1, .buyer-container h2 { font-size: 1.6rem; } 
    .product-details p, .buyer-field { font-size: 0.95rem; } 
    .management-container h2, .bids-container h2, .queries-container h2 { font-size: 1.4rem; } 
    input, textarea { font-size: 0.9rem; } 
    .btn { font-size: 0.9rem; padding: 10px; } 
  }
`;

const SellerProductPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productId = params.get('product_id') || 'Unknown Product';
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: productId,
    title: 'Not found',
    description: 'Loading...',
    price: 0,
    image: '/assets/default.png',
    status: 'loading',
  });
  const [buyer, setBuyer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState({});
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [bids, setBids] = useState([]);
  const [queries, setQueries] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [replyErrors, setReplyErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const productResponse = await fetch(API_URL + `/api/seller/get-product-by-id/${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch product: ${productResponse.status}`);
        }

        const productData = await productResponse.json();
        const foundProduct = productData.product;
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct({
          id: foundProduct.product_id,
          title: foundProduct.name,
          description: foundProduct.description || 'No description available.',
          price: foundProduct.asking_price || 0,
          image: foundProduct.image || '/assets/default.png',
          status: foundProduct.status || 'unknown',
        });
        setEditProduct({
          name: foundProduct.name,
          description: foundProduct.description || '',
          asking_price: foundProduct.asking_price || '',
          image: foundProduct.image || '',
        });

        // Fetch buyer details if status is 'sold'
        if (foundProduct.status === 'sold') {
          const buyerResponse = await fetch(API_URL + `/api/bid/get-buyer?product_id=${productId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
          });

          if (!buyerResponse.ok) {
            if (buyerResponse.status !== 404) {
              console.warn(`Failed to fetch buyer: ${buyerResponse.status}`);
            }
            setBuyer(null);
          } else {
            const buyerData = await buyerResponse.json();
            setBuyer(buyerData.buyer || null);
          }
        }

        // Fetch bids
        const bidsResponse = await fetch(API_URL + `/api/bid/product/${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!bidsResponse.ok) {
          throw new Error(`Failed to fetch bids: ${bidsResponse.status}`);
        }

        const bidsData = await bidsResponse.json();
        setBids(bidsData.bids || []);

        // Fetch queries
        const queriesResponse = await fetch(API_URL + `/api/query/${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!queriesResponse.ok) {
          if (queriesResponse.status === 404) {
            setQueries([]);
          } else {
            throw new Error(`Failed to fetch queries: ${queriesResponse.status}`);
          }
        } else {
          const queriesData = await queriesResponse.json();
          setQueries(queriesData.otherQueries || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    setEditError('');
    setEditSuccess('');
    if (!editProduct.name || !editProduct.asking_price || isNaN(parseFloat(editProduct.asking_price))) {
      setEditError('Please provide valid name and asking price.');
      return;
    }

    try {
      const response = await fetch(API_URL + `/api/seller/edit-product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          name: editProduct.name,
          description: editProduct.description,
          asking_price: parseFloat(editProduct.asking_price),
          image: editProduct.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      setProduct({
        id: updatedProduct.product.product_id,
        title: updatedProduct.product.name,
        description: updatedProduct.product.description || 'No description available.',
        price: updatedProduct.product.asking_price || 0,
        image: updatedProduct.product.image || '/assets/default.png',
        status: updatedProduct.product.status || 'unknown',
      });
      setEditSuccess('Product updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Edit error:', err);
      setEditError(err.message || 'Failed to update product.');
    }
  };

  const deleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(API_URL + `/api/seller/delete-product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      navigate('/seller/dashboard');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete product.');
    }
  };

  const respondToQuery = async (queryId) => {
    const reply = replyInputs[queryId]?.trim();
    if (!reply) {
      setReplyErrors((prev) => ({ ...prev, [queryId]: 'Reply cannot be empty.' }));
      return;
    }

    try {
      const response = await fetch(API_URL + `/api/query/respond/${queryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ reply }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to respond to query');
      }

      const data = await response.json();
      setQueries((prev) =>
        prev.map((q) =>
          q.query_id === queryId ? { ...q, reply: data.query.reply } : q
        )
      );
      setReplyInputs((prev) => ({ ...prev, [queryId]: '' }));
      setReplyErrors((prev) => ({ ...prev, [queryId]: '' }));
    } catch (err) {
      console.error('Reply error:', err);
      setReplyErrors((prev) => ({
        ...prev,
        [queryId]: err.message || 'Failed to respond to query.',
      }));
    }
  };

  const isActive = product.status === 'active';

  if (loading) return (
    <main className="seller-product-page">
      <div className="loading">Loading...</div>
      <style>{styles}</style>
    </main>
  );
  if (error) return (
    <main className="seller-product-page">
      <div className="error">Error: {error}</div>
      <style>{styles}</style>
    </main>
  );

  return (
    <main className="seller-product-page">
      <div className="seller-product-page-container">
        <section className="product-container">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-details">
            <h1>{product.title}</h1>
            <p><span>Description:</span> {product.description}</p>
            <p><span>Asking Price:</span> ₹{product.price.toLocaleString()}</p>
            <p>
              <span>Status:</span> 
              <span className={`product-status status-${product.status.replace('approval-pending', 'pending')}`}>
                {product.status.replace('approval-pending', 'Pending Approval')}
              </span>
            </p>
          </div>
        </section>
        {/* New Buyer Section */}
        {product.status === 'sold' && (
          <section className="buyer-container">
            <h2>Buyer Details</h2>
            {buyer ? (
              <div className="buyer-details">
                <div className="buyer-field">
                  <span>Name:</span> {buyer.buyer_name || 'Anonymous'}
                </div>
                <div className="buyer-field">
                  <span>Roll No:</span> {buyer.roll_no || 'N/A'}
                </div>
                <div className="buyer-field">
                  <span>Email:</span> {buyer.email || 'N/A'}
                </div>
              </div>
            ) : (
              <p className="no-buyer">No buyer details available.</p>
            )}
          </section>
        )}
        <section className="management-container">
          <h2>Manage Product</h2>
          {editMode ? (
            <div className="management-actions">
              <div className="input-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditChange}
                  className={editError ? 'error' : ''}
                />
              </div>
              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditChange}
                  className={editError ? 'error' : ''}
                />
              </div>
              <div className="input-group">
                <label htmlFor="asking_price">Asking Price (₹)</label>
                <input
                  type="number"
                  id="asking_price"
                  name="asking_price"
                  value={editProduct.asking_price}
                  onChange={handleEditChange}
                  className={editError ? 'error' : ''}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="input-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={editProduct.image}
                  onChange={handleEditChange}
                  className={editError ? 'error' : ''}
                />
              </div>
              {editError && <p className="error-message">{editError}</p>}
              {editSuccess && <p className="success-message">{editSuccess}</p>}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn" onClick={saveEdit}>Save Changes</button>
                <button className="btn secondary" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="management-actions">
              <button 
                className={`btn ${!isActive ? 'disabled' : ''}`} 
                onClick={() => isActive && setEditMode(true)} 
                disabled={!isActive}
              >
                Edit Product
              </button>
              <button 
                className={`btn danger ${!isActive ? 'disabled' : ''}`} 
                onClick={() => isActive && deleteProduct()} 
                disabled={!isActive}
              >
                Delete Product
              </button>
            </div>
          )}
        </section>
        <section className="bids-container">
          <h2>Bids on Your Product</h2>
          <div className="bids-list">
            {bids.length === 0 ? (
              <p className="no-bids">No bids yet.</p>
            ) : (
              bids.map((bid) => (
                <div key={bid.bid_id} className="bid">
                  <p><strong>Bidder:</strong> {bid.bidder_name || 'Anonymous'}</p>
                  <p><strong>Amount:</strong> ₹{bid.amount.toLocaleString()}</p>
                  <p><strong>Roll No:</strong> {bid.roll_no || 'N/A'}</p>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="queries-container">
          <h2>Queries on Your Product</h2>
          <div className="queries-list">
            {queries.length === 0 ? (
              <p className="no-queries">No queries yet.</p>
            ) : (
              queries.map((query) => (
                <div key={query.query_id} className="query">
                  <p><strong>Customer:</strong> {query.customer_name || 'Anonymous'}</p>
                  <p><strong>Query:</strong> {query.query}</p>
                  {query.reply ? (
                    <p><strong>Your Reply:</strong> {query.reply}</p>
                  ) : (
                    <div className="query-actions">
                      <textarea
                        placeholder="Type your reply..."
                        value={replyInputs[query.query_id] || ''}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({
                            ...prev,
                            [query.query_id]: e.target.value,
                          }))
                        }
                        className={replyErrors[query.query_id] ? 'error' : ''}
                        rows="3"
                      />
                      {replyErrors[query.query_id] && (
                        <p className="error-message">{replyErrors[query.query_id]}</p>
                      )}
                      <button
                        className="btn"
                        onClick={() => respondToQuery(query.query_id)}
                      >
                        Submit Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      <style>{styles}</style>
    </main>
  );
};

export default SellerProductPage;