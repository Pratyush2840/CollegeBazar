import React, { useState, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL } from '../config.js';

export default function Post() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    asking_price: '',
    deadline: null,
    category: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const categories = [
    'Electronics',
    'Textbooks',
    'Furniture',
    'Accessories',
    'Miscellaneous'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'asking_price' ? (value ? parseInt(value) : '') : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, deadline: date }));
    setErrors(prev => ({ ...prev, deadline: '' }));
  };

  const handleImageChange = (files) => {
    const newImages = Array.from(files).slice(0, 4 - images.length);
    setImages(prev => [...prev, ...newImages]);
  };

  const handleFileInputChange = (e) => {
    handleImageChange(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('drag-over');
    handleImageChange(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('drag-over');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.asking_price || formData.asking_price <= 0) newErrors.asking_price = 'Valid price is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post a product.');
      setLoading(false);
      return;
    }

    try {
      const productRes = await axios.post(
        API_URL + '/api/seller/add-product',
        {
          name: formData.name,
          description: formData.description,
          asking_price: parseInt(formData.asking_price),
          deadline: formData.deadline.toISOString(),
          category: formData.category
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const product_id = productRes.data.product.product_id;

      if (images.length > 0) {
        const imgForm = new FormData();
        images.forEach(img => imgForm.append('images', img));

        await axios.post(
          API_URL + `/api/images/${product_id}`,
          imgForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      alert('Product posted successfully!');
      setFormData({ name: '', description: '', asking_price: '', deadline: null, category: '' });
      setImages([]);
      setErrors({});
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error posting product:', error);
      alert('Failed to post product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="post-page">
      <h1>Post Your Item</h1>
      <form className="post-form" onSubmit={handleSubmit} aria-busy={loading}>
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="e.g., Gaming Laptop"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="error-message">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <div className="select-wrapper">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
              required
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="select-icon">▼</span>
          </div>
          {errors.category && (
            <span id="category-error" className="error-message">{errors.category}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className={errors.description ? 'error' : ''}
            placeholder="Describe your item in detail..."
            required
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          ></textarea>
          {errors.description && (
            <span id="description-error" className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="asking_price">Asking Price (₹)</label>
          <input
            type="number"
            id="asking_price"
            name="asking_price"
            value={formData.asking_price}
            onChange={handleChange}
            min="1"
            step="1"
            className={errors.asking_price ? 'error' : ''}
            placeholder="e.g., 5000"
            required
            aria-invalid={!!errors.asking_price}
            aria-describedby={errors.asking_price ? 'price-error' : undefined}
          />
          {errors.asking_price && (
            <span id="price-error" className="error-message">{errors.asking_price}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline to Sell</label>
          <DatePicker
            id="deadline"
            selected={formData.deadline}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
            className={`date-picker ${errors.deadline ? 'error' : ''}`}
            required
            aria-invalid={!!errors.deadline}
            aria-describedby={errors.deadline ? 'deadline-error' : undefined}
          />
          {errors.deadline && (
            <span id="deadline-error" className="error-message">{errors.deadline}</span>
          )}
        </div>

        <div className="form-group">
          <label>Upload Images (up to 4)</label>
          <div
            className="drop-zone"
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
            role="button"
            tabIndex={0}
            aria-label="Drag and drop images or click to select"
          >
            <p>Drag & drop images here or click to browse</p>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              onChange={handleFileInputChange}
              multiple
              ref={fileInputRef}
              hidden
            />
          </div>
          {images.length > 0 && (
            <div className="image-preview">
              {images.map((img, index) => (
                <div key={index} className="preview-container">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index + 1}`}
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="remove-img"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            'Post Listing'
          )}
        </button>

        {loading && <div className="loading-overlay" aria-live="polite">Posting your item...</div>}
      </form>

      <style jsx="true">{`
        .post-page {
          max-width: 900px;
          margin: 40px auto;
          padding: 32px;
          background: linear-gradient(180deg, #ffffff, #f8fafc);
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .post-page {
          background: linear-gradient(180deg, #1e293b, #334155);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          text-align: center;
          margin-bottom: 32px;
        }

        .dark-mode h1 {
          color: #f1f5f9;
        }

        .post-form {
          display: grid;
          gap: 24px;
          position: relative;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .dark-mode label {
          color: #f1f5f9;
        }

        input, textarea, select, .date-picker {
          padding: 14px;
          font-size: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          color: #1f2937;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.2s;
          width: 100%; /* Ensure all inputs take full width */
        }

        .dark-mode input,
        .dark-mode textarea,
        .dark-mode select,
        .dark-mode .date-picker {
          border-color: #475569;
          background: #334155;
          color: #f1f5f9;
        }

        input:focus, textarea:focus, select:focus, .date-picker:focus {
          border-color: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
          outline: none;
        }

        .dark-mode input:focus,
        .dark-mode textarea:focus,
        .dark-mode select:focus,
        .dark-mode .date-picker:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.2);
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .select-wrapper {
          position: relative;
          width: 100%; /* Ensure wrapper takes full width */
        }

        .select-wrapper select {
          appearance: none;
          padding-right: 40px;
          width: 100%; /* Ensure select takes full width of wrapper */
        }

        .select-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none; /* Ensure icon doesn't block select interaction */
          font-size: 0.9rem;
        }

        .dark-mode .select-icon {
          color: #cbd5e1;
        }

        .error {
          border-color: #ef4444 !important;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.2) !important;
        }

        .dark-mode .error {
          border-color: #f87171 !important;
          box-shadow: 0 0 8px rgba(248, 113, 113, 0.2) !important;
        }

        .error-message {
          color: #b91c1c;
          font-size: 0.9rem;
          margin-top: 6px;
          animation: fadeIn 0.3s ease;
        }

        .dark-mode .error-message {
          color: #f87171;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .date-picker {
          width: 100%;
          cursor: pointer;
        }

        .react-datepicker {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          font-family: 'Inter', sans-serif;
        }

        .dark-mode .react-datepicker {
          border-color: #475569;
          background: #334155;
          color: #f1f5f9;
        }

        .react-datepicker__header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .dark-mode .react-datepicker__header {
          background: #475569;
          border-bottom: 1px solid #64748b;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: #ef4444;
          color: #ffffff;
        }

        .dark-mode .react-datepicker__day--selected,
        .dark-mode .react-datepicker__day--keyboard-selected {
          background: #60a5fa;
          color: #1f2937;
        }

        .react-datepicker__day:hover {
          background: #f3f4f6;
        }

        .dark-mode .react-datepicker__day:hover {
          background: #475569;
        }

        .drop-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 10px;
          padding: 24px;
          text-align: center;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dark-mode .drop-zone {
          border-color: #475569;
          background: #334155;
        }

        .drop-zone:hover, .drag-over {
          border-color: #ef4444;
          background: #fef2f2;
          transform: translateY(-2px);
        }

        .dark-mode .drop-zone:hover, .dark-mode .drag-over {
          border-color: #60a5fa;
          background: #1e40af;
        }

        .drop-zone p {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
        }

        .dark-mode .drop-zone p {
          color: #cbd5e1;
        }

        .image-preview {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .preview-container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
        }

        .remove-img {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #ef3f3f;
          color: #ffffff;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .dark-mode .remove-img {
          background: #f87171;
        }

        .remove-img:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .dark-mode .remove-img:hover {
          background: #ef4444;
        }

        .btn {
          background: linear-gradient(45deg, #ef4444, #f87171);
          color: #ffffff;
          padding: 16px;
          font-size: 1.2rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(239, 68, 68, 0.4);
        }

        .btn:hover {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.6);
        }

        .btn:disabled {
          background: #d1d5db;
          color: #6b7280;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .dark-mode .btn {
          background: linear-gradient(45deg, #60a5fa, #93c5fd);
          color: #1f2937;
          box-shadow: 0 3px 12px rgba(96, 165, 250, 0.4);
        }

        .dark-mode .btn:hover {
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
          box-shadow: 0 6px 16px rgba(96, 165, 250, 0.6);
        }

        .dark-mode .btn:disabled {
          background: #475569;
          color: #9ca3af;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s ease-in-out infinite;
        }

        .dark-mode .spinner {
          border-color: rgba(31, 41, 55, 0.3);
          border-top-color: #1f2937;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
          font-size: 1.2rem;
          font-weight: 600;
          border-radius: 16px;
          z-index: 10;
        }

        .dark-mode .loading-overlay {
          background: rgba(31, 41, 55, 0.8);
          color: #f1f5f9;
        }

        @media (max-width: 768px) {
          .post-page {
            margin: 24px 16px;
            padding: 24px;
          }

          h1 {
            font-size: 2rem;
          }

          .post-form {
            gap: 20px;
          }

          input, textarea, select, .date-picker {
            padding: 12px;
            font-size: 0.95rem;
          }

          .btn {
            padding: 14px;
            font-size: 1.1rem;
          }

          .preview-container {
            width: 100px;
            height: 100px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.8rem;
          }

          label {
            font-size: 1rem;
          }

          input, textarea, select, .date-picker {
            font-size: 0.9rem;
            padding: 10px;
          }

          .btn {
            font-size: 1rem;
            padding: 12px;
          }

          .preview-container {
            width: 80px;
            height: 80px;
          }

          .remove-img {
            width: 20px;
            height: 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </main>
  );
}