import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config.js';

const styles = `
  .product-page { max-width: 1000px; margin: 40px auto; padding: 32px; background: linear-gradient(180deg, #ffffff, #f8f9fa); border-radius: 16px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
  .dark-mode .product-page { background: linear-gradient(180deg, #2d2d2d, #252525); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
  .product-page-container { display: grid; gap: 32px; }
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
  /* New styles for status display */
  .product-status { display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 0.95rem; font-weight: 600; text-transform: capitalize; }
  .status-active { background: #e6ffed; color: #2e7d32; }
  .status-sold { background: #e3f2fd; color: #1e88e5; }
  .status-expired { background: #fef2f2; color: #d32f2f; }
  .status-pending { background: #fff3e0; color: #f57c00; }
  .dark-mode .status-active { background: #1b5e20; color: #a5d6a7; }
  .dark-mode .status-sold { background: #1565c0; color: #90caf9; }
  .dark-mode .status-expired { background: #b71c1c; color: #ef9a9a; }
  .dark-mode .status-pending { background: #e65100; color: #ffcc80; }
  .bidding-container, .comments-container { background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .dark-mode .bidding-container, .dark-mode .comments-container { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .bidding-container h2, .comments-container h2 { font-size: 1.8rem; font-weight: 700; color: #2d2d2d; margin-bottom: 16px; }
  .dark-mode .bidding-container h2, .dark-mode .comments-container h2 { color: #e0e0e0; }
  .bidding-container > p { font-size: 1.1rem; color: #555; margin-bottom: 16px; }
  .dark-mode .bidding-container > p { color: #ccc; }
  .bidding-actions { display: flex; gap: 16px; align-items: center; }
  input, textarea { padding: 12px; font-size: 1rem; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; color: #2d2d2d; width: 100%; transition: border-color 0.3s, box-shadow 0.3s; }
  .dark-mode input, .dark-mode textarea { border-color: #555; background: #333; color: #e0e0e0; }
  input:focus, textarea:focus { outline: none; border-color: #ff4757; box-shadow: 0 0 8px rgba(255,71,87,0.3); }
  .dark-mode input:focus, .dark-mode textarea:focus { border-color: #61dafb; box-shadow: 0 0 8px rgba(97,218,251,0.3); }
  .error { border-color: #e41e3f !important; }
  .error-message { color: #e41e3f; font-size: 0.9rem; margin-top: 8px; }
  .success-message { color: #43a047; font-size: 0.9rem; margin-top: 8px; }
  .comment-actions { display: flex; flex-direction: column; gap: 16px; }
  textarea { resize: vertical; min-height: 100px; }
  .comments-list { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; }
  .no-comments { font-size: 1.1rem; color: #555; text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px; }
  .dark-mode .no-comments { color: #ccc; background: #333; }
  .comment { background: #f8f9fa; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .dark-mode .comment { background: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .comment p { font-size: 1rem; color: #2d2d2d; margin: 0 0 12px; }
  .dark-mode .comment p { color: #e0e0e0; }
  .comment .comment-actions { display: flex; gap: 12px; justify-content: flex-end; }
  .reply { font-size: 0.95rem; color: #666; margin-left: 20px; font-style: italic; border-left: 2px solid #ff4757; padding-left: 10px; }
  .dark-mode .reply { color: #bbb; border-left-color: #61dafb; }
  .btn { background: linear-gradient(45deg, #ff4757, #ff6b7b); color: #ffffff; padding: 12px 24px; font-size: 1rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(255,71,87,0.3); }
  .btn:hover { background: linear-gradient(45deg, #ff2e43, #ff5b6b); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,71,87,0.5); }
  .btn.secondary { background: linear-gradient(45deg, #e3f2fd, #bbdefb); color: #1e88e5; box-shadow: 0 2px 8px rgba(30,136,229,0.3); }
  .btn.secondary:hover { background: linear-gradient(45deg, #bbdefb, #90caf9); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(30,136,229,0.5); }
  .btn.secondary.small { padding: 8px 16px; font-size: 0.9rem; }
  .dark-mode .btn { background: linear-gradient(45deg, #61dafb, #7be6ff); color: #121212; box-shadow: 0 2px 8px rgba(97,218,251,0.3); }
  .dark-mode .btn:hover { background: linear-gradient(45deg, #4ccaf9, #69d6ff); box-shadow: 0 4px 12px rgba(97,218,251,0.5); }
  .dark-mode .btn.secondary { background: linear-gradient(45deg, #2a2a2a, #3a3a3a); color: #e0e0e0; box-shadow: 0 2px 8px rgba(255,255,255,0.2); }
  .dark-mode .btn.secondary:hover { background: linear-gradient(45deg, #3a3a3a, #4a4a4a); box-shadow: 0 4px 12px rgba(255,255,255,0.3); }
  .loading, .error { text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px; }
  .dark-mode .loading, .dark-mode .error { background: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  @media (max-width: 768px) { 
    .product-page { margin: 24px 16px; padding: 24px; } 
    .product-container { flex-direction: column; gap: 24px; } 
    .product-image { max-width: 100%; } 
    .product-details h1 { font-size: 1.8rem; } 
    .bidding-container h2, .comments-container h2 { font-size: 1.6rem; } 
    .bidding-actions { flex-direction: column; gap: 12px; } 
    .btn { width: 100%; } 
    .reply { margin-left: 10px; padding-left: 8px; }
  }
  @media (max-width: 480px) { 
    .product-details h1 { font-size: 1.6rem; } 
    .product-details p { font-size: 1rem; } 
    .bidding-container h2, .comments-container h2 { font-size: 1.4rem; } 
    .input, textarea { font-size: 0.9rem; } 
    .btn { font-size: 0.9rem; padding: 10px; } 
    .reply { font-size: 0.85rem; margin-left: 8px; padding-left: 6px; }
  }
`;

const ProductPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productId = params.get('product_id') || 'Unknown Product';

  const [product, setProduct] = useState({
    id: productId,
    title: 'Not found',
    description: 'Loading...',
    price: 0,
    image: '/assets/default.png',
    status: 'loading', // Added status to state
  });
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [userQueries, setUserQueries] = useState([]);
  const [otherQueries, setOtherQueries] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAndQueries = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const productResponse = await fetch(API_URL +`/api/seller/get-product-by-id/${productId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch product: ${productResponse.status}`);
        }

        const products = await productResponse.json();
        const foundProduct = products.product;
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct({
          id: foundProduct.product_id,
          title: foundProduct.name,
          description: foundProduct.description || 'No description available.',
          price: foundProduct.asking_price || 0,
          image: foundProduct.image || '/assets/default.png',
          status: foundProduct.status || 'unknown', // Added status from API
        });

        // Fetch the highest bid
        const highestBidResponse = await fetch(API_URL +`/api/bid/product/${foundProduct.product_id}/highest`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (highestBidResponse.ok) {
          const highestBidData = await highestBidResponse.json();
          setCurrentBid(highestBidData.highest_bid.amount || foundProduct.price);
        } else if (highestBidResponse.status === 404) {
          setCurrentBid('No bids yet');
        } else {
          throw new Error('Failed to fetch highest bid');
        }

        // Fetch queries
        const queryResponse = await fetch(API_URL +`/api/query/${foundProduct.product_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!queryResponse.ok) {
          if (queryResponse.status === 404) {
            setUserQueries([]);
            setOtherQueries([]);
          } else {
            throw new Error(`Failed to fetch queries: ${queryResponse.status}`);
          }
        } else {
          const queryData = await queryResponse.json();
          setUserQueries(queryData.userQueries || []);
          setOtherQueries(queryData.otherQueries || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndQueries();
  }, [productId]);

  const placeBid = async () => {
    setBidLoading(true);
    setBidError('');
    setBidSuccess('');

    const newBid = parseFloat(bidAmount);
    if (isNaN(newBid) || newBid <= 0) {
      setBidError('Please enter a valid bid amount.');
      setBidLoading(false);
      return;
    }

    if (newBid <= currentBid) {
      setBidError(`Bid must be greater than current highest bid (₹${currentBid.toLocaleString()}).`);
      setBidLoading(false);
      return;
    }

    try {
      const bidResponse = await fetch(API_URL +`/api/bid/place-bid/${product.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ amount: newBid }),
      });

      const bidData = await bidResponse.json();
      if (!bidResponse.ok) {
        throw new Error(bidData.error || 'Failed to place bid');
      }

      // Fetch updated highest bid
      const highestBidResponse = await fetch(API_URL +`/api/bid/product/${product.id}/highest`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (highestBidResponse.ok) {
        const highestBidData = await highestBidResponse.json();
        setCurrentBid(highestBidData.highest_bid.amount);
      }

      setBidAmount('');
      setBidSuccess('Bid placed successfully!');
    } catch (err) {
      console.error('Place bid error:', err);
      setBidError(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setBidLoading(false);
    }
  };

  const postComment = async () => {
    if (commentInput.trim() === '') {
      setCommentError('Please write something before posting.');
      return;
    }
    if (!product.id) {
      setCommentError('Product ID not available.');
      return;
    }

    try {
      const response = await fetch(API_URL +`/api/query/${product.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ query: commentInput.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to post query: ${response.status}`);
      }

      const data = await response.json();
      setUserQueries([...userQueries, {
        query_id: data.query.query_id,
        query: data.query.query,
        customer_name: data.query.customer_name || 'Anonymous',
        reply: data.query.reply || null,
      }]);
      setCommentInput('');
      setCommentError('');
    } catch (err) {
      console.error('Post comment error:', err);
      setCommentError(err.message || 'Failed to post query. Please try again.');
    }
  };

  const editComment = async (index) => {
    const comment = userQueries[index];
    const newComment = prompt('Edit your query:', comment.query);
    if (newComment && newComment.trim()) {
      try {
        const response = await fetch(API_URL +`/api/query/edit/${comment.query_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ query: newComment.trim() }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update query');
        }
        const data = await response.json();
        const updatedQueries = [...userQueries];
        updatedQueries[index] = { 
          ...comment, 
          query: data.query.query,
          reply: data.query.reply || null,
        };
        setUserQueries(updatedQueries);
      } catch (err) {
        console.error('Edit comment error:', err);
        alert('Failed to update query.');
      }
    }
  };

  const deleteComment = async (index) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      const comment = userQueries[index];
      try {
        const response = await fetch(API_URL +`/api/query/delete/${comment.query_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete query');
        }
        setUserQueries(userQueries.filter((_, i) => i !== index));
      } catch (err) {
        console.error('Delete comment error:', err);
        alert('Failed to delete query.');
      }
    }
  };

  // Check if product is in a state where bidding/querying is allowed
  const isActive = product.status === 'active';

  if (loading) return (
    <main className="product-page">
      <div className="loading">Loading...</div>
      <style>{styles}</style>
    </main>
  );
  if (error) return (
    <main className="product-page">
      <div className="error">Error: {error}</div>
      <style>{styles}</style>
    </main>
  );

  return (
    <main className="product-page">
      <div className="product-page-container">
        <section className="product-container">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-details">
            <h1>{product.title}</h1>
            <p><span>Description:</span> {product.description}</p>
            <p><span>Current Highest Bid:</span> {typeof currentBid === 'number'
              ? `₹${currentBid.toLocaleString()}`
              : currentBid}</p>
            <p><span>Asking Price:</span> ₹{product.price.toLocaleString()}</p>
            {/* Display product status */}
            <p>
              <span>Status:</span> 
              <span className={`product-status status-${product.status.replace('approval-pending', 'pending')}`}>
                {product.status.replace('approval-pending', 'Pending Approval')}
              </span>
            </p>
          </div>
        </section>
        {/* Show bidding section only if status is active */}
        {isActive && (
          <section className="bidding-container">
            <h2>Place Your Bid</h2>
            <p>Current Highest Bid: {typeof currentBid === 'number'
              ? `₹${currentBid.toLocaleString()}`
              : currentBid}</p>
            <div className="bidding-actions">
              <input
                type="number"
                placeholder="Enter your bid (₹)"
                min="0"
                step="0.01"
                value={bidAmount}
                onChange={(e) => { setBidAmount(e.target.value); setBidError(''); setBidSuccess(''); }}
                className={bidError ? 'error' : ''}
                disabled={bidLoading}
              />
              <button className="btn" onClick={placeBid} disabled={bidLoading}>
                {bidLoading ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
            {bidError && <p className="error-message">{bidError}</p>}
            {bidSuccess && <p className="success-message">{bidSuccess}</p>}
          </section>
        )}
        <section className="comments-container">
          <h2>Queries / Comments</h2>
          {/* Show comment input only if status is active */}
          {isActive && (
            <div className="comment-actions">
              <textarea
                placeholder="Type your query or comment..."
                value={commentInput}
                onChange={(e) => { setCommentInput(e.target.value); setCommentError(''); }}
                rows="4"
                className={commentError ? 'error' : ''}
              />
              <button className="btn" onClick={postComment}>Post Query</button>
            </div>
          )}
          {commentError && <p className="error-message">{commentError}</p>}
          <div className="comments-list">
            {userQueries.length === 0 && otherQueries.length === 0 ? (
              <p className="no-comments">No queries yet.</p>
            ) : (
              <>
                {userQueries.map((comment, index) => (
                  <div key={comment.query_id} className="comment">
                    <p><strong>{comment.customer_name || 'Anonymous'}:</strong> {comment.query}</p>
                    {comment.reply && (
                      <p className="reply"><strong>Seller Reply:</strong> {comment.reply}</p>
                    )}
                    {!comment.reply && (
                      <div className="comment-actions">
                        <button className="btn secondary small" onClick={() => editComment(index)}>Edit</button>
                        <button className="btn secondary small" onClick={() => deleteComment(index)}>Delete</button>
                      </div>
                    )}
                  </div>
                ))}
                {otherQueries.map((comment) => (
                  <div key={comment.query_id} className="comment">
                    <p><strong>{comment.customer_name || 'Anonymous'}:</strong> {comment.query}</p>
                    {comment.reply && (
                      <p className="reply"><strong>Seller Reply:</strong> {comment.reply}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </div>
      <style>{styles}</style>
    </main>
  );
};

export default ProductPage;