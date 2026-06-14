import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminTipsUploadPage.css';

const AdminTipsUploadPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api/admin';

  // Predefined categories for dropdown
  const categories = [
    'Interview Preparation',
    'Behavioral Questions',
    'Technical Questions',
    'Communication Skills',
    'Body Language',
    'Follow-up',
    'Salary Negotiation',
    'General Tips'
  ];

  // Fetch all tips on component mount
  useEffect(() => {
    fetchTips();
  }, []);

  // Fetch all interview tips
  const fetchTips = async () => {
    try {
      setLoading(true);
      console.log('Fetching tips from:', `${API_BASE_URL}/tips`);
      const response = await axios.get(`${API_BASE_URL}/tips`);
      console.log('Tips response:', response.data);
      setTips(response.data);
    } catch (error) {
      console.error('Error fetching tips:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setMessage(`Failed to fetch tips: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      await axios.post(`${API_BASE_URL}/tips/upload`, {
        title: formData.title,
        content: formData.content,
        category: formData.category
      });

      setMessage('Tip uploaded successfully!');
      setFormData({ title: '', content: '', category: '' });
      fetchTips(); // Refresh the list
    } catch (error) {
      console.error('Error uploading tip:', error);
      setMessage(error.response?.data?.error || 'Failed to upload tip');
    } finally {
      setLoading(false);
    }
  };

  // Handle tip deletion
  const handleDelete = async (tipId) => {
    if (!window.confirm('Are you sure you want to delete this tip?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/tips/${tipId}`);
      setMessage('Tip deleted successfully!');
      fetchTips(); // Refresh the list
    } catch (error) {
      console.error('Error deleting tip:', error);
      setMessage('Failed to delete tip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-tips-page">
        <div className="container">
          <h1>Interview Tips Management</h1>
          
          {/* Upload Form */}
          <div className="upload-section">
            <h2>Upload New Tip</h2>
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label htmlFor="title">Tip Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter tip title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="content">Tip Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter the tip content..."
                  rows="6"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="upload-btn">
                {loading ? 'Uploading...' : 'Upload Tip'}
              </button>
            </form>

            {message && (
              <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          {/* Tips List */}
          <div className="tips-section">
            <h2>Uploaded Tips</h2>
            
            {loading && <div className="loading">Loading tips...</div>}
            
            {!loading && tips.length === 0 && (
              <div className="no-tips">No tips uploaded yet.</div>
            )}

            <div className="tips-grid">
              {tips.map((tip) => (
                <div key={tip._id} className="tip-card">
                  <div className="tip-header">
                    <h3>{tip.title}</h3>
                    <button
                      onClick={() => handleDelete(tip._id)}
                      className="delete-btn"
                      title="Delete tip"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="tip-category">
                    <span className="category-badge">{tip.category}</span>
                  </div>

                  <div className="tip-content">
                    <p>{tip.content}</p>
                  </div>

                  <div className="tip-date">
                    Uploaded: {new Date(tip.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTipsUploadPage; 