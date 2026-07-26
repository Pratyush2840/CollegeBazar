import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../api/auth";

const validHostels = ['TH1', 'TH2', 'TH3', 'TH4', 'MA Saraswati', 'Panini', 'Nagarjuna Hostel'];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone_no: "", hostel: "", address: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone_no || !formData.hostel) {
      setError("Phone number and hostel are required");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone_no)) {
      setError("Phone number must be 10 digits");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = { phone_no: formData.phone_no, hostel: formData.hostel };
      if (formData.address) payload.address = formData.address;
      await editProfile(payload);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complete-profile-page">
      <div className="complete-profile-card">
        <h2>Complete Your Profile</h2>
        <p className="subtitle">We need a few more details before you can start buying and selling.</p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone_no">Phone Number</label>
            <input
              id="phone_no"
              name="phone_no"
              type="tel"
              placeholder="10-digit phone number"
              value={formData.phone_no}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hostel">Hostel</label>
            <select
              id="hostel"
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select your hostel</option>
              {validHostels.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (optional)</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Your address"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <button className="submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner"></span> : "Save & Continue"}
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .complete-profile-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8f9fa, #e9ecef);
          padding: 20px;
        }

        .dark-mode .complete-profile-page {
          background: linear-gradient(180deg, #121212, #1e1e1e);
        }

        .complete-profile-card {
          max-width: 480px;
          width: 100%;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 40px;
        }

        .dark-mode .complete-profile-card {
          background: #252525;
        }

        .complete-profile-card h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d2d2d;
          text-align: center;
          margin-bottom: 8px;
        }

        .dark-mode .complete-profile-card h2 {
          color: #e0e0e0;
        }

        .subtitle {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        .dark-mode .subtitle {
          color: #aaa;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 8px;
        }

        .dark-mode .form-group label {
          color: #e0e0e0;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f8f9fa;
          color: #2d2d2d;
        }

        .dark-mode .form-group input,
        .dark-mode .form-group select {
          border-color: #555;
          background: #333;
          color: #e0e0e0;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: #1d4ed8;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background: #feecef;
          border-left: 4px solid #1d4ed8;
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 8px;
        }

        .dark-mode .error-message {
          background: rgba(29, 78, 216, 0.15);
        }

        .error-message p {
          color: #e41e3f;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
