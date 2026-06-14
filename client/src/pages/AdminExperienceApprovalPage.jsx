import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminExperienceApprovalPage.css';

const AdminExperienceApprovalPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    position: ''
  });

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api/admin';

  // Fetch experiences on component mount
  useEffect(() => {
    fetchExperiences();
    fetchStats();
  }, [filters]);

  // Fetch all experiences with filters
  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.company) params.append('company', filters.company);
      if (filters.position) params.append('position', filters.position);

      const response = await axios.get(`${API_BASE_URL}/experiences?${params}`);
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setMessage('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  // Fetch experience statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/experiences/stats/summary`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      company: '',
      position: ''
    });
  };

  // Handle experience approval
  const handleApprove = async (experienceId) => {
    if (!window.confirm('Are you sure you want to approve this experience?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`${API_BASE_URL}/experiences/${experienceId}/approve`);
      
      setMessage('Experience approved successfully!');
      fetchExperiences();
      fetchStats();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error approving experience:', error);
      setMessage(error.response?.data?.error || 'Failed to approve experience');
    } finally {
      setLoading(false);
    }
  };

  // Handle experience rejection
  const handleReject = async (experienceId) => {
    if (!rejectionReason.trim()) {
      setMessage('Please provide a rejection reason');
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`${API_BASE_URL}/experiences/${experienceId}/reject`, {
        rejectionReason: rejectionReason.trim()
      });
      
      setMessage('Experience rejected successfully!');
      setRejectionReason('');
      setShowRejectModal(false);
      setShowDetailModal(false);
      fetchExperiences();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting experience:', error);
      setMessage(error.response?.data?.error || 'Failed to reject experience');
    } finally {
      setLoading(false);
    }
  };

  // Handle experience deletion
  const handleDelete = async (experienceId) => {
    if (!window.confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/experiences/${experienceId}`);
      
      setMessage('Experience deleted successfully!');
      fetchExperiences();
      fetchStats();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting experience:', error);
      setMessage('Failed to delete experience');
    } finally {
      setLoading(false);
    }
  };

  // Open detail modal
  const openDetailModal = async (experienceId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/experiences/${experienceId}`);
      setSelectedExperience(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching experience details:', error);
      setMessage('Failed to fetch experience details');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      default: return '';
    }
  };

  // Get difficulty badge class
  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'easy';
      case 'Medium': return 'medium';
      case 'Hard': return 'hard';
      default: return '';
    }
  };

  return (
    <AdminLayout>
      <div className="admin-experience-page">
        <div className="container">
          <h1>Experience Approval Management</h1>
          
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Experiences</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
              <div className="stat-card pending">
                <h3>Pending Approval</h3>
                <p className="stat-number">{stats.pending}</p>
              </div>
              <div className="stat-card approved">
                <h3>Approved</h3>
                <p className="stat-number">{stats.approved}</p>
              </div>
              <div className="stat-card rejected">
                <h3>Rejected</h3>
                <p className="stat-number">{stats.rejected}</p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <h2>Filters</h2>
            <div className="filters-form">
              <div className="filter-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={filters.company}
                  onChange={handleFilterChange}
                  placeholder="Search by company..."
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={filters.position}
                  onChange={handleFilterChange}
                  placeholder="Search by position..."
                />
              </div>
              
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Experiences List */}
          <div className="experiences-section">
            <h2>All Experiences ({experiences.length})</h2>
            
            {loading && <div className="loading">Loading experiences...</div>}
            
            {!loading && experiences.length === 0 && (
              <div className="no-experiences">No experiences found.</div>
            )}

            <div className="experiences-grid">
              {experiences.map((experience) => (
                <div key={experience._id} className="experience-card">
                  <div className="experience-header">
                    <h3>{experience.title}</h3>
                    <div className="experience-actions">
                      <button
                        onClick={() => openDetailModal(experience._id)}
                        className="view-btn"
                        title="View details"
                      >
                        View
                      </button>
                      {experience.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(experience._id)}
                            className="approve-btn"
                            title="Approve experience"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setSelectedExperience(experience);
                              setShowRejectModal(true);
                            }}
                            className="reject-btn"
                            title="Reject experience"
                          >
                            ✗
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(experience._id)}
                        className="delete-btn"
                        title="Delete experience"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="experience-details">
                    <div className="experience-meta">
                      <span className="company">{experience.company}</span>
                      <span className="position">{experience.position}</span>
                    </div>
                    
                    <div className="experience-info">
                      <div className="info-row">
                        <span className="label">Interview Type:</span>
                        <span className="value">{experience.interviewType}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Difficulty:</span>
                        <span className={`difficulty-badge ${getDifficultyBadgeClass(experience.difficulty)}`}>
                          {experience.difficulty}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Rating:</span>
                        <span className="rating">
                          {'⭐'.repeat(experience.rating)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="experience-content">
                      <p>{experience.experience.substring(0, 150)}...</p>
                    </div>
                    
                    <div className="experience-footer">
                      <span className={`status-badge ${getStatusBadgeClass(experience.status)}`}>
                        {experience.status}
                      </span>
                      <span className="date">{formatDate(experience.createdAt)}</span>
                      <span className="user">by {experience.userId?.name || 'Unknown User'}</span>
                    </div>

                    {experience.tags && experience.tags.length > 0 && (
                      <div className="experience-tags">
                        {experience.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedExperience && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedExperience.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowDetailModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Company:</span>
                      <span className="value">{selectedExperience.company}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Position:</span>
                      <span className="value">{selectedExperience.position}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Interview Type:</span>
                      <span className="value">{selectedExperience.interviewType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Difficulty:</span>
                      <span className={`difficulty-badge ${getDifficultyBadgeClass(selectedExperience.difficulty)}`}>
                        {selectedExperience.difficulty}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Rating:</span>
                      <span className="rating">{'⭐'.repeat(selectedExperience.rating)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status:</span>
                      <span className={`status-badge ${getStatusBadgeClass(selectedExperience.status)}`}>
                        {selectedExperience.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Experience Details</h3>
                  <div className="experience-text">
                    {selectedExperience.experience}
                  </div>
                </div>

                {selectedExperience.tags && selectedExperience.tags.length > 0 && (
                  <div className="detail-section">
                    <h3>Tags</h3>
                    <div className="tags-list">
                      {selectedExperience.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Submission Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Submitted by:</span>
                      <span className="value">{selectedExperience.userId?.name || 'Unknown User'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Email:</span>
                      <span className="value">{selectedExperience.userId?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Submitted on:</span>
                      <span className="value">{formatDate(selectedExperience.createdAt)}</span>
                    </div>
                    {selectedExperience.approvedBy && (
                      <div className="detail-item">
                        <span className="label">Reviewed by:</span>
                        <span className="value">{selectedExperience.approvedBy?.name || 'Admin'}</span>
                      </div>
                    )}
                    {selectedExperience.approvedAt && (
                      <div className="detail-item">
                        <span className="label">Reviewed on:</span>
                        <span className="value">{formatDate(selectedExperience.approvedAt)}</span>
                      </div>
                    )}
                    {selectedExperience.rejectionReason && (
                      <div className="detail-item full-width">
                        <span className="label">Rejection Reason:</span>
                        <span className="value rejection-reason">{selectedExperience.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                {selectedExperience.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedExperience._id)}
                      className="approve-btn"
                      disabled={loading}
                    >
                      {loading ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowRejectModal(true);
                      }}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(selectedExperience._id)}
                  className="delete-btn"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="close-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
            <div className="modal-content reject-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Reject Experience</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowRejectModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <p>Please provide a reason for rejecting this experience:</p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows="4"
                  className="rejection-textarea"
                />
              </div>
              
              <div className="modal-footer">
                <button
                  onClick={() => handleReject(selectedExperience._id)}
                  className="reject-btn"
                  disabled={loading || !rejectionReason.trim()}
                >
                  {loading ? 'Rejecting...' : 'Reject Experience'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminExperienceApprovalPage; 