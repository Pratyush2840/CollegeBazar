import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { API_URL } from '../config.js';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL + '/api/bid/my-bids', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bids: ${response.status}`);
        }

        const data = await response.json();
        setBids(data.my_bids || []);
      } catch (err) {
        console.error('Fetch bids error:', err);
        setError(err.message || 'Failed to fetch your bids');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  if (loading) {
    return (
      <main className="my-bids-page">
        <div className="loading">Loading your bids...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-bids-page">
        <div className="error">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="my-bids-page">
      <h1>My Bids</h1>
      {bids.length === 0 ? (
        <p className="no-bids">You haven't placed any bids yet.</p>
      ) : (
        <div className="bids-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
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
                  <td>₹{bid.amount.toLocaleString()}</td>
                  <td>₹{bid.asking_price.toLocaleString()}</td>
                  <td>{new Date(bid.deadline).toLocaleDateString()}</td>
                  <td className={`status-${bid.status.toLowerCase()}`}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </td>
                  <td>
                    <NavLink to={`/product?product_id=${bid.product_id}`} className="btn secondary">
                      View Product
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style>{`
        .my-bids-page {
          max-width: 1000px;
          margin: 40px auto;
          padding: 32px;
          background: linear-gradient(180deg, #ffffff, #f8f9fa);
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }

        .dark-mode .my-bids-page {
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

        .status-purchased {
          color: #1e88e5;
          font-weight: 600;
        }

        .dark-mode .status-purchased {
          color: #90caf9;
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

        @media (max-width: 768px) {
          .my-bids-page {
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

          .btn.secondary {
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

          .bids-table {
            font-size: 0.85rem;
          }

          .status-highest, .status-outbid, .status-purchased {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </main>
  );
};

export default MyBids;