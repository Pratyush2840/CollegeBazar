import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { login, requestOtp, verifyOtpAndSignup, googleAuth } from "../api/auth";

const validHostels = ['TH1', 'TH2', 'TH3', 'TH4', 'MA Saraswati', 'Panini', 'Nagarjuna Hostel'];

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
      if (!formData.email.endsWith("@iiitdmj.ac.in")) {
        setError("Email must be from @iiitdmj.ac.in domain");
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
      if (!formData.email.endsWith("@iiitdmj.ac.in")) {
        setError("Email must be from @iiitdmj.ac.in domain");
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
        const { token, is_campus_email } = await login(formData.email, formData.password);
        localStorage.setItem("token", token);
        localStorage.setItem("is_campus_email", String(!!is_campus_email));
        setIsLoggedIn(true);
        navigate("/");
      } else if (!showOtp) {
        await requestOtp(formData.email);
        setShowOtp(true);
      } else {
        await verifyOtpAndSignup(formData);
        // Assuming verifyOtpAndSignup returns a token
        const { token, is_campus_email } = await login(formData.email, formData.password); // Auto-login after signup
        localStorage.setItem("token", token);
        localStorage.setItem("is_campus_email", String(!!is_campus_email));
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setIsSubmitting(true);
    try {
      const { token, needsProfileCompletion, is_campus_email } = await googleAuth(credentialResponse.credential);
      localStorage.setItem("token", token);
      localStorage.setItem("is_campus_email", String(!!is_campus_email));
      setIsLoggedIn(true);
      navigate(needsProfileCompletion ? "/complete-profile" : "/");
    } catch (err) {
      setError(err.message || "Google login failed");
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
      <div className={`auth-container ${!isLogin ? "right-panel-active" : ""}`}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit}>
            {!isLogin && error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {showOtp ? (
              <>
                <h2>Verify OTP</h2>
                <span className="form-subtitle">An OTP has been sent to {formData.email}</span>
                <input
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <button className="butt" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner"></span> : "Verify & Signup"}
                </button>
                <button
                  className="text-link"
                  type="button"
                  onClick={() => requestOtp(formData.email)}
                  disabled={isSubmitting}
                >
                  Resend OTP
                </button>
              </>
            ) : (
              <>
                <h2>Create Account</h2>
                <span className="form-subtitle">Use your @iiitdmj.ac.in email to register</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <input
                  name="roll_no"
                  type="text"
                  placeholder="Roll Number"
                  value={formData.roll_no}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <input
                  name="phone_no"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone_no}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <select
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
                <button className="butt" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner"></span> : "Sign Up"}
                </button>
              </>
            )}
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit}>
            {isLogin && error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <h2>Sign in</h2>
            <span className="form-subtitle">Use your @iiitdmj.ac.in account</span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <button className="butt signinbutton" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner"></span> : "Sign In"}
            </button>
            <div className="oauth-divider"><span>OR</span></div>
            <div className="google-btn-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
                useOneTap
              />
            </div>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>Welcome Back!</h2>
              <p>Already have an account? Sign in to keep buying and selling on campus.</p>
              <button className="butt ghost" type="button" onClick={() => switchTab("login")} disabled={isSubmitting}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2>Hello, Friend!</h2>
              <p>New to CollegeBazaar? Create an account and start trading within your campus.</p>
              <button className="butt ghost" type="button" onClick={() => switchTab("signup")} disabled={isSubmitting}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
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
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          width: 820px;
          max-width: 100%;
          min-height: 560px;
        }

        .dark-mode .auth-container {
          background: #1e293b;
        }

        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          transition: all 0.6s ease-in-out;
          overflow-y: auto;
        }

        .form-container form {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          padding: 40px 44px;
          min-height: 100%;
          justify-content: center;
          align-items: stretch;
          text-align: center;
        }

        .dark-mode .form-container form {
          background: #1e293b;
        }

        .form-container h2 {
          font-weight: 800;
          font-size: 1.9rem;
          color: #0f172a;
          margin: 0 0 8px;
        }

        .dark-mode .form-container h2 {
          color: #f1f5f9;
        }

        .form-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 20px;
        }

        .dark-mode .form-subtitle {
          color: #94a3b8;
        }

        .form-container input,
        .form-container select {
          background: #f1f5f9;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 12px 15px;
          margin: 6px 0;
          width: 100%;
          font-size: 0.95rem;
          color: #0f172a;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .dark-mode .form-container input,
        .dark-mode .form-container select {
          background: #334155;
          color: #f1f5f9;
        }

        .form-container input:focus,
        .form-container select:focus {
          outline: none;
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
        }

        .form-container input:disabled,
        .form-container select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sign-in-container {
          left: 0;
          z-index: 2;
        }

        .sign-up-container {
          left: 0;
          z-index: 1;
          opacity: 0;
        }

        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 100;
        }

        .overlay {
          background: linear-gradient(135deg, #0f172a, #1d4ed8);
          color: #ffffff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }

        .overlay-panel {
          position: absolute;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 48px;
          height: 100%;
          width: 50%;
          text-align: center;
        }

        .overlay-panel h2 {
          font-weight: 800;
          font-size: 1.9rem;
          margin: 0 0 16px;
        }

        .overlay-panel p {
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0 0 28px;
          opacity: 0.9;
        }

        .overlay-right {
          right: 0;
        }

        .overlay-left {
          left: 0;
          transform: translateX(-20%);
        }

        .auth-container.right-panel-active .sign-in-container {
          transform: translateX(100%);
        }

        .auth-container.right-panel-active .overlay-container {
          transform: translateX(-100%);
        }

        .auth-container.right-panel-active .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
        }

        .auth-container.right-panel-active .overlay {
          transform: translateX(50%);
        }

        .auth-container.right-panel-active .overlay-left {
          transform: translateX(0);
        }

        .auth-container.right-panel-active .overlay-right {
          transform: translateX(20%);
        }

        .butt {
          border-radius: 24px;
          border: none;
          background: #1d4ed8;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 13px 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 12px;
          transition: background 0.2s, transform 0.08s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .butt:hover {
          background: #1e40af;
        }

        .butt:active {
          transform: scale(0.97);
        }

        .butt:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .butt.ghost {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .butt.ghost:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .text-link {
          background: none;
          border: none;
          color: #1d4ed8;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 14px;
        }

        .dark-mode .text-link {
          color: #60a5fa;
        }

        .text-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee2e2;
          border-left: 4px solid #dc2626;
          padding: 12px 14px;
          margin-bottom: 12px;
          border-radius: 8px;
          text-align: left;
        }

        .dark-mode .error-message {
          background: rgba(220, 38, 38, 0.15);
        }

        .error-message p {
          color: #b91c1c;
          font-weight: 500;
          font-size: 0.85rem;
          margin: 0;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .oauth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 16px 0;
          color: #999;
          font-size: 0.8rem;
        }

        .oauth-divider::before,
        .oauth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #ddd;
        }

        .dark-mode .oauth-divider::before,
        .dark-mode .oauth-divider::after {
          border-bottom-color: #475569;
        }

        .oauth-divider span {
          padding: 0 12px;
        }

        .google-btn-wrapper {
          display: flex;
          justify-content: center;
        }

        /* Responsiveness: the sliding-panel trick doesn't work on narrow screens, fall back to a simple stacked layout */
        @media (max-width: 768px) {
          .auth-container {
            width: 100%;
            min-height: 0;
            overflow: visible;
          }

          .form-container {
            position: static;
            width: 100%;
            transform: none !important;
            opacity: 1 !important;
            z-index: 1 !important;
          }

          .sign-up-container {
            display: none;
          }

          .auth-container.right-panel-active .sign-up-container {
            display: block;
          }

          .auth-container.right-panel-active .sign-in-container {
            display: none;
          }

          .overlay-container {
            position: static;
            width: 100%;
            height: auto;
            transform: none !important;
          }

          .overlay {
            position: static;
            width: 100%;
            height: auto;
            left: 0;
            transform: none !important;
            display: flex;
            flex-direction: column;
          }

          .overlay-panel {
            position: static;
            width: 100%;
            padding: 24px;
            transform: none !important;
          }

          .overlay-left {
            display: none;
          }

          .auth-container.right-panel-active .overlay-left {
            display: flex;
          }

          .auth-container.right-panel-active .overlay-right {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
