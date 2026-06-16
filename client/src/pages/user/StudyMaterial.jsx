import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/StudyMaterial.css';

const StudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const API_BASE_URL = 'https://prepmate-backend-wy02.onrender.com';

  useEffect(() => {
    fetchMaterials();
    fetchSubjects();
  }, [selectedSubject, sortBy, sortOrder, currentPage, searchTerm]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        subject: selectedSubject,
        search: searchTerm,
        sort: sortBy,
        order: sortOrder,
        page: currentPage,
        limit: 12
      });

      const response = await axios.get(`${API_BASE_URL}/api/materials?${params}`);

      setMaterials(response.data.materials || []);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);

    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err?.response?.data?.error || 'Failed to fetch study materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/materials/subjects/all`);
      setSubjects(response.data || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleDownload = async (material) => {
    try {
      // Increment download count
      await axios.post(`${API_BASE_URL}/api/materials/${material._id}/download`);

      // Create download link
      const downloadUrl = `${API_BASE_URL}${material.fileUrl}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = material.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local state
      setMaterials(prev =>
        prev.map(m =>
          m._id === material._id
            ? { ...m, downloadCount: (m.downloadCount || 0) + 1 }
            : m
        )
      );

    } catch (err) {
      console.error('Error downloading material:', err);
      // Still try to download even if count update fails
      const downloadUrl = `${API_BASE_URL}${material.fileUrl}`;
      window.open(downloadUrl, '_blank');
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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSortBy('uploadedAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  if (loading && materials.length === 0) {
    return (
      <div className="study-material-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="study-material-page">
      {/* Header */}
      <div className="page-header">
        <h1>Study Materials</h1>
        <p>Access comprehensive study resources uploaded by our expert faculty</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search materials by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="filter-select"
            >
              <option value="uploadedAt-desc">Newest First</option>
              <option value="uploadedAt-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="downloadCount-desc">Most Downloaded</option>
            </select>
          </div>

          <button onClick={resetFilters} className="reset-btn">
            🔄 Reset Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {materials.length} of {totalItems} materials
          {selectedSubject !== 'all' && ` in ${selectedSubject}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Materials Grid */}
      {materials.length > 0 ? (
        <div className="materials-grid">
          {materials.map((material) => (
            <div key={material._id} className="material-card">
              <div className="material-header">
                <div className="file-icon">
                  {getFileIcon(material.fileType)}
                </div>
                <div className="material-info">
                  <h3 className="material-title">{material.title}</h3>
                  <span className="material-subject">{material.subject}</span>
                </div>
              </div>

              <div className="material-description">
                <p>{material.description}</p>
              </div>

              <div className="material-meta">
                <div className="meta-item">
                  <span className="meta-label">📅</span>
                  <span>{formatDate(material.uploadedAt)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">📁</span>
                  <span>{material.fileName}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">📏</span>
                  <span>{formatFileSize(material.fileSize)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">⬇️</span>
                  <span>{material.downloadCount || 0} downloads</span>
                </div>
              </div>

              {material.tags && material.tags.length > 0 && (
                <div className="material-tags">
                  {material.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="material-actions">
                <button
                  onClick={() => handleDownload(material)}
                  className="download-btn"
                >
                  📥 Download
                </button>
                <button
                  onClick={() => window.open(`${API_BASE_URL}${material.fileUrl}`, '_blank')}
                  className="view-btn"
                >
                  👁️ View
                </button>
              </div>

              <div className="uploaded-by">
                <small>Uploaded by: {material.uploadedBy?.name || 'Admin'}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-materials">
          <div className="no-materials-icon">📚</div>
          <h3>No materials found</h3>
          <p>
            {searchTerm || selectedSubject !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'No study materials have been uploaded yet.'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyMaterial; 