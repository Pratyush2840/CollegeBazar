import { Routes, Route, NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Home from './components/Home';
import Browse from './components/Browse';
import Post from './components/Post';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import MyListings from './components/MyListings';
import AdminDashboard from './components/AdminDashboard';
import SellerProductPage from './components/SellerProductPage';
import MyBids from './components/MyBids'; // New import
import { getUserProfile, editProfile } from './api/auth';

export default function App() {
  const navigate = useNavigate();
  const validHostels = ['BH1', 'BH2', 'BH3', 'BH4', 'BH5', 'GH1', 'GH2', 'GH3'];

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone_no: '', hostel: '' });
  const [editError, setEditError] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const profileDrawerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowProfile(false);
    setUserProfile(null);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/">
            <span className="logo-icon">🎓</span>
            College<span className="red-letter">B</span>azaar
          </NavLink>
        </div>

        <ul className="nav-links">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink></li>
          <li><NavLink to="/browse" className={({ isActive }) => isActive ? "active-link" : ""}>Browse</NavLink></li>
          <li>
            {isLoggedIn ? (
              <NavLink to="/post" className={({ isActive }) => isActive ? "active-link" : ""}>
                <span className="nav-icon">📦</span> Post Item
              </NavLink>
            ) : (
              <NavLink to="/login" className="login-btn">
                <span className="nav-icon">👤</span> Login
              </NavLink>
            )}
          </li>
        </ul>
        <div className="nav-actions">
          <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle Dark Mode">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {isLoggedIn && (
            <>
              <div className="profile-container">
                <button onClick={toggleProfileDrawer} className="profile-icon" title="Profile">
                  <div className="avatar">
                    {userProfile?.name?.charAt(0) || '👤'}
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
                            {userProfile.name.charAt(0)}
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
                                <input
                                  type="text"
                                  id="hostel"
                                  name="hostel"
                                  value={editForm.hostel}
                                  onChange={handleInputChange}
                                  placeholder="Enter your hostel"
                                />
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
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/post" element={isLoggedIn ? <Post /> : <Navigate to="/login" />} />
          <Route path="/login" element={<AuthPage defaultTab="login" setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<AuthPage defaultTab="signup" setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/seller/product" element={<SellerProductPage />} />
          <Route path="/my-listings" element={isLoggedIn ? <MyListings /> : <Navigate to="/login" />} />
          <Route path="/my-bids" element={isLoggedIn ? <MyBids /> : <Navigate to="/login" />} />
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
              <li><a href="mailto:IIT2023077@iiita.ac.in">IIT2023077@iiita.ac.in</a></li>
              <li><a href="mailto:IIT2023078@iiita.ac.in">IIT2023078@iiita.ac.in</a></li>
              <li><a href="mailto:IIT2023079@iiita.ac.in">IIT2023079@iiita.ac.in</a></li>
              <li><a href="mailto:IIT2023080@iiita.ac.in">IIT2023080@iiita.ac.in</a></li>
              <li><a href="mailto:IIT2023083@iiita.ac.in">IIT2023083@iiita.ac.in</a></li>
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

        .dark-mode .navbar {
          background: #1e293b;
          border-bottom: 1px solid #475569;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
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

        .dark-mode .btn-edit {
          background: linear-gradient(45deg, #2563eb, #3b82f6) !important;
          color: #ffffff !important;
        }

        .dark-mode .btn-view-listings {
          background: linear-gradient(45deg, #15803d, #22c55e) !important;
          color: #ffffff !important;
        }

        .dark-mode .btn-view-bids {
          background: linear-gradient(45deg, #d97706, #f59e0b) !important;
          color: #ffffff !important;
        }

        .dark-mode .profile-actions button:hover {
          background: #64748b;
          transform: translateY(-2px);
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 3rem;
          background: linear-gradient(45deg, #ffffff, #f8fafc);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
          border-radius: 0 0 16px 16px;
        }

        .logo a {
          font-size: 2rem;
          font-weight: 900;
          text-decoration: none;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: 1.2px;
        }

        .dark-mode .logo a {
          color: #f1f5f9;
        }

        .logo-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
        }

        .red-letter {
          color: #ef4444;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 3rem;
          margin: 0;
          padding-top: 0.75rem;
        }

        .nav-links a {
          text-decoration: none;
          color: #1f2937 !important;
          font-weight: 700;
          font-size: 1.15rem;
          padding: 0.75rem 0;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.5px;
        }

        .nav-links a:hover {
          color: #ef4444 !important;
          transform: translateY(-1px);
        }

        .dark-mode .nav-links a {
          color: #f1f5f9 !important;
        }

        .active-link {
          color: #ef4444 !important;
          font-weight: 800 !important;
          border-bottom: 4px solid #ef4444;
        }

        .dark-mode .active-link {
          color: #60a5fa !important;
          border-bottom-color: #60a5fa !important;
        }

        .login-btn {
          background: linear-gradient(45deg, #ef4444, #f87171);
          color: white !important;
          padding: 12px 24px !important;
          border-radius: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 3px 12px rgba(239, 68, 68, 0.4);
        }

        .login-btn:hover {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.6);
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
          font-size: 1.6rem;
          cursor: pointer;
          padding: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
        }

        .theme-toggle:hover {
          background: rgba(0, 0, 0, 0.15);
          transform: scale(1.15);
        }

        .dark-mode .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
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
          background: linear-gradient(45deg, #ef4444, #f87171);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.4rem;
          box-shadow: 0 3px 12px rgba(239, 68, 68, 0.4);
        }

        .profile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 450px;
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
          background: linear-gradient(45deg, #ef4444, #f87171);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 auto 1rem;
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
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

        .edit-field input {
          padding: 12px;
          font-size: 1.1rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          color: #1f2937;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .edit-field input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }

        .dark-mode .edit-field input {
          background: #334155;
          border-color: #475569;
          color: #f1f5f9;
        }

        .dark-mode .edit-field input:focus {
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
          color: #ef4444;
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

        .btn-edit {
          background: linear-gradient(45deg, #dbeafe, #bfdbfe) !important;
          color: #2563eb !important;
        }

        .btn-edit:hover {
          background: linear-gradient(45deg, #bfdbfe, #93c5fd) !important;
        }

        .btn-view-listings {
          background: linear-gradient(45deg, #dcfce7, #bbf7d0) !important;
          color: #16a34a !important;
        }

        .btn-view-listings:hover {
          background: linear-gradient(45deg, #bbf7d0, #86efac) !important;
        }

        .btn-view-bids {
          background: linear-gradient(45deg, #fef3c7, #fde68a) !important;
          color: #d97706 !important;
        }

        .btn-view-bids:hover {
          background: linear-gradient(45deg, #fde68a, #fcd34d) !important;
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
          background: linear-gradient(45deg, #ef4444, #f87171);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-weight: 600;
          box-shadow: 0 3px 12px rgba(239, 68, 68, 0.4);
        }

        .logout-btn:hover {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.6);
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
          border-top-color: #ef4444;
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
          border-left: 5px solid #ef4444;
          padding: 1.25rem;
          margin: 2rem;
          border-radius: 10px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .error-message {
          background: rgba(239, 68, 68, 0.2);
        }

        .error-message p {
          color: #b91c1c;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .error-message button {
          background: linear-gradient(45deg, #ef4444, #f87171);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .error-message button:hover {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          transform: translateY(-1px);
        }

        .hero {
          position: relative;
          background: url('/assets/bgim.webp') no-repeat center center/cover;
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
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        .dark-mode .hero::before {
          background: rgba(0, 0, 0, 0.7);
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
          background: linear-gradient(45deg, #ef4444, #f87171);
          color: #ffffff !important;
          padding: 14px 28px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 3px 12px rgba(239, 68, 68, 0.4);
        }

        .btn:hover {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.6);
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
          background: linear-gradient(45deg, #60a5fa, #93c5fd);
          color: #1f2937 !important;
          box-shadow: 0 3px 12px rgba(96, 165, 250, 0.4);
        }

        .dark-mode .btn:hover {
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
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
          color: #ef4444;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .contact-link:hover {
          color: #dc2626;
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
          color: #ef4444;
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
          background: linear-gradient(45deg, #ef4444, #f87171);
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
          background: linear-gradient(45deg, #dc2626, #ef4444);
          transform: translateY(-2px);
        }

        .dark-mode .close-popup {
          background: linear-gradient(45deg, #60a5fa, #93c5fd);
          color: #1f2937;
        }

        .dark-mode .close-popup:hover {
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 2rem;
          }

          .nav-links {
            gap: 2rem;
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
            font-size: 2rem;
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