import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../../styles/Tips.css';

const Tips = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_BASE_URL}/api/tips`);
        setTips(response.data || []);
      } catch (err) {
        const serverMsg = err?.response?.data?.error || err?.message || '';
        setError(`Failed to load tips. ${serverMsg}`.trim());
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [API_BASE_URL]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(tips.map(t => t.category).filter(Boolean)));
    return ['All', ...uniqueCategories];
  }, [tips]);

  const filteredTips = useMemo(() => {
    return tips.filter(tip => {
      const categoryMatch = selectedCategory === 'All' || tip.category === selectedCategory;
      const title = (tip.title || '').toLowerCase();
      const content = (tip.content || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase();
      const searchMatch = title.includes(search) || content.includes(search);
      return categoryMatch && searchMatch;
    });
  }, [tips, selectedCategory, searchTerm]);

  const tipsThisWeek = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return tips.filter(t => new Date(t.uploadedAt) >= oneWeekAgo).length;
  }, [tips]);

  if (loading) {
    return (
      <div className="tips">
        <div className="tips-header">
          <h1>Interview Tips</h1>
          <p>Loading tips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tips">
        <div className="tips-header">
          <h1>Interview Tips</h1>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tips">
      <div className="tips-header">
        <h1>Interview Tips</h1>
        <p>Expert advice and tips to help you succeed in your interviews</p>
      </div>

      {/* Tips Stats */}
      <div className="tips-stats">
        <div className="stat-item">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>Total Tips</h3>
            <p>{tips.length}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Categories</h3>
            <p>{categories.length - 1}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Most Popular</h3>
            <p>Technical</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>This Week</h3>
            <p>{tipsThisWeek}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="tips-grid">
        {filteredTips.map(tip => (
          <div key={tip._id} className="tip-card">
            <div className="tip-header-card">
              <h3>{tip.title}</h3>
              <div className="tip-meta">
                <span className={`category-badge ${String(tip.category || '').toLowerCase()}`}>
                  {tip.category}
                </span>
                <span className="date-badge">
                  📅 {tip.createdAt ? new Date(tip.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
            </div>

            <div className="tip-content">
              <p className="tip-text">{tip.content}</p>

              <div className="tip-actions">
                <button className="bookmark-btn">
                  <span className="btn-icon">🔖</span>
                  Bookmark
                </button>
                <button className="share-btn">
                  <span className="btn-icon">📤</span>
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Tips */}
      <div className="featured-tips-section">
        <h2>Featured Tips</h2>
        <div className="featured-tips">
          <div className="featured-tip">
            <div className="featured-icon">🏆</div>
            <div className="featured-content">
              <h3>Top Interview Mistakes to Avoid</h3>
              <p>Common pitfalls that can cost you the job and how to avoid them</p>
              <button className="read-more-btn">Read More</button>
            </div>
          </div>
          <div className="featured-tip">
            <div className="featured-icon">🚀</div>
            <div className="featured-content">
              <h3>Stand Out in Competitive Markets</h3>
              <p>Strategies to differentiate yourself when applying to top companies</p>
              <button className="read-more-btn">Read More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="quick-tips-section">
        <h2>Quick Tips</h2>
        <div className="quick-tips-grid">
          <div className="quick-tip">
            <div className="quick-icon">⏰</div>
            <h4>Time Management</h4>
            <p>Practice with time limits to improve your speed</p>
          </div>
          <div className="quick-tip">
            <div className="quick-icon">🎯</div>
            <h4>Focus on Impact</h4>
            <p>Highlight results and achievements, not just tasks</p>
          </div>
          <div className="quick-tip">
            <div className="quick-icon">🤝</div>
            <h4>Build Relationships</h4>
            <p>Network before, during, and after interviews</p>
          </div>
          <div className="quick-tip">
            <div className="quick-icon">📝</div>
            <h4>Follow Up</h4>
            <p>Send thank you notes within 24 hours</p>
          </div>
        </div>
      </div>

      {/* Tips Categories */}
      <div className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">💻</div>
            <h3>Technical</h3>
            <p>Coding, algorithms, system design</p>
            <span className="tip-count">15 tips</span>
          </div>
          <div className="category-card">
            <div className="category-icon">💬</div>
            <h3>Behavioral</h3>
            <p>Communication, leadership, teamwork</p>
            <span className="tip-count">12 tips</span>
          </div>
          <div className="category-card">
            <div className="category-icon">📋</div>
            <h3>Preparation</h3>
            <p>Resume, research, practice</p>
            <span className="tip-count">8 tips</span>
          </div>
          <div className="category-card">
            <div className="category-icon">🎯</div>
            <h3>Career</h3>
            <p>Negotiation, growth, advancement</p>
            <span className="tip-count">10 tips</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips; 