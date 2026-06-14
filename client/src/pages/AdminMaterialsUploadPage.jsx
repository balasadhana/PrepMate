import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminMaterialsUploadPage.css';

const AdminMaterialsUploadPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingMaterial, setEditingMaterial] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    tags: '',
    isPublic: true
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  const API_BASE_URL = 'http://localhost:5000';

  // Predefined subjects for consistency
  const predefinedSubjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business',
    'Economics',
    'Literature',
    'History',
    'Geography',
    'Psychology',
    'Sociology',
    'Philosophy',
    'Art & Design',
    'Music',
    'Sports',
    'Language Learning',
    'Programming',
    'Data Science',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Cloud Computing',
    'Other'
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/api/materials`, {
        params: { limit: 100 } // Get more materials for admin view
      });
      
      setMaterials(response.data.materials || []);
      
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err?.response?.data?.error || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview('');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      description: '',
      tags: '',
      isPublic: true
    });
    setSelectedFile(null);
    setFilePreview('');
    setEditingMaterial(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile && !editingMaterial) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.subject || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      if (editingMaterial) {
        // Update existing material
        const response = await axios.put(
          `${API_BASE_URL}/api/materials/${editingMaterial._id}`,
          formData
        );
        
        setSuccess('Material updated successfully!');
        setMaterials(prev => 
          prev.map(m => 
            m._id === editingMaterial._id 
              ? response.data.material 
              : m
          )
        );
        
      } else {
        // Upload new material
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        uploadData.append('title', formData.title);
        uploadData.append('subject', formData.subject);
        uploadData.append('description', formData.description);
        uploadData.append('tags', formData.tags);
        uploadData.append('isPublic', formData.isPublic);

        const response = await axios.post(
          `${API_BASE_URL}/api/materials`,
          uploadData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setSuccess('Material uploaded successfully!');
        setMaterials(prev => [response.data.material, ...prev]);
      }

      resetForm();
      
    } catch (err) {
      console.error('Error uploading material:', err);
      setError(err?.response?.data?.error || 'Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      subject: material.subject,
      description: material.description,
      tags: material.tags.join(', '),
      isPublic: material.isPublic
    });
    setSelectedFile(null);
    setFilePreview('');
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/materials/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Material deleted successfully!');
      setMaterials(prev => prev.filter(m => m._id !== materialId));
      
    } catch (err) {
      console.error('Error deleting material:', err);
      setError(err?.response?.data?.error || 'Failed to delete material');
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'ppt':
      case 'pptx': return '📊';
      case 'txt': return '📄';
      case 'jpg':
      case 'png': return '🖼️';
      case 'mp4': return '🎥';
      case 'mp3': return '🎵';
      default: return '📎';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-materials-page">
      <div className="page-header">
        <h1>Study Materials Management</h1>
        <p>Upload, edit, and manage study materials for students</p>
      </div>

      {/* Upload Form */}
      <div className="upload-section">
        <h2>{editingMaterial ? 'Edit Material' : 'Upload New Material'}</h2>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter material title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Subject</option>
                {predefinedSubjects.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter detailed description of the material"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Make this material public
              </label>
            </div>
          </div>

          {!editingMaterial && (
            <div className="form-group">
              <label htmlFor="file">File *</label>
              <input
                type="file"
                id="file"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                required
              />
              <small>Supported formats: PDF, DOCX, PPT, PPTX, TXT, JPG, PNG, MP4, MP3 (Max: 50MB)</small>
              
              {filePreview && (
                <div className="file-preview">
                  <img src={filePreview} alt="File preview" />
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={uploading}
            >
              {uploading ? 'Processing...' : (editingMaterial ? 'Update Material' : 'Upload Material')}
            </button>
            
            {editingMaterial && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-btn"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Messages */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <p>✅ {success}</p>
        </div>
      )}

      {/* Materials List */}
      <div className="materials-section">
        <h2>Uploaded Materials ({materials.length})</h2>
        
        {loading ? (
          <div className="loading">Loading materials...</div>
        ) : materials.length > 0 ? (
          <div className="materials-table">
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Size</th>
                  <th>Downloads</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material._id}>
                    <td>
                      <div className="file-info">
                        <span className="file-icon">{getFileIcon(material.fileType)}</span>
                        <span className="file-name">{material.fileName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="material-title">
                        <strong>{material.title}</strong>
                        <p className="description">{material.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className="subject-badge">{material.subject}</span>
                    </td>
                    <td>{formatFileSize(material.fileSize)}</td>
                    <td>{material.downloadCount || 0}</td>
                    <td>
                      <span className={`status-badge ${material.isPublic ? 'public' : 'private'}`}>
                        {material.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td>{formatDate(material.uploadedAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(material)}
                          className="edit-btn"
                          title="Edit Material"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(material._id)}
                          className="delete-btn"
                          title="Delete Material"
                        >
                          🗑️
                        </button>
                        <a
                          href={`${API_BASE_URL}${material.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-btn"
                          title="View File"
                        >
                          👁️
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-materials">
            <p>No materials uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMaterialsUploadPage; 