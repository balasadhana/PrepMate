import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/UserDashboard.css';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    quizzes: [],
    materials: [],
    tips: [],
    experiences: [],
    loading: true,
    error: null
  });

  // Get logged-in user information from localStorage
  const [userInfo, setUserInfo] = useState({
    username: localStorage.getItem('username') || 'User',
    email: localStorage.getItem('email') || 'user@example.com'
  });

  // Fetch dashboard data and update user info on component mount
  useEffect(() => {
    fetchDashboardData();
    
    // Update user info from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    
    // Debug logging for user info
    console.log('Stored username:', storedUsername);
    console.log('Stored email:', storedEmail);
    
    setUserInfo({
      username: storedUsername || 'User',
      email: storedEmail || 'user@example.com'
    });
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch data from multiple endpoints
      const [quizzesRes, materialsRes, tipsRes, experiencesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/quizzes'),
        axios.get('http://localhost:5000/api/materials'),
        axios.get('http://localhost:5000/api/tips'),
        axios.get('http://localhost:5000/api/experiences')
      ]);

      // Handle different response formats from different APIs
      const quizzes = quizzesRes.data?.data || [];
      const materials = materialsRes.data?.materials || materialsRes.data || [];
      const tips = tipsRes.data || [];
      const experiences = experiencesRes.data || [];

      // Debug logging
      console.log('API Responses:');
      console.log('Quizzes:', quizzesRes.data);
      console.log('Materials:', materialsRes.data);
      console.log('Tips:', tipsRes.data);
      console.log('Experiences:', experiencesRes.data);
      console.log('Processed data:', { quizzes, materials, tips, experiences });

      setDashboardData({
        quizzes,
        materials,
        tips,
        experiences,
        loading: false,
        error: null
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data'
      }));
    }
  };

  // Calculate statistics
  const totalQuizzes = dashboardData.quizzes.length;
  const totalMaterials = dashboardData.materials.length;
  const totalTips = dashboardData.tips.length;
  const totalExperiences = dashboardData.experiences.length;

  // Calculate average score (placeholder for now - would need quiz results tracking)
  const averageScore = 75; // This would come from actual quiz results

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Refresh user info from localStorage
  const refreshUserInfo = () => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    
    console.log('Refreshing user info...');
    console.log('Username:', storedUsername);
    console.log('Email:', storedEmail);
    
    setUserInfo({
      username: storedUsername || 'User',
      email: storedEmail || 'user@example.com'
    });
  };

  if (dashboardData.loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="user-dashboard">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p>{dashboardData.error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-text">
            <h1>Welcome back, {userInfo.username}! 👋</h1>
            <p>Track your progress and stay on top of your interview preparation</p>
            <p className="user-email-display">📧 {userInfo.email}</p>
          </div>
          <div className="header-buttons">
            <button className="logout-btn-header" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Available Quizzes</h3>
            <p className="stat-number">{totalQuizzes}</p>
            <span className="stat-change positive">Ready to test your knowledge</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Study Materials</h3>
            <p className="stat-number">{totalMaterials}</p>
            <span className="stat-change positive">Resources available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>Interview Tips</h3>
            <p className="stat-number">{totalTips}</p>
            <span className="stat-change positive">Expert advice ready</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Shared Experiences</h3>
            <p className="stat-number">{totalExperiences}</p>
            <span className="stat-change positive">Learn from others</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Available Resources</h2>
        <div className="activity-list">
          {dashboardData.quizzes.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <h4>Python Quiz Available</h4>
                <p>Test your Python knowledge • {dashboardData.quizzes[0]?.domain || 'Technical'} domain</p>
              </div>
            </div>
          )}

          {dashboardData.materials.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <h4>{dashboardData.materials[0]?.title || 'Study Material'} Available</h4>
                <p>Ready for study • {dashboardData.materials[0]?.category || 'General'}</p>
              </div>
            </div>
          )}

          {dashboardData.tips.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">💡</div>
              <div className="activity-content">
                <h4>{dashboardData.tips[0]?.title || 'Interview Tip'} Available</h4>
                <p>Expert advice • {dashboardData.tips[0]?.category || 'General'}</p>
              </div>
            </div>
          )}

          {dashboardData.experiences.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">💬</div>
              <div className="activity-content">
                <h4>Experience Shared</h4>
                <p>Learn from others • {dashboardData.experiences[0]?.company || 'Company'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn primary" onClick={() => window.location.href = '/user/quiz'}>
            <span className="action-icon">📝</span>
            <span>Take a Quiz</span>
          </button>
          <button className="action-btn secondary" onClick={() => window.location.href = '/user/materials'}>
            <span className="action-icon">📚</span>
            <span>Study Materials</span>
          </button>
          <button className="action-btn secondary" onClick={() => window.location.href = '/user/resume'}>
            <span className="action-icon">📄</span>
            <span>Build Resume</span>
          </button>
          <button className="action-btn secondary" onClick={() => window.location.href = '/user/experience'}>
            <span className="action-icon">💬</span>
            <span>Share Experience</span>
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="dashboard-section">
        <h2>Content Overview</h2>
        <div className="progress-grid">
          <div className="progress-card">
            <h3>Technical Skills</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${totalQuizzes > 0 ? '100' : '0'}%` }}></div>
            </div>
            <p>{totalQuizzes > 0 ? 'Quizzes Available' : 'No Quizzes Yet'}</p>
          </div>

          <div className="progress-card">
            <h3>Study Resources</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${totalMaterials > 0 ? '100' : '0'}%` }}></div>
            </div>
            <p>{totalMaterials > 0 ? 'Materials Available' : 'No Materials Yet'}</p>
          </div>

          <div className="progress-card">
            <h3>Interview Prep</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${totalTips > 0 ? '100' : '0'}%` }}></div>
            </div>
            <p>{totalTips > 0 ? 'Tips Available' : 'No Tips Yet'}</p>
          </div>
        </div>
      </div>

      {/* Data Status */}
      <div className="dashboard-section">
        <h2>System Status</h2>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Database Connection:</span>
            <span className="status-value success">✅ Connected</span>
          </div>
          <div className="status-item">
            <span className="status-label">Quizzes API:</span>
            <span className="status-value success">✅ Working</span>
          </div>
          <div className="status-item">
            <span className="status-label">Materials API:</span>
            <span className="status-value success">✅ Working</span>
          </div>
          <div className="status-item">
            <span className="status-label">Tips API:</span>
            <span className="status-value success">✅ Working</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 