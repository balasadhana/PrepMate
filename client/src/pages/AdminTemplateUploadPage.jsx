import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminTemplateUploadPage.css';

const AdminTemplateUploadPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    tags: ''
  });
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api/admin';

  // Fetch all templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch all resume templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/resume-templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setMessage('Failed to fetch templates');
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
    
    if (!formData.title || !formData.url) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      
      await axios.post(`${API_BASE_URL}/resume-templates`, {
        title: formData.title,
        url: formData.url,
        tags: tagsArray
      });

      setMessage('Template uploaded successfully!');
      setFormData({ title: '', url: '', tags: '' });
      fetchTemplates(); // Refresh the list
    } catch (error) {
      console.error('Error uploading template:', error);
      setMessage('Failed to upload template');
    } finally {
      setLoading(false);
    }
  };

  // Handle template deletion
  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/resume-templates/${templateId}`);
      setMessage('Template deleted successfully!');
      fetchTemplates(); // Refresh the list
    } catch (error) {
      console.error('Error deleting template:', error);
      setMessage('Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container">
        <h1>Resume Template Management</h1>
        
        {/* Upload Form */}
        <div className="upload-section">
          <h2>Upload New Template</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="title">Template Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter template title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="url">Template URL *</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="Enter template URL"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., modern, professional, creative"
              />
            </div>

            <button type="submit" disabled={loading} className="upload-btn">
              {loading ? 'Uploading...' : 'Upload Template'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Templates List */}
        <div className="templates-section">
          <h2>Uploaded Templates</h2>
          
          {loading && <div className="loading">Loading templates...</div>}
          
          {!loading && templates.length === 0 && (
            <div className="no-templates">No templates uploaded yet.</div>
          )}

          <div className="templates-grid">
            {templates.map((template) => (
              <div key={template._id} className="template-card">
                <div className="template-header">
                  <h3>{template.title}</h3>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="delete-btn"
                    title="Delete template"
                  >
                    ×
                  </button>
                </div>
                
                <div className="template-url">
                  <a href={template.url} target="_blank" rel="noopener noreferrer">
                    View Template
                  </a>
                </div>

                {template.tags && template.tags.length > 0 && (
                  <div className="template-tags">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="template-date">
                  Uploaded: {new Date(template.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTemplateUploadPage; 