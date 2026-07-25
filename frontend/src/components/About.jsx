export default function About() {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>About CollegeBazaar</h1>
        <p>
          CollegeBazaar is a campus-only marketplace where students can buy, sell, and trade items
          with people they can actually trust — their own batchmates and seniors.
        </p>
        <p>
          Listings are only visible to verified students signed in with a campus email address.
          Post an item in minutes, take bids from other students on campus, answer questions directly
          on your listing, and hand off the item locally — no shipping, no strangers, no platform fees.
        </p>
        <p>
          Whether you're clearing out old textbooks, upgrading your gaming setup, or just looking for
          a good deal from someone down the hall, CollegeBazaar keeps it simple and local.
        </p>
      </div>

      <style jsx="true">{`
        .about-page {
          min-height: 60vh;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
        }

        .about-card {
          max-width: 720px;
          width: 100%;
          background: #ffffff;
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .about-card {
          background: #1e293b;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .about-card h1 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 24px;
        }

        .dark-mode .about-card h1 {
          color: #f1f5f9;
        }

        .about-card p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #374151;
          margin-bottom: 18px;
        }

        .dark-mode .about-card p {
          color: #cbd5e1;
        }

        @media (max-width: 768px) {
          .about-card {
            padding: 32px 24px;
          }

          .about-card h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
