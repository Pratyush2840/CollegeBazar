import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { API_URL } from '../config.js';

const SellerBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingBidId, setAcceptingBidId] = useState(null);
  const [acceptError, setAcceptError] = useState('');

  const fetchSellerBids = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL + '/api/bid/seller-bids', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bids: ${response.status}`);
      }

      const data = await response.json();
      setBids(data.bids || []);
    } catch (err) {
      console.error('Fetch seller bids error:', err);
      setError(err.message || 'Failed to fetch bids on your listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellerBids();
  }, [fetchSellerBids]);

  const handleAcceptBid = async (bidId) => {
    try {
      setAcceptingBidId(bidId);
      setAcceptError('');

      const response = await fetch(`${API_URL}/api/bid/accept/${bidId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept bid');
      }

      await fetchSellerBids();
    } catch (err) {
      console.error('Accept bid error:', err);
      setAcceptError(err.message || 'Failed to accept bid');
    } finally {
      setAcceptingBidId(null);
    }
  };

  if (loading) {
    return (
      <main className="seller-bids-page">
        <div className="loading">Loading bids on your listings...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="seller-bids-page">
        <div className="error">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="seller-bids-page">
      <h1>Bids on My Listings</h1>
      {acceptError && <div className="error accept-error">Error: {acceptError}</div>}
      {bids.length === 0 ? (
        <p className="no-bids">No one has bid on your listings yet.</p>
      ) : (
        <div className="bids-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Bidder</th>
                <th>Bid Amount</th>
                <th>Asking Price</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.bid_id}>
                  <td>{bid.product_name}</td>
                  <td>{bid.bidder_name}{bid.bidder_roll_no ? ` (${bid.bidder_roll_no})` : ''}</td>
                  <td>₹{Number(bid.amount).toLocaleString()}</td>
                  <td>₹{Number(bid.asking_price).toLocaleString()}</td>
                  <td>{new Date(bid.deadline).toLocaleDateString()}</td>
                  <td className={`status-${bid.status.toLowerCase()}`}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </td>
                  <td className="action-cell">
                    <NavLink to={`/seller/product?product_id=${bid.product_id}`} className="btn secondary">
                      View
                    </NavLink>
                    {bid.status === 'highest' && bid.product_status !== 'sold' && (
                      <button
                        className="btn accept"
                        disabled={acceptingBidId === bid.bid_id}
                        onClick={() => handleAcceptBid(bid.bid_id)}
                      >
                        {acceptingBidId === bid.bid_id ? 'Accepting...' : 'Accept'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style>{`
        .seller-bids-page {
          max-width: 1100px;
          margin: 40px auto;
          padding: 32px;
          background: linear-gradient(180deg, #ffffff, #f8f9fa);
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }

        .dark-mode .seller-bids-page {
          background: linear-gradient(180deg, #2d2d2d, #252525);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          margin-bottom: 24px;
          text-align: center;
        }

        .dark-mode h1 {
          color: #e0e0e0;
        }

        .no-bids {
          font-size: 1.2rem;
          color: #555;
          text-align: center;
          padding: 24px;
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .dark-mode .no-bids {
          color: #ccc;
          background: #333;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .bids-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .dark-mode table {
          background: #2d2d2d;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        th, td {
          padding: 16px;
          text-align: left;
          font-size: 1rem;
          color: #2d2d2d;
        }

        .dark-mode th, .dark-mode td {
          color: #e0e0e0;
        }

        th {
          background: #f8f9fa;
          font-weight: 700;
          border-bottom: 2px solid #ddd;
        }

        .dark-mode th {
          background: #333;
          border-bottom: 2px solid #555;
        }

        td {
          border-bottom: 1px solid #ddd;
        }

        .dark-mode td {
          border-bottom: 1px solid #555;
        }

        .action-cell {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .status-highest {
          color: #43a047;
          font-weight: 600;
        }

        .dark-mode .status-highest {
          color: #66bb6a;
        }

        .status-outbid {
          color: #e41e3f;
          font-weight: 600;
        }

        .dark-mode .status-outbid {
          color: #ef5350;
        }

        .btn.secondary {
          padding: 8px 16px;
          font-size: 0.9rem;
          background: linear-gradient(45deg, #e3f2fd, #bbdefb);
          color: #1e88e5;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(30,136,229,0.3);
        }

        .btn.secondary:hover {
          background: linear-gradient(45deg, #bbdefb, #90caf9);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(30,136,229,0.5);
        }

        .dark-mode .btn.secondary {
          background: linear-gradient(45deg, #2a2a2a, #3a3a3a);
          color: #e0e0e0;
          box-shadow: 0 2px 8px rgba(255,255,255,0.2);
        }

        .dark-mode .btn.secondary:hover {
          background: linear-gradient(45deg, #3a3a3a, #4a4a4a);
          box-shadow: 0 4px 12px rgba(255,255,255,0.3);
        }

        .btn.accept {
          padding: 8px 16px;
          font-size: 0.9rem;
          background: linear-gradient(45deg, #22c55e, #4ade80);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(34,197,94,0.4);
        }

        .btn.accept:hover:not(:disabled) {
          background: linear-gradient(45deg, #16a34a, #22c55e);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34,197,94,0.6);
        }

        .btn.accept:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin: 20px 0;
          font-size: 1.2rem;
          color: #555;
        }

        .dark-mode .loading, .dark-mode .error {
          background: #333;
          color: #ccc;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .error {
          color: #e41e3f;
        }

        .dark-mode .error {
          color: #ef5350;
        }

        .accept-error {
          margin-bottom: 20px;
          padding: 16px;
        }

        @media (max-width: 768px) {
          .seller-bids-page {
            margin: 24px 16px;
            padding: 24px;
          }

          h1 {
            font-size: 2rem;
          }

          th, td {
            padding: 12px;
            font-size: 0.9rem;
          }

          .btn.secondary, .btn.accept {
            padding: 6px 12px;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.8rem;
          }

          th, td {
            padding: 10px;
            font-size: 0.8rem;
          }

          .action-cell {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
};

export default SellerBids;
