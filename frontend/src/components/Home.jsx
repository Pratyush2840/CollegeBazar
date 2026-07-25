import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

export default function Home() {
  const categories = [
    { name: "Electronics", image: "/assets/1.png" },
    { name: "Textbooks", image: "/assets/2.png" },
    { name: "Accessories", image: "/assets/3.png" },
    { name: "Furniture", image: "/assets/4.png" },
    { name: "All", image: "/assets/5.png" },
  ];

  return (
    <>
      <header className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Buy. Sell. Trade. Within Your Campus.</h1>
            <p>A trusted marketplace built just for college students.</p>
            <div className="hero-buttons">
              <Link to="/browse" className="btn">Browse Listings</Link>
              <Link to="/post" className="btn secondary">Post Your Item</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>🎓 Campus-only Access</h3>
          <p>Listings visible only to verified college students.</p>
        </div>
        <div className="feature-card">
          <h3>⭐ Peer-Reviewed Sellers</h3>
          <p>Buy from trusted peers with ratings and reviews.</p>
        </div>
        <div className="feature-card">
          <h3>🛍️ Zero Commission</h3>
          <p>Sell your items without any platform fees or cuts.</p>
        </div>
        <div className="feature-card">
          <h3>❓ Ask Sellers Directly</h3>
          <p>Post your questions about the product and get answers from the seller.</p>
        </div>
      </section>

      <section className="shop-by-category">
        <h2 className="shop-heading">🛒 Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/browse?category=${encodeURIComponent(cat.name)}`}
              className="category-card"
            >
              <img src={cat.image} alt={cat.name} className="category-img" />
              <div className="category-name">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <style jsx="true">{`
        /* Same styles as provided, no changes needed */
        .hero {
          position: relative;
          background: linear-gradient(180deg, #e3f2fd, #bbdefb);
          padding: 80px 20px;
          text-align: center;
          border-radius: 12px;
          margin-bottom: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .hero {
          background: linear-gradient(180deg, #2a2a2a, #3a3a3a);
        }

        .hero-overlay {
          position: relative;
          z-index: 1;
        }

        .hero-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          margin-bottom: 16px;
        }

        .dark-mode .hero-content h1 {
          color: #e0e0e0;
        }

        .hero-content p {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 24px;
        }

        .dark-mode .hero-content p {
          color: #ccc;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
        }

        .btn {
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          color: #ffffff !important;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
        }

        .btn:hover {
          background: linear-gradient(45deg, #ff2e43, #ff5b6b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
        }

        .btn.secondary {
          background: linear-gradient(45deg, #e3f2fd, #bbdefb);
          color: #1e88e5 !important;
          box-shadow: 0 2px 8px rgba(30, 136, 229, 0.3);
        }

        .btn.secondary:hover {
          background: linear-gradient(45deg, #bbdefb, #90caf9);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(30, 136, 229, 0.5);
        }

        .dark-mode .btn {
          background: linear-gradient(45deg, #61dafb, #7be6ff);
          color: #121212 !important;
          box-shadow: 0 2px 8px rgba(97, 218, 251, 0.3);
        }

        .dark-mode .btn:hover {
          background: linear-gradient(45deg, #4ccaf9, #69d6ff);
          box-shadow: 0 4px 12px rgba(97, 218, 251, 0.5);
        }

        .dark-mode .btn.secondary {
          background: linear-gradient(45deg, #2a2a2a, #3a3a3a);
          color: #e0e0e0 !important;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
        }

        .dark-mode .btn.secondary:hover {
          background: linear-gradient(45deg, #3a3a3a, #4a4a4a);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 40px 0;
        }

        .feature-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .dark-mode .feature-card {
          background: #2d2d2d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .feature-card h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .dark-mode .feature-card h3 {
          color: #e0e0e0;
        }

        .feature-card p {
          font-size: 1rem;
          color: #555;
        }

        .dark-mode .feature-card p {
          color: #e0e0e0;
        }

        .shop-by-category {
          margin: 40px 0;
        }

        .shop-heading {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 24px;
        }

        .dark-mode .shop-heading {
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
        }

        .category-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #ffffff;
          text-decoration: none;
        }

        .dark-mode .category-card {
          background: #2d2d2d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(255, 71, 87, 0.5);
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
        }

        .dark-mode .category-card:hover {
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
        }

        .category-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          border-bottom: 2px solid #ff4757;
        }

        .dark-mode .category-img {
          border-bottom-color: #ff4757;
        }

        .category-name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: #2d2d2d;
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }

        .dark-mode .category-name {
          color: #e0e0e0;
          background: rgba(37, 37, 37, 0.9);
        }

        .category-card:hover .category-name {
          color: #ffffff;
          background: rgba(255, 71, 87, 0.9);
        }

        .dark-mode .category-card:hover .category-name {
          color: #ffffff;
          background: rgba(255, 71, 87, 0.9);
        }

        @media (max-width: 768px) {
          .hero {
            padding: 60px 16px;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 12px;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .shop-heading {
            font-size: 1.8rem;
          }

          .category-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-content p {
            font-size: 0.9rem;
          }

          .shop-heading {
            font-size: 1.6rem;
          }

          .category-img {
            height: 120px;
          }

          .category-name {
            font-size: 0.9rem;
            padding: 8px;
          }
        }
      `}</style>

    </>
  );
}