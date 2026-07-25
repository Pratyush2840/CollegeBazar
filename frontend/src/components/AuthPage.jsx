import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, requestOtp, verifyOtpAndSignup } from "../api/auth";

export default function AuthPage({ defaultTab = "login", setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    phone_no: "",
    email: "",
    password: "",
    hostel: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Invalid email format");
        return false;
      }
      if (!formData.email.endsWith("@iiita.ac.in")) {
        setError("Email must be from @iiita.ac.in domain");
        return false;
      }
    } else if (!showOtp) {
      if (
        !formData.name ||
        !formData.roll_no ||
        !formData.phone_no ||
        !formData.email ||
        !formData.password ||
        !formData.hostel
      ) {
        setError("All fields are required");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Invalid email format");
        return false;
      }
      if (!formData.email.endsWith("@iiita.ac.in")) {
        setError("Email must be from @iiita.ac.in domain");
        return false;
      }
    
      if (!/^\d{10}$/.test(formData.phone_no)) {
        setError("Phone number must be 10 digits");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    } else {
      if (!formData.otp) {
        setError("OTP is required");
        return false;
      }
      if (!/^\d{6}$/.test(formData.otp)) {
        setError("OTP must be a 6-digit number");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      if (isLogin) {
        const { token } = await login(formData.email, formData.password);
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        navigate("/");
      } else if (!showOtp) {
        await requestOtp(formData.email);
        setShowOtp(true);
      } else {
        await verifyOtpAndSignup(formData);
        // Assuming verifyOtpAndSignup returns a token
        const { token } = await login(formData.email, formData.password); // Auto-login after signup
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchTab = (tab) => {
    setIsLogin(tab === "login");
    setShowOtp(false);
    setFormData({
      name: "",
      roll_no: "",
      phone_no: "",
      email: "",
      password: "",
      hostel: "",
      otp: "",
    });
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src="/assets/im.png" alt="Illustration" />
        </div>
        <div className="auth-form">
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">🎓</span>
              College<span className="logo-accent">B</span>azaar
            </div>
            <div className="auth-tabs">
              <button
                className={isLogin ? "active" : ""}
                onClick={() => switchTab("login")}
                disabled={isSubmitting}
              >
                Login
              </button>
              <button
                className={!isLogin ? "active" : ""}
                onClick={() => switchTab("signup")}
                disabled={isSubmitting}
              >
                Signup
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {isLogin ? (
              <>
                <h2>Welcome Back</h2>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <button className="submit-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </>
            ) : showOtp ? (
              <>
                <h2>Verify OTP</h2>
                <p className="otp-info">An OTP has been sent to {formData.email}</p>
                <div className="form-group">
                  <label htmlFor="otp">OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <button className="submit-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Verify & Signup"
                  )}
                </button>
                <button
                  className="resend-btn"
                  type="button"
                  onClick={() => requestOtp(formData.email)}
                  disabled={isSubmitting}
                >
                  Resend OTP
                </button>
              </>
            ) : (
              <>
                <h2>Join CollegeBazaar</h2>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="roll_no">Roll Number</label>
                  <input
                    id="roll_no"
                    name="roll_no"
                    type="text"
                    placeholder="Enter your roll number"
                    value={formData.roll_no}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone_no">Phone Number</label>
                  <input
                    id="phone_no"
                    name="phone_no"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone_no}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hostel">Hostel</label>
                  <input
                    id="hostel"
                    name="hostel"
                    type="text"
                    placeholder="Enter your hostel name"
                    value={formData.hostel}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <button className="submit-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Request OTP"
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <style jsx="true">{`
        /* Base styling */
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8f9fa, #e9ecef);
          padding: 20px;
        }

        .dark-mode .auth-page {
          background: linear-gradient(180deg, #121212, #1e1e1e);
        }

        .auth-container {
          display: flex;
          max-width: 900px;
          width: 100%;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .dark-mode .auth-container {
          background: #252525;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .auth-image {
          flex: 1;
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-image img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .auth-form {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2d2d2d;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .dark-mode .logo {
          color: #e0e0e0;
        }

        .logo-icon {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .logo-accent {
          color: #ff4757;
          font-weight: 900;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .auth-tabs {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .auth-tabs button {
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          color: #2d2d2d;
          background: #f0f0f0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .auth-tabs button {
          background: #3a3a3a;
          color: #e0e0e0;
        }

        .auth-tabs button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        .dark-mode .auth-tabs button:hover {
          background: #4a4a4a;
        }

        .auth-tabs button.active {
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        }

        .auth-tabs button.active:hover {
          background: linear-gradient(45deg, #ff2e43, #ff5b6b);
          transform: translateY(-2px);
        }

        .auth-tabs button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d2d2d;
          margin-bottom: 16px;
          text-align: center;
        }

        .dark-mode h2 {
          color: #e0e0e0;
        }

        .otp-info {
          font-size: 0.9rem;
          color: #555;
          text-align: center;
          margin-bottom: 16px;
        }

        .dark-mode .otp-info {
          color: #ccc;
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

        .form-group input {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f8f9fa;
          color: #2d2d2d;
          transition: all 0.3s ease;
        }

        .dark-mode .form-group input {
          border-color: #555;
          background: #333;
          color: #e0e0e0;
        }

        .form-group input:focus {
          outline: none;
          border-color: #ff4757;
          box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.2);
        }

        .form-group input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover {
          background: linear-gradient(45deg, #ff2e43, #ff5b6b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .resend-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          color: #2d2d2d;
          background: #f0f0f0;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-top: 12px;
        }

        .dark-mode .resend-btn {
          background: #3a3a3a;
          color: #e0e0e0;
        }

        .resend-btn:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .dark-mode .resend-btn:hover {
          background: #4a4a4a;
        }

        .resend-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .error-message {
          background: #feecef;
          border-left: 4px solid #ff4757;
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .error-message {
          background: rgba(255, 71, 87, 0.15);
        }

        .error-message p {
          color: #e41e3f;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsiveness */
        @media (max-width: 768px) {
          .auth-container {
            flex-direction: column;
          }

          .auth-image {
            display: none; /* Hide illustration on smaller screens */
          }

          .auth-form {
            padding: 24px;
          }

          .logo {
            font-size: 1.5rem;
          }

          .logo-icon {
            font-size: 1.8rem;
          }

          h2 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .auth-tabs {
            flex-direction: column;
            gap: 12px;
          }

          .auth-tabs button {
            width: 100%;
          }

          .submit-btn,
          .resend-btn {
            font-size: 0.9rem;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}