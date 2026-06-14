import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../../styles/ShareExperience.css';

const ShareExperience = () => {
  const [experienceForm, setExperienceForm] = useState({
    name: '',
    role: '',
    company: '',
    experience: '',
    tags: ''
  });

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'http://localhost:5000';

  const fetchExperiences = async () => {
    try {
      setError('');
      setLoading(true);
      console.log('[GET] /api/experiences');
      const res = await axios.get(`${API_BASE_URL}/api/experiences`);
      setExperiences(res.data || []);
    } catch (e) {
      console.error('[GET] /api/experiences error:', e);
      setError(e?.response?.data?.error || e?.message || 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleInputChange = (field, value) => {
    setExperienceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      console.log('[POST] /api/experiences payload:', experienceForm);
      await axios.post(`${API_BASE_URL}/api/experiences`, experienceForm);
      setSuccess('Experience shared successfully!');
      setExperienceForm({ name: '', role: '', company: '', experience: '', tags: '' });
      await fetchExperiences();
    } catch (err) {
      console.error('[POST] /api/experiences error:', err);
      const details = err?.response?.data?.details || '';
      const serverMsg = err?.response?.data?.error || err?.message || 'Failed to submit experience';
      setError(details ? `${serverMsg} (${details})` : serverMsg);
    }
  };

  return (
    <div className="share-experience">
      <div className="experience-header">
        <h1>Share Experience</h1>
        <p>Share your interview experiences to help others prepare better</p>
      </div>

      {/* Experience Stats */}
      <div className="experience-stats">
        <div className="stat-item">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Total Experiences</h3>
            <p>{experiences.length}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Approved</h3>
            <p>{experiences.filter(exp => exp.status === 'Approved').length}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Avg Rating</h3>
            <p>4.5</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p>12</p>
          </div>
        </div>
      </div>

      {/* Share Form */}
      <div className="share-form-section">
        <h2>Share Your Experience</h2>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <form onSubmit={handleSubmit} className="experience-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={experienceForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Jane Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <input
                type="text"
                value={experienceForm.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                value={experienceForm.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g., Google"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Your Experience *</label>
            <textarea
              value={experienceForm.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Share your detailed interview experience, including questions asked, process, tips, etc."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={experienceForm.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="e.g., Algorithms, System Design, React"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              <span className="btn-icon">📤</span>
              Share Experience
            </button>
          </div>
        </form>
      </div>

      {/* Recent Experiences */}
      <div className="recent-experiences-section">
        <h2>Recent Experiences</h2>
        {loading ? (
          <p>Loading experiences...</p>
        ) : (
          <div className="experiences-grid">
            {experiences.map(exp => (
              <div key={exp._id} className="experience-card">
                <div className="experience-header-card">
                  <h3>{exp.role} at {exp.company}</h3>
                  <div className="experience-meta">
                    <span className="company-badge">{exp.company}</span>
                  </div>
                </div>

                <div className="experience-content">
                  <p className="experience-text">{exp.experience}</p>
                  <div className="experience-details">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span>{exp.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Role:</span>
                      <span>{exp.role}</span>
                    </div>
                  </div>
                  <div className="experience-footer">
                    <span className="date">📅 {exp.date ? new Date(exp.date).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="guidelines-section">
        <h2>Sharing Guidelines</h2>
        <div className="guidelines-grid">
          <div className="guideline-item">
            <div className="guideline-icon">✅</div>
            <div className="guideline-content">
              <h3>Do Share</h3>
              <ul>
                <li>Detailed interview process</li>
                <li>Types of questions asked</li>
                <li>Tips and preparation advice</li>
                <li>Company culture insights</li>
              </ul>
            </div>
          </div>
          <div className="guideline-item">
            <div className="guideline-icon">❌</div>
            <div className="guideline-content">
              <h3>Don't Share</h3>
              <ul>
                <li>Exact interview questions</li>
                <li>Confidential information</li>
                <li>Personal contact details</li>
                <li>Negative personal comments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareExperience; 