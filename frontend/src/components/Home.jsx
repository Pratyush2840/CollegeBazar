import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UploadIcon, TagIcon, MessageIcon, CheckCircleIcon, LaptopIcon, BookIcon, BagIcon, CouchIcon, GridIcon, ShieldIcon, CoinIcon, ChatIcon, UsersIcon, PackageIcon, TrendingUpIcon } from './icons.jsx';
import { API_URL } from '../config.js';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ isLoggedIn, isCampusEmail }) {
  const heroContentRef = useRef(null);
  const heroVisualRef = useRef(null);
  const whyUsRef = useRef(null);
  const roadmapRef = useRef(null);
  const categoryGridRef = useRef(null);
  const featuredRef = useRef(null);
  const joinRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/api/stats/summary')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(API_URL + '/api/seller/get-active-products', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
    })
      .then((res) => res.ok ? res.json() : { products: [] })
      .then((data) => setFeatured((data.products || []).slice(0, 4)))
      .catch(() => setFeatured([]));
  }, [isLoggedIn]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.from(heroContentRef.current.children, {
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        clearProps: 'transform',
      });

      if (heroVisualRef.current) {
        tl.from(heroVisualRef.current, {
          y: 40,
          scale: 0.96,
          duration: 0.9,
          clearProps: 'transform',
        }, '-=0.6');

        gsap.to(heroVisualRef.current, {
          y: -14,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.2,
        });
      }

      const revealSections = gsap.utils.toArray('.reveal-section');
      revealSections.forEach((section) => {
        const items = section.querySelectorAll('.reveal-item');
        gsap.from(items.length ? items : section, {
          y: 36,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    return () => ctx.revert();
  }, [isLoggedIn, featured.length]);

  const categories = [
    { name: "Electronics", Icon: LaptopIcon },
    { name: "Textbooks", Icon: BookIcon },
    { name: "Accessories", Icon: BagIcon },
    { name: "Furniture", Icon: CouchIcon },
    { name: "All", Icon: GridIcon },
  ];

  const whyUs = [
    { Icon: ShieldIcon, title: "Verified Students", description: "Every account is tied to a real campus email, so you always know who you're dealing with." },
    { Icon: CoinIcon, title: "Zero Fees", description: "No commission, no listing fees. Keep 100% of what you sell." },
    { Icon: ChatIcon, title: "Direct Messaging", description: "Ask sellers questions right on the listing before you commit to a bid." },
  ];

  const roadmapSteps = [
    { number: "01", Icon: UploadIcon, color: "#6366f1", title: "List Your Item", description: "Post your item with photos, a price, and a deadline in under a minute." },
    { number: "02", Icon: TagIcon, color: "#22d3ee", title: "Get Bids", description: "Verified students on campus place bids on your listing." },
    { number: "03", Icon: MessageIcon, color: "#818cf8", title: "Answer Questions", description: "Buyers can ask you questions directly on the listing before buying." },
    { number: "04", Icon: CheckCircleIcon, color: "#a855f7", title: "Complete the Sale", description: "Accept the best offer and hand off the item on campus." },
  ];

  const tickerItems = ["Zero Fees", "Verified Students", "Instant Bidding", "Textbooks", "Electronics", "Furniture", "Campus Pickup", "No Middlemen"];

  return (
    <>
      <header className="hero">
        <div className="hero-grid">
          <div className="hero-content" ref={heroContentRef}>
            <span className="hero-eyebrow">
              <ShieldIcon width={16} height={16} /> Verified campus students only
            </span>
            <h1>Buy. Sell. Trade. <span className="gradient-text">Within Your Campus.</span></h1>
            <p>A trusted marketplace built just for college students — no fees, no strangers, no hassle.</p>
            <div className="hero-buttons">
              <Link to="/browse" className="btn">Browse Listings</Link>
              {isLoggedIn && isCampusEmail && (
                <Link to="/post" className="btn secondary">Post Your Item</Link>
              )}
            </div>
          </div>
          <div className="hero-visual" ref={heroVisualRef}>
            <div className="hero-photo">
              <img src="/assets/campus-hero.jpg" alt="Campus" />
            </div>
            {stats && (
              <>
                <div className="float-chip float-chip-1">
                  <UsersIcon width={16} height={16} />
                  <span>{stats.students} students</span>
                </div>
                <div className="float-chip float-chip-2">
                  <TrendingUpIcon width={16} height={16} />
                  <span>{stats.items_sold} sold</span>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item">{item} <span className="ticker-dot">•</span></span>
          ))}
        </div>
      </div>

      {stats && (
        <section className="stats-strip reveal-section" ref={statsRef}>
          <div className="stat-item reveal-item">
            <UsersIcon width={22} height={22} />
            <div>
              <span className="stat-number">{stats.students}</span>
              <span className="stat-label">Students Registered</span>
            </div>
          </div>
          <div className="stat-item reveal-item">
            <PackageIcon width={22} height={22} />
            <div>
              <span className="stat-number">{stats.active_listings}</span>
              <span className="stat-label">Active Listings</span>
            </div>
          </div>
          <div className="stat-item reveal-item">
            <TrendingUpIcon width={22} height={22} />
            <div>
              <span className="stat-number">{stats.items_sold}</span>
              <span className="stat-label">Items Sold</span>
            </div>
          </div>
        </section>
      )}

      <section className="why-us reveal-section" ref={whyUsRef}>
        {whyUs.map((item) => (
          <div key={item.title} className="why-us-card reveal-item">
            <div className="why-us-icon"><item.Icon width={24} height={24} /></div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      <section className="roadmap reveal-section" ref={roadmapRef}>
        <h2 className="section-heading">How It Works</h2>
        <div className="roadmap-track">
          <div className="roadmap-line"></div>
          {roadmapSteps.map((step, i) => (
            <div key={step.number} className={`roadmap-row reveal-item ${i % 2 === 0 ? "left" : "right"}`}>
              <div className="roadmap-content">
                <span className="roadmap-step-label" style={{ color: step.color }}>STEP {step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="roadmap-icon" style={{ background: step.color }}>
                <step.Icon color="#ffffff" width={22} height={22} />
              </div>
              <div className="roadmap-spacer"></div>
            </div>
          ))}
        </div>
      </section>

      {isLoggedIn && featured.length > 0 && (
        <section className="featured-listings reveal-section">
          <div className="featured-header">
            <h2 className="section-heading">Recently Listed</h2>
            <Link to="/browse" className="featured-view-all">View all →</Link>
          </div>
          <div className="featured-grid" ref={featuredRef}>
            {featured.map((item) => (
              <Link
                key={item.product_id}
                to={`/product?product_id=${encodeURIComponent(item.product_id)}`}
                className="featured-card reveal-item"
              >
                <div className="featured-image">
                  {item.image ? <img src={item.image} alt={item.name} /> : <div className="featured-image-empty" />}
                </div>
                <div className="featured-info">
                  <h3>{item.name}</h3>
                  <p>₹{Number(item.asking_price).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {isLoggedIn && (
        <section className="shop-by-category reveal-section">
          <h2 className="shop-heading">Shop by Category</h2>
          <div className="category-grid" ref={categoryGridRef}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="category-card reveal-item"
              >
                <div className="category-icon"><cat.Icon width={26} height={26} /></div>
                <div className="category-name">{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="join-modes reveal-section" ref={joinRef}>
        <h2 className="section-heading">Two Ways to Join</h2>
        <div className="join-grid">
          <div className="join-card reveal-item">
            <div className="join-icon join-icon-seller"><ShieldIcon width={26} height={26} /></div>
            <h3>Sell as a Verified Student</h3>
            <p>Sign in with your <strong>@iiitdmj.ac.in</strong> email to post listings. Every seller on the platform is a real, verified student on your campus.</p>
          </div>
          <div className="join-card reveal-item">
            <div className="join-icon join-icon-buyer"><CoinIcon width={26} height={26} /></div>
            <h3>Bid with Any Gmail Account</h3>
            <p>Anyone can sign in with Google to browse listings and place bids — no campus email required to shop.</p>
          </div>
        </div>
      </section>

      <section className="final-cta reveal-section" ref={ctaRef}>
        <div className="final-cta-inner reveal-item">
          <h2>Ready to clear out your dorm?</h2>
          <p>Join {stats ? `${stats.students}+ students` : 'your campus'} already trading on CollegeBazaar.</p>
          <div className="hero-buttons">
            <Link to="/browse" className="btn">Browse Listings</Link>
            {!isLoggedIn && <Link to="/signup" className="btn secondary">Create Account</Link>}
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .gradient-text {
          background: linear-gradient(120deg, #818cf8, #22d3ee);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-visual {
          position: relative;
        }

        .float-chip {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.25);
          color: #f1f5f9;
          font-size: 0.85rem;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .float-chip-1 {
          top: -14px;
          left: -14px;
          color: #a5b4fc;
        }

        .float-chip-2 {
          bottom: -14px;
          right: -14px;
          color: #67e8f9;
        }

        .ticker {
          overflow: hidden;
          margin: 40px 0;
          padding: 14px 0;
          border-top: 1px solid rgba(148, 163, 184, 0.15);
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        }

        .ticker-track {
          display: flex;
          width: max-content;
          gap: 2.5rem;
          animation: tickerScroll 26s linear infinite;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #64748b;
          white-space: nowrap;
        }

        .dark-mode .ticker-item {
          color: #94a3b8;
        }

        .ticker-dot {
          color: #818cf8;
        }

        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }

        .why-us {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin: 56px 0;
        }

        .why-us-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 28px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .why-us-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .dark-mode .why-us-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.12);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .why-us-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #eff6ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .dark-mode .why-us-icon {
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
        }

        .why-us-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .dark-mode .why-us-card h3 {
          color: #f1f5f9;
        }

        .why-us-card p {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.5;
        }

        .dark-mode .why-us-card p {
          color: #cbd5e1;
        }

        .stats-strip {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
          background: #0f172a;
          border-radius: 16px;
          padding: 32px;
          margin: 56px 0;
          border: 1px solid rgba(148, 163, 184, 0.12);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #a5b4fc;
        }

        .stat-item div {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .roadmap {
          margin: 64px 0;
        }

        .section-heading {
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
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
          background: linear-gradient(180deg, #6366f1, #22d3ee, #818cf8, #a855f7);
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

        .featured-listings {
          margin: 56px 0;
        }

        .featured-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .featured-header .section-heading {
          margin-bottom: 0;
        }

        .featured-view-all {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4f46e5;
          text-decoration: none;
        }

        .dark-mode .featured-view-all {
          color: #a5b4fc;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .featured-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .featured-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .dark-mode .featured-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.12);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .featured-image {
          width: 100%;
          padding-top: 75%;
          position: relative;
          background: #f1f5f9;
        }

        .dark-mode .featured-image {
          background: #334155;
        }

        .featured-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .featured-info {
          padding: 14px 16px;
        }

        .featured-info h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .dark-mode .featured-info h3 {
          color: #f1f5f9;
        }

        .featured-info p {
          font-size: 0.95rem;
          font-weight: 600;
          color: #4f46e5;
          margin: 0;
        }

        .dark-mode .featured-info p {
          color: #818cf8;
        }

        .shop-by-category {
          margin: 40px 0;
        }

        .shop-heading {
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
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
          border: 1px solid transparent;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
          background: #ffffff;
          text-decoration: none;
        }

        .dark-mode .category-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
          background: linear-gradient(120deg, #6366f1, #22d3ee);
        }

        .dark-mode .category-card:hover {
          background: linear-gradient(120deg, #6366f1, #22d3ee);
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
          color: #4f46e5;
          transition: background 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }

        .dark-mode .category-icon {
          background: rgba(99, 102, 241, 0.18);
          color: #a5b4fc;
        }

        .category-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }

        .category-card:hover .category-icon {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: scale(1.1);
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

        .join-modes {
          margin: 64px 0;
        }

        .join-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .join-card {
          padding: 32px 28px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .dark-mode .join-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.12);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .join-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .join-icon-seller {
          background: rgba(99, 102, 241, 0.15);
          color: #6366f1;
        }

        .join-icon-buyer {
          background: rgba(34, 211, 238, 0.15);
          color: #22d3ee;
        }

        .join-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .dark-mode .join-card h3 {
          color: #f1f5f9;
        }

        .join-card p {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
        }

        .dark-mode .join-card p {
          color: #cbd5e1;
        }

        .final-cta {
          margin: 64px 0 32px;
        }

        .final-cta-inner {
          text-align: center;
          padding: 56px 32px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.14), rgba(34, 211, 238, 0.1));
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .final-cta-inner h2 {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .dark-mode .final-cta-inner h2 {
          color: #f1f5f9;
        }

        .final-cta-inner p {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 28px;
        }

        .dark-mode .final-cta-inner p {
          color: #cbd5e1;
        }

        .final-cta .hero-buttons {
          justify-content: center;
        }

        @media (max-width: 768px) {
          .why-us {
            grid-template-columns: 1fr;
            margin: 40px 0;
          }

          .stats-strip {
            gap: 28px;
            padding: 24px;
          }

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

          .join-grid {
            grid-template-columns: 1fr;
          }

          .float-chip {
            font-size: 0.75rem;
            padding: 8px 12px;
          }

          .final-cta-inner h2 {
            font-size: 1.7rem;
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
