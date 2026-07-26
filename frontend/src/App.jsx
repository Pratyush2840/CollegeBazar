import { Routes, Route, NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Home from './components/Home';
import About from './components/About';
import Browse from './components/Browse';
import Post from './components/Post';
import AuthPage from './components/AuthPage';
import CompleteProfile from './components/CompleteProfile';
import ProductPage from './components/ProductPage';
import MyListings from './components/MyListings';
import AdminDashboard from './components/AdminDashboard';
import SellerProductPage from './components/SellerProductPage';
import MyBids from './components/MyBids'; // New import
import BoughtProducts from './components/BoughtProducts';
import SoldProducts from './components/SoldProducts';
import { getUserProfile, editProfile } from './api/auth';

export default function App() {
  const navigate = useNavigate();
  const validHostels = ['TH1', 'TH2', 'TH3', 'TH4', 'MA Saraswati', 'Panini', 'Nagarjuna Hostel'];

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isCampusEmail, setIsCampusEmail] = useState(localStorage.getItem('is_campus_email') === 'true');
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone_no: '', hostel: '' });
  const [editError, setEditError] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const profileDrawerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -24,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'transform',
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_campus_email');
    setIsLoggedIn(false);
    setIsCampusEmail(false);
    setShowProfile(false);
    setUserProfile(null);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsCampusEmail(localStorage.getItem('is_campus_email') === 'true');
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfile &&
        profileDrawerRef.current &&
        !profileDrawerRef.current.contains(event.target)
      ) {
        setShowProfile(false);
        setIsEditing(false);
        setEditError('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const fetchProfile = async () => {
    try {
      let profile = await getUserProfile();
      profile = profile.user;
      setUserProfile(profile);
      setEditForm({
        name: profile.name,
        phone_no: profile.phone_no,
        hostel: profile.hostel,
      });
      setProfileError('');
    } catch (err) {
      setProfileError(err.message);
      console.error(err);
    }
  };

  const toggleProfileDrawer = async () => {
    if (!showProfile && isLoggedIn) {
      await fetchProfile();
    }
    setShowProfile(!showProfile);
    setIsEditing(false);
    setEditError('');
  };

  const handleMyListingsClick = () => {
    navigate('/my-listings');
    setShowProfile(false);
  };

  const handleMyBidsClick = () => {
    navigate('/my-bids');
    setShowProfile(false);
  };

  const handleBoughtProductsClick = () => {
    navigate('/bought-products');
    setShowProfile(false);
  };

  const handleSoldProductsClick = () => {
    navigate('/sold-products');
    setShowProfile(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
    setEditForm({
      name: userProfile.name,
      phone_no: userProfile.phone_no,
      hostel: userProfile.hostel,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!editForm.name && !editForm.phone_no && !editForm.hostel) {
      setEditError('Please provide at least one field to update');
      return;
    }

    if (editForm.phone_no && !/^\d{10}$/.test(editForm.phone_no)) {
      setEditError('Phone number must be a 10-digit number');
      return;
    }

    if (editForm.hostel && !validHostels.includes(editForm.hostel)) {
      setEditError(`Hostel must be one of: ${validHostels.join(', ')}`);
      return;
    }

    try {
      const updatedData = {};
      if (editForm.name) updatedData.name = editForm.name;
      if (editForm.phone_no) updatedData.phone_no = editForm.phone_no;
      if (editForm.hostel) updatedData.hostel = editForm.hostel;

      await editProfile(updatedData);
      await fetchProfile();
      setIsEditing(false);
      setEditError('');
      alert('Profile updated successfully');
    } catch (err) {
      setEditError(err.message || 'Failed to update profile');
      console.error('Edit profile error:', err);
    }
  };

  const toggleContactPopup = () => {
    setShowContactPopup(!showContactPopup);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="navbar" ref={navRef}>
        <div className="logo">
          <NavLink to="/">
            <img src="/assets/logo-mark.svg" alt="" className="logo-icon" />
            <span>College<span className="red-letter">B</span>azaar</span>
          </NavLink>
        </div>

        <ul className={`nav-links ${mobileNavOpen ? "nav-links-open" : ""}`}>
          <li><NavLink to="/" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink></li>
          {isLoggedIn ? (
            <li><NavLink to="/browse" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>Browse</NavLink></li>
          ) : (
            <>
              <li><NavLink to="/about" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>About Us</NavLink></li>
              <li><button onClick={() => { toggleContactPopup(); setMobileNavOpen(false); }} className="nav-text-btn">Contact Us</button></li>
            </>
          )}
          {isLoggedIn ? (
            isCampusEmail && (
              <li>
                <NavLink to="/post" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>
                  Post Item
                </NavLink>
              </li>
            )
          ) : (
            <li>
              <NavLink to="/login" onClick={() => setMobileNavOpen(false)} className="login-btn">
                Login
              </NavLink>
            </li>
          )}
        </ul>
        <div className="nav-actions">
          <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle Dark Mode">
            {darkMode ? (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="hamburger-btn"
            title="Menu"
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {isLoggedIn && (
            <>
              <div className="profile-container">
                <button onClick={toggleProfileDrawer} className="profile-icon" title="Profile">
                  <div className="avatar">
                    {userProfile?.picture_url ? (
                      <img src={userProfile.picture_url} alt="Profile" className="avatar-img" />
                    ) : userProfile?.name ? (
                      userProfile.name.charAt(0)
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                </button>
                {showProfile && (
                  <div className="profile-drawer" ref={profileDrawerRef}>
                    <div className="drawer-header">
                      <h2>My Profile</h2>
                      <button className="close-btn" onClick={toggleProfileDrawer}>×</button>
                    </div>

                    {profileError && (
                      <div className="error-message">
                        <p>{profileError}</p>
                        <button onClick={toggleProfileDrawer}>Try Again</button>
                      </div>
                    )}

                    {userProfile ? (
                      <>
                        <div className="profile-card">
                          <div className="profile-avatar">
                            {userProfile.picture_url ? (
                              <img src={userProfile.picture_url} alt="Profile" className="avatar-img" />
                            ) : (
                              userProfile.name.charAt(0)
                            )}
                          </div>
                          {isEditing ? (
                            <form onSubmit={handleSaveProfile} className="edit-profile-form">
                              <div className="edit-field">
                                <label htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleInputChange}
                                  placeholder="Enter your name"
                                />
                              </div>
                              <div className="edit-field">
                                <label htmlFor="phone_no">Phone Number</label>
                                <input
                                  type="tel"
                                  id="phone_no"
                                  name="phone_no"
                                  value={editForm.phone_no}
                                  onChange={handleInputChange}
                                  placeholder="Enter your phone number"
                                />
                              </div>
                              <div className="edit-field">
                                <label htmlFor="hostel">Hostel</label>
                                <select
                                  id="hostel"
                                  name="hostel"
                                  value={editForm.hostel}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Select your hostel</option>
                                  {validHostels.map((h) => (
                                    <option key={h} value={h}>{h}</option>
                                  ))}
                                </select>
                              </div>
                              {editError && (
                                <div className="error-message">
                                  <p>{editError}</p>
                                </div>
                              )}
                              <div className="edit-actions">
                                <button type="submit" className="btn-save">
                                  <span className="btn-icon">💾</span> Save
                                </button>
                                <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                                  <span className="btn-icon">✖️</span> Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="profile-name">{userProfile.name}</div>
                              <div className="profile-roll">{userProfile.roll_no}</div>
                            </>
                          )}
                        </div>

                        {!isEditing && (
                          <>
                            <div className="profile-details">
                              <div className="detail-item">
                                <span className="detail-icon">📧</span>
                                <div>
                                  <h4>Email</h4>
                                  <p>{userProfile.email}</p>
                                </div>
                              </div>
                              <div className="detail-item">
                                <span className="detail-icon">📱</span>
                                <div>
                                  <h4>Phone</h4>
                                  <p>{userProfile.phone_no}</p>
                                </div>
                              </div>
                              <div className="detail-item">
                                <span className="detail-icon">🏨</span>
                                <div>
                                  <h4>Hostel</h4>
                                  <p>{userProfile.hostel}</p>
                                </div>
                              </div>
                            </div>

                            <div className="profile-actions">
                              <button className="btn-edit" onClick={handleEditProfile}>
                                <span className="btn-icon">✏️</span> Edit Profile
                              </button>
                              <button className="btn-view-listings" onClick={handleMyListingsClick}>
                                <span className="btn-icon">📋</span> My Listings
                              </button>
                              <button className="btn-view-bids" onClick={handleMyBidsClick}>
                                <span className="btn-icon">💰</span> My Bids
                              </button>
                              <button className="btn-view-bids" onClick={handleBoughtProductsClick}>
                                <span className="btn-icon">🛍️</span> Bought Products
                              </button>
                              <button className="btn-view-bids" onClick={handleSoldProductsClick}>
                                <span className="btn-icon">🏷️</span> Sold Products
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      !profileError && (
                        <div className="loading-profile">
                          <div className="spinner"></div>
                          <p>Loading your profile...</p>
                        </div>
                      )
                    )}

                    <div className="drawer-footer">
                      <button onClick={handleLogout} className="logout-btn">
                        <span className="btn-icon">🚪</span> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} isCampusEmail={isCampusEmail} />} />
          <Route path="/about" element={<About />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/post" element={isLoggedIn ? (isCampusEmail ? <Post /> : <Navigate to="/" />) : <Navigate to="/login" />} />
          <Route path="/login" element={<AuthPage defaultTab="login" setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<AuthPage defaultTab="signup" setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/complete-profile" element={isLoggedIn ? <CompleteProfile /> : <Navigate to="/login" />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/seller/product" element={<SellerProductPage />} />
          <Route path="/my-listings" element={isLoggedIn ? <MyListings /> : <Navigate to="/login" />} />
          <Route path="/my-bids" element={isLoggedIn ? <MyBids /> : <Navigate to="/login" />} />
          <Route path="/bought-products" element={isLoggedIn ? <BoughtProducts /> : <Navigate to="/login" />} />
          <Route path="/sold-products" element={isLoggedIn ? <SoldProducts /> : <Navigate to="/login" />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 CollegeBazaar. All rights reserved.</p>
          <div className="footer-links">
            <button onClick={toggleContactPopup} className="contact-link">Contact Us</button>
            <Link to="/admin" className="contact-link">Admin Dashboard</Link>
          </div>
        </div>
      </footer>

      {showContactPopup && (
        <div className="contact-popup">
          <div className="contact-popup-content">
            <h3>Contact Our Admins</h3>
            <ul>
              <li><a href="mailto:23bcs200@iiitdmj.ac.in">23bcs200@iiitdmj.ac.in</a></li>
              <li><a href="mailto:psingh08iph@gmail.com">psingh08iph@gmail.com</a></li>
            </ul>
            <button onClick={toggleContactPopup} className="close-popup">Close</button>
          </div>
        </div>
      )}

      <style jsx="true">{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(180deg, #f5f7fa, #e2e8f0);
          color: #1f2937;
          line-height: 1.7;
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .content-container {
          flex: 1;
          padding: 3rem 1.5rem;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }

        .dark-mode {
          background: linear-gradient(180deg, #0f172a, #1e293b);
          color: #f1f5f9;
        }

        .dark-mode .profile-drawer {
          background: #1e293b;
          border-left: 1px solid #475569;
          color: #f1f5f9;
        }

        .dark-mode .profile-card {
          background: #334155;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        .dark-mode .detail-item {
          background: #475569;
          border: 1px solid #64748b;
        }

        .dark-mode .profile-actions button {
          background: #475569;
          color: #f1f5f9;
        }

        .dark-mode .profile-actions button:hover {
          background: #64748b;
          transform: translateY(-2px);
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0;
          padding: 0.85rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: inherit;
          z-index: -1;
        }

        .logo a {
          font-size: 2rem;
          font-weight: 900;
          text-decoration: none;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: 1.2px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
        }

        .red-letter {
          color: #60a5fa;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 0.4rem;
          margin: 0;
        }

        .nav-links a,
        .nav-text-btn {
          text-decoration: none;
          color: #cbd5e1 !important;
          font-weight: 600;
          font-size: 1.02rem;
          padding: 0.55rem 1.15rem;
          border-radius: 999px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.3px;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .nav-text-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .nav-links a:hover,
        .nav-text-btn:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08);
        }

        .active-link {
          color: #ffffff !important;
          font-weight: 700 !important;
          background: rgba(96, 165, 250, 0.18);
        }

        .login-btn {
          background: #1d4ed8;
          color: white !important;
          padding: 12px 24px !important;
          border-radius: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 3px 12px rgba(29, 78, 216, 0.4);
        }

        .login-btn:hover {
          background: #1e40af;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(29, 78, 216, 0.6);
        }

        .nav-icon {
          font-size: 1.3rem;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .theme-toggle {
          background: none;
          border: none;
          color: #f8fafc;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.15);
        }

        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger-btn span {
          display: block;
          width: 24px;
          height: 2px;
          background: #f8fafc;
          border-radius: 2px;
        }

        .profile-container {
          position: relative;
        }

        .profile-icon {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #1d4ed8;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.4rem;
          box-shadow: 0 3px 12px rgba(29, 78, 216, 0.4);
          overflow: hidden;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .profile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 50%;
          min-width: 380px;
          max-width: 640px;
          height: 100%;
          background: linear-gradient(180deg, #ffffff, #f8fafc);
          border-left: 1px solid #e2e8f0;
          padding: 0;
          box-shadow: -12px 0 24px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          overflow-y: auto;
          border-radius: 20px 0 0 20px;
          animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 20px 0 0 0;
        }

        .dark-mode .drawer-header {
          border-bottom-color: #475569;
          background: #1e293b;
        }

        .drawer-header h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0;
          color: #1f2937;
        }

        .dark-mode .drawer-header h2 {
          color: #f1f5f9;
        }

        .close-btn {
          font-size: 2rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.15);
          color: #1f2937;
          transform: rotate(90deg);
        }

        .dark-mode .close-btn {
          color: #cbd5e1;
        }

        .dark-mode .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #f1f5f9;
        }

        .profile-card {
          padding: 2rem;
          background: #ffffff;
          border-radius: 16px;
          margin: 2rem;
          text-align: center;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .profile-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #1d4ed8;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 auto 1rem;
          box-shadow: 0 6px 16px rgba(29, 78, 216, 0.4);
          overflow: hidden;
        }

        .profile-name {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .dark-mode .profile-name {
          color: #f1f5f9;
        }

        .profile-roll {
          color: #6b7280;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .dark-mode .profile-roll {
          color: #cbd5e1;
        }

        .edit-profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 1.5rem;
        }

        .edit-field {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .edit-field label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .dark-mode .edit-field label {
          color: #cbd5e1;
        }

        .edit-field input,
        .edit-field select {
          padding: 12px;
          font-size: 1.1rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          color: #1f2937;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .edit-field input:focus,
        .edit-field select:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.2);
        }

        .dark-mode .edit-field input,
        .dark-mode .edit-field select {
          background: #334155;
          border-color: #475569;
          color: #f1f5f9;
        }

        .dark-mode .edit-field input:focus,
        .dark-mode .edit-field select:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
        }

        .edit-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-save {
          flex: 1;
          background: linear-gradient(45deg, #22c55e, #4ade80);
          color: #ffffff !important;
          padding: 14px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 3px 12px rgba(34, 197, 94, 0.4);
          transition: all 0.3s ease;
        }

        .btn-save:hover {
          background: linear-gradient(45deg, #16a34a, #22c55e);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(34, 197, 94, 0.6);
        }

        .dark-mode .btn-save {
          background: linear-gradient(45deg, #15803d, #22c55e);
          box-shadow: 0 3px 12px rgba(34, 197, 94, 0.4);
        }

        .dark-mode .btn-save:hover {
          background: linear-gradient(45deg, #166534, #15803d);
          box-shadow: 0 6px 16px rgba(34, 197, 94, 0.6);
        }

        .btn-cancel {
          flex: 1;
          background: linear-gradient(45deg, #6b7280, #9ca3af);
          color: #ffffff !important;
          padding: 14px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 3px 12px rgba(107, 114, 128, 0.4);
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: linear-gradient(45deg, #4b5563, #6b7280);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(107, 114, 128, 0.6);
        }

        .dark-mode .btn-cancel {
          background: linear-gradient(45deg, #6b7280, #9ca3af);
          box-shadow: 0 3px 12px rgba(107, 114, 128, 0.4);
        }

        .dark-mode .btn-cancel:hover {
          background: linear-gradient(45deg, #4b5563, #6b7280);
          box-shadow: 0 6px 16px rgba(107, 114, 128, 0.6);
        }

        .profile-details {
          padding: 0 2rem;
          margin-top: 2rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 1rem;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
        }

        .detail-icon {
          font-size: 1.8rem;
          margin-right: 1.25rem;
          opacity: 0.85;
        }

        .detail-item h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .dark-mode .detail-item h4 {
          color: #f1f5f9;
          font-weight: 600;
        }

        .detail-item p {
          font-size: 1.1rem;
          color: #1f2937;
          font-weight: 500;
        }

        .dark-mode .detail-item p {
          color: #f1f5f9;
        }

        .profile-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          margin: 2rem 0;
        }

        .dark-mode .profile-stats {
          border-color: #475569;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1d4ed8;
        }

        .stat-label {
          font-size: 0.95rem;
          color: #6b7280;
        }

        .dark-mode .stat-label {
          color: #cbd5e1;
        }

        .profile-actions {
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .profile-actions button {
          padding: 1rem;
          font-size: 1.1rem;
          color: #1f2937;
          background: #f1f5f9;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-weight: 600;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
        }

        .profile-actions button:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        .btn-icon {
          font-size: 1.3rem;
        }

        .drawer-footer {
          padding: 2rem;
          margin-top: 2rem;
        }

        .logout-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          color: #fff;
          background: #1d4ed8;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-weight: 600;
          box-shadow: 0 3px 12px rgba(29, 78, 216, 0.4);
        }

        .logout-btn:hover {
          background: #1e40af;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(29, 78, 216, 0.6);
        }

        .loading-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
        }

        .spinner {
          width: 56px;
          height: 56px;
          border: 5px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #1d4ed8;
          animation: spin 0.8s ease-in-out infinite;
          margin-bottom: 1.25rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .dark-mode .spinner {
          border-color: rgba(255, 255, 255, 0.1);
          border-top-color: #60a5fa;
        }

        .error-message {
          background: #fee2e2;
          border-left: 5px solid #1d4ed8;
          padding: 1.25rem;
          margin: 2rem;
          border-radius: 10px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .error-message {
          background: rgba(29, 78, 216, 0.2);
        }

        .error-message p {
          color: #b91c1c;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .error-message button {
          background: #1d4ed8;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .error-message button:hover {
          background: #1e40af;
          transform: translateY(-1px);
        }

        .hero {
          position: relative;
          background: url('/assets/campus-hero.jpg') no-repeat center center/cover;
          padding: 6rem 1.5rem;
          text-align: center;
          border-radius: 16px;
          margin-bottom: 3rem;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.75));
          z-index: 1;
        }

        .dark-mode .hero::before {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.85));
        }

        .hero-overlay {
          position: relative;
          z-index: 2;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 1.25rem;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
        }

        .hero-content p {
          font-size: 1.5rem;
          color: #e5e7eb;
          margin-bottom: 2rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .btn {
          background: #1d4ed8;
          color: #ffffff !important;
          padding: 14px 28px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 3px 12px rgba(29, 78, 216, 0.4);
        }

        .btn:hover {
          background: #1e40af;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(29, 78, 216, 0.6);
        }

        .btn.secondary {
          background: linear-gradient(45deg, #dbeafe, #bfdbfe);
          color: #2563eb !important;
          box-shadow: 0 3px 12px rgba(37, 99, 235, 0.4);
        }

        .btn.secondary:hover {
          background: linear-gradient(45deg, #bfdbfe, #93c5fd);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
        }

        .dark-mode .btn {
          background: #60a5fa;
          color: #1f2937 !important;
          box-shadow: 0 3px 12px rgba(96, 165, 250, 0.4);
        }

        .dark-mode .btn:hover {
          background: #3b82f6;
          box-shadow: 0 6px 16px rgba(96, 165, 250, 0.6);
        }

        .dark-mode .btn.secondary {
          background: linear-gradient(45deg, #334155, #475569);
          color: #f1f5f9 !important;
          box-shadow: 0 3px 12px rgba(255, 255, 255, 0.3);
        }

        .dark-mode .btn.secondary:hover {
          background: linear-gradient(45deg, #475569, #64748b);
          box-shadow: 0 6px 16px rgba(255, 255, 255, 0.4);
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .feature-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
        }

        .dark-mode .feature-card {
          background: #334155;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        .feature-card h3 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .dark-mode .feature-card h3 {
          color: #f1f5f9;
        }

        .feature-card p {
          font-size: 1.1rem;
          color: #6b7280;
        }

        .dark-mode .feature-card p {
          color: #cbd5e1;
        }

        .shop-by-category {
          margin: 3rem 0;
        }

        .shop-heading {
          font-size: 2.5rem;
          font-weight: 900;
          text-align: center;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        .dark-mode .shop-heading {
          color: #f1f5f9;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
        }

        .category-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
        }

        .category-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }

        .footer {
          background: linear-gradient(45deg, #ffffff, #f8fafc);
          padding: 2rem;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .footer {
          background: #1e293b;
          border-top: 1px solid #475569;
        }

        .footer-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
        }

        .footer-content p {
          margin: 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .dark-mode .footer-content p {
          color: #f1f5f9;
        }

        .contact-link {
          background: none;
          border: none;
          color: #1d4ed8;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .contact-link:hover {
          color: #1e3a8a;
        }

        .dark-mode .contact-link {
          color: #60a5fa;
        }

        .dark-mode .contact-link:hover {
          color: #3b82f6;
        }

        .contact-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .contact-popup-content {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .dark-mode .contact-popup-content {
          background: #334155;
          color: #f1f5f9;
        }

        .contact-popup-content h3 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .dark-mode .contact-popup-content h3 {
          color: #f1f5f9;
        }

        .contact-popup-content ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }

        .contact-popup-content li {
          margin: 0.75rem 0;
        }

        .contact-popup-content a {
          color: #1d4ed8;
          text-decoration: none;
          font-size: 1.1rem;
        }

        .contact-popup-content a:hover {
          text-decoration: underline;
        }

        .dark-mode .contact-popup-content a {
          color: #60a5fa;
        }

        .close-popup {
          background: #1d4ed8;
          color: #ffffff;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .close-popup:hover {
          background: #1e40af;
          transform: translateY(-2px);
        }

        .dark-mode .close-popup {
          background: #60a5fa;
          color: #1f2937;
        }

        .dark-mode .close-popup:hover {
          background: #3b82f6;
        }

        @media (max-width: 768px) {
          .navbar {
            margin: 0;
            padding: 0.85rem 1.25rem;
            position: relative;
          }

          .hamburger-btn {
            display: flex;
          }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(14px);
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding: 0 1.25rem;
          }

          .nav-links-open {
            max-height: 320px;
            padding-top: 0.75rem;
            padding-bottom: 1rem;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
          }

          .nav-links a,
          .nav-text-btn {
            border-radius: 12px;
            width: 100%;
          }

          .nav-links li {
            padding: 0.5rem 0;
          }

          .profile-drawer {
            width: 100%;
            border-radius: 0;
          }

          .profile-actions {
            flex-direction: column;
          }

          .content-container {
            padding: 2rem 1rem;
          }

          .hero {
            padding: 4rem 1rem;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .footer-content {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .nav-links a span {
            display: none;
          }

          .nav-links {
            gap: 1.5rem;
          }

          .logo a {
            font-size: 1.75rem;
          }

          .logo-icon {
            width: 32px;
            height: 32px;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content p {
            font-size: 1.25rem;
          }

          .shop-heading {
            font-size: 2rem;
          }

          .contact-popup-content {
            padding: 1.5rem;
          }
        }

        .footer-links {
          display: flex;
          gap: 24px; /* Increased spacing between links */
          align-items: center;
        }
        
        .footer-links .contact-link {
          background: none;
          border: none;
          color: #007bff;
          text-decoration: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          padding: 8px 12px;
          transition: color 0.3s ease, text-decoration 0.3s ease;
          line-height: 1.5;
        }
        
        .footer-links .contact-link:hover {
          color: #0056b3;
          text-decoration: underline;
        }
        
        .dark-mode .footer-links .contact-link {
          color: #90caf9;
        }
        
        .dark-mode .footer-links .contact-link:hover {
          color: #64b5f6;
          text-decoration: underline;
        }
        
        /* Ensure button and Link render identically */
        .footer-links button.contact-link,
        .footer-links a.contact-link {
          display: inline-block;
          text-align: center;
          appearance: none; /* Remove default button styling */
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        
      `}</style>
    </div>
  );
}