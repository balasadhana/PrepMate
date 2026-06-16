import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalMockTests: 0,
    uploadedMaterials: 0,
    totalTemplates: 0,
    totalTips: 0,
    totalQuizzes: 0,
    pendingExperiences: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    materialCategories: [],
    quizCategories: [],
    experienceStatus: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const API_BASE_URL = 'https://prepmate-backend-wy02.onrender.com/api/admin';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        usersResponse,
        templatesResponse,
        tipsResponse,
        materialsResponse,
        quizzesResponse,
        experiencesResponse
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/resume-templates`),
        axios.get(`${API_BASE_URL}/tips`),
        axios.get(`${API_BASE_URL}/materials`),
        axios.get(`${API_BASE_URL}/quizzes`),
        axios.get(`${API_BASE_URL}/experiences`)
      ]);

      const users = usersResponse.data || [];
      const materials = materialsResponse.data || [];
      const quizzes = quizzesResponse.data || [];
      const experiences = experiencesResponse.data || [];

      setDashboardData({
        totalUsers: users.length || 0,
        pendingApprovals: users.filter(user => !user.isApproved).length || 0,
        totalMockTests: quizzes.length || 0,
        uploadedMaterials: materials.length || 0,
        totalTemplates: templatesResponse.data.length || 0,
        totalTips: tipsResponse.data.length || 0,
        totalQuizzes: quizzes.length || 0,
        pendingExperiences: experiences.filter(exp => exp.status === 'Pending').length || 0
      });

      // Generate analytics data
      generateAnalyticsData(users, materials, quizzes, experiences);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = (users, materials, quizzes, experiences) => {
    // User growth data (mock data for demonstration)
    const userGrowthData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Users',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#4e9eff',
        backgroundColor: 'rgba(78, 158, 255, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    // Material categories distribution
    const materialCategories = materials.reduce((acc, material) => {
      acc[material.category] = (acc[material.category] || 0) + 1;
      return acc;
    }, {});

    const materialData = {
      labels: Object.keys(materialCategories),
      datasets: [{
        data: Object.values(materialCategories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };

    // Quiz categories distribution
    const quizCategories = quizzes.reduce((acc, quiz) => {
      acc[quiz.category] = (acc[quiz.category] || 0) + 1;
      return acc;
    }, {});

    const quizData = {
      labels: Object.keys(quizCategories),
      datasets: [{
        data: Object.values(quizCategories),
        backgroundColor: [
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0'
        ]
      }]
    };

    // Experience status distribution
    const experienceStatus = experiences.reduce((acc, exp) => {
      acc[exp.status] = (acc[exp.status] || 0) + 1;
      return acc;
    }, {});

    const experienceData = {
      labels: Object.keys(experienceStatus),
      datasets: [{
        data: Object.values(experienceStatus),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }]
    };

    setAnalyticsData({
      userGrowth: userGrowthData,
      materialCategories: materialData,
      quizCategories: quizData,
      experienceStatus: experienceData,
      recentActivity: generateRecentActivity(users, materials, quizzes, experiences)
    });
  };

  const generateRecentActivity = (users, materials, quizzes, experiences) => {
    const activities = [];

    // Add recent user registrations
    users.slice(0, 3).forEach(user => {
      activities.push({
        type: 'user',
        message: `New user registered: ${user.email}`,
        time: new Date(user.createdAt).toLocaleDateString(),
        icon: '👤'
      });
    });

    // Add recent material uploads
    materials.slice(0, 3).forEach(material => {
      activities.push({
        type: 'material',
        message: `New material uploaded: ${material.title}`,
        time: new Date(material.uploadedAt).toLocaleDateString(),
        icon: '📚'
      });
    });

    // Add recent quiz creations
    quizzes.slice(0, 3).forEach(quiz => {
      activities.push({
        type: 'quiz',
        message: `New quiz created: ${quiz.title}`,
        time: new Date(quiz.createdAt).toLocaleDateString(),
        icon: '🧠'
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p className="subtitle">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="header-actions">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="timeframe-selector"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button onClick={fetchDashboardData} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Key Metrics Cards */}
            <section className="metrics-section">
              <div className="metrics-grid">
                <div className="metric-card primary">
                  <div className="metric-icon">👥</div>
                  <div className="metric-content">
                    <h3>Total Users</h3>
                    <p className="metric-value">{dashboardData.totalUsers}</p>
                    <span className="metric-change positive">+12% from last month</span>
                  </div>
                </div>

                <div className="metric-card warning">
                  <div className="metric-icon">⏳</div>
                  <div className="metric-content">
                    <h3>Pending Approvals</h3>
                    <p className="metric-value">{dashboardData.pendingApprovals}</p>
                    <span className="metric-change neutral">No change</span>
                  </div>
                </div>

                <div className="metric-card info">
                  <div className="metric-icon">📚</div>
                  <div className="metric-content">
                    <h3>Study Materials</h3>
                    <p className="metric-value">{dashboardData.uploadedMaterials}</p>
                    <span className="metric-change positive">+8% from last week</span>
                  </div>
                </div>

                <div className="metric-card success">
                  <div className="metric-icon">🧠</div>
                  <div className="metric-content">
                    <h3>Mock Tests</h3>
                    <p className="metric-value">{dashboardData.totalMockTests}</p>
                    <span className="metric-change positive">+15% from last month</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics Charts */}
            <section className="analytics-section">
              <div className="charts-grid">
                {/* User Growth Chart */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>User Growth Trend</h3>
                    <span className="chart-subtitle">New user registrations over time</span>
                  </div>
                  <div className="chart-container">
                    <Line data={analyticsData.userGrowth} options={lineOptions} />
                  </div>
                </div>

                {/* Material Categories */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Study Material Categories</h3>
                    <span className="chart-subtitle">Distribution by category</span>
                  </div>
                  <div className="chart-container">
                    <Doughnut data={analyticsData.materialCategories} options={chartOptions} />
                  </div>
                </div>

                {/* Quiz Categories */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Quiz Categories</h3>
                    <span className="chart-subtitle">Mock test distribution</span>
                  </div>
                  <div className="chart-container">
                    <Pie data={analyticsData.quizCategories} options={chartOptions} />
                  </div>
                </div>

                {/* Experience Status */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Experience Posts Status</h3>
                    <span className="chart-subtitle">Approval status distribution</span>
                  </div>
                  <div className="chart-container">
                    <Bar
                      data={analyticsData.experienceStatus}
                      options={{
                        ...chartOptions,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="activity-section">
              <div className="activity-card">
                <div className="activity-header">
                  <h3>Recent Activity</h3>
                  <span className="activity-subtitle">Latest platform activities</span>
                </div>
                <div className="activity-list">
                  {analyticsData.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-content">
                        <p className="activity-message">{activity.message}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions-section">
              <div className="quick-actions-grid">
                <div className="action-card">
                  <div className="action-icon">📝</div>
                  <h4>Upload Template</h4>
                  <p>Add new resume templates</p>
                </div>
                <div className="action-card">
                  <div className="action-icon">💡</div>
                  <h4>Add Tips</h4>
                  <p>Create interview tips</p>
                </div>
                <div className="action-card">
                  <div className="action-icon">📚</div>
                  <h4>Upload Material</h4>
                  <p>Add study materials</p>
                </div>
                <div className="action-card">
                  <div className="action-icon">🧠</div>
                  <h4>Create Quiz</h4>
                  <p>Build mock tests</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
