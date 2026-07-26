import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function Home({ isLoggedIn, isCampusEmail }) {
  const heroContentRef = useRef(null);
  const roadmapRef = useRef(null);
  const categoryGridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.from(heroContentRef.current.children, {
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        clearProps: 'transform',
      });

      tl.from(roadmapRef.current.querySelectorAll('.roadmap-row'), {
        y: 40,
        duration: 0.7,
        stagger: 0.2,
        clearProps: 'transform',
      }, '-=0.3');

      if (categoryGridRef.current) {
        tl.from(categoryGridRef.current.children, {
          y: 24,
          duration: 0.6,
          stagger: 0.08,
          clearProps: 'transform',
        }, '-=0.3');
      }
    });

    return () => ctx.revert();
  }, [isLoggedIn]);

  const categories = [
    { name: "Electronics", icon: "💻" },
    { name: "Textbooks", icon: "📚" },
    { name: "Accessories", icon: "🎒" },
    { name: "Furniture", icon: "🛋️" },
    { name: "All", icon: "🗂️" },
  ];

  const roadmapSteps = [
    { number: "01", icon: "📤", color: "#10b981", title: "List Your Item", description: "Post your item with photos, a price, and a deadline in under a minute." },
    { number: "02", icon: "🏷️", color: "#06b6d4", title: "Get Bids", description: "Verified students on campus place bids on your listing." },
    { number: "03", icon: "💬", color: "#3b82f6", title: "Answer Questions", description: "Buyers can ask you questions directly on the listing before buying." },
    { number: "04", icon: "✅", color: "#8b5cf6", title: "Complete the Sale", description: "Accept the best offer and hand off the item on campus." },
  ];

  return (
    <>
      <header className="hero">
        <div className="hero-overlay">
          <div className="hero-content" ref={heroContentRef}>
            <h1>Buy. Sell. Trade. Within Your Campus.</h1>
            <p>A trusted marketplace built just for college students.</p>
            <div className="hero-buttons">
              <Link to="/browse" className="btn">Browse Listings</Link>
              {isLoggedIn && isCampusEmail && (
                <Link to="/post" className="btn secondary">Post Your Item</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="roadmap" ref={roadmapRef}>
        <h2 className="section-heading">Roadmap</h2>
        <div className="roadmap-track">
          <div className="roadmap-line"></div>
          {roadmapSteps.map((step, i) => (
            <div key={step.number} className={`roadmap-row ${i % 2 === 0 ? "left" : "right"}`}>
              <div className="roadmap-content">
                <span className="roadmap-step-label" style={{ color: step.color }}>STEP {step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="roadmap-icon" style={{ background: step.color }}>
                <span>{step.icon}</span>
              </div>
              <div className="roadmap-spacer"></div>
            </div>
          ))}
        </div>
      </section>

      {isLoggedIn && (
        <section className="shop-by-category">
          <h2 className="shop-heading">Shop by Category</h2>
          <div className="category-grid" ref={categoryGridRef}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style jsx="true">{`
        .roadmap {
          margin: 64px 0;
        }

        .section-heading {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          color: #0f172a;
          margin-bottom: 48px;
        }

        .dark-mode .section-heading {
          color: #f1f5f9;
        }

        .roadmap-track {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
        }

        .roadmap-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #10b981, #06b6d4, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        .roadmap-row {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 64px 1fr;
          align-items: center;
          gap: 24px;
          margin-bottom: 48px;
        }

        .roadmap-row:last-child {
          margin-bottom: 0;
        }

        .roadmap-row.left .roadmap-content {
          grid-column: 1;
          text-align: right;
        }

        .roadmap-row.left .roadmap-spacer {
          grid-column: 3;
        }

        .roadmap-row.right .roadmap-content {
          grid-column: 3;
          text-align: left;
        }

        .roadmap-row.right .roadmap-spacer {
          grid-column: 1;
        }

        .roadmap-icon {
          grid-column: 2;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          z-index: 1;
          justify-self: center;
        }

        .roadmap-step-label {
          display: block;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .roadmap-content h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
        }

        .dark-mode .roadmap-content h3 {
          color: #f1f5f9;
        }

        .roadmap-content p {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.5;
          margin: 0;
        }

        .dark-mode .roadmap-content p {
          color: #cbd5e1;
        }

        .shop-by-category {
          margin: 40px 0;
        }

        .shop-heading {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          color: #0f172a;
          margin-bottom: 24px;
        }

        .dark-mode .shop-heading {
          color: #f1f5f9;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 28px 16px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
          background: #ffffff;
          text-decoration: none;
        }

        .dark-mode .category-card {
          background: #2d2d2d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(29, 78, 216, 0.5);
          background: #1d4ed8;
        }

        .dark-mode .category-card:hover {
          background: #1d4ed8;
        }

        .category-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border-radius: 50%;
          background: #eff6ff;
          transition: background 0.3s ease;
        }

        .dark-mode .category-icon {
          background: #334155;
        }

        .category-card:hover .category-icon {
          background: rgba(255, 255, 255, 0.2);
        }

        .category-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2d2d2d;
          text-align: center;
          transition: color 0.3s ease;
        }

        .dark-mode .category-name {
          color: #e0e0e0;
        }

        .category-card:hover .category-name {
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .roadmap-line {
            left: 28px;
          }

          .roadmap-row,
          .roadmap-row.left,
          .roadmap-row.right {
            grid-template-columns: 56px 1fr;
            gap: 16px;
            margin-bottom: 32px;
          }

          .roadmap-row.left .roadmap-icon,
          .roadmap-row.right .roadmap-icon {
            grid-column: 1;
            grid-row: 1;
          }

          .roadmap-row.left .roadmap-content,
          .roadmap-row.right .roadmap-content {
            grid-column: 2;
            grid-row: 1;
            text-align: left !important;
          }

          .roadmap-row.left .roadmap-spacer,
          .roadmap-row.right .roadmap-spacer {
            display: none;
          }

          .shop-heading {
            font-size: 1.8rem;
          }

          .category-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .shop-heading {
            font-size: 1.6rem;
          }

          .category-icon {
            width: 52px;
            height: 52px;
            font-size: 1.6rem;
          }

          .category-name {
            font-size: 0.9rem;
          }
        }
      `}</style>

    </>
  );
}