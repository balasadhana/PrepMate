import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminQuizManagementPage.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminQuizManagementPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' or 'analytics'
  const [message, setMessage] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    domainDistribution: {
      labels: [],
      datasets: []
    },
    quizStats: {
      totalQuizzes: 0,
      totalDomains: 0,
      averageQuestions: 0
    }
  });

  // Quiz form state - updated for individual questions
  const [quizForm, setQuizForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    domain: '',
    explanation: ''
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  // Predefined domains
  const domains = ['DBMS', 'DSA', 'Frontend', 'Backend', 'System Design', 'Other'];

  // Fetch quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
    generateAnalytics();
  }, []);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/quizzes`);
      if (response.data.success) {
        setQuizzes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setMessage('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  // Generate analytics data
  const generateAnalytics = () => {
    const domainCounts = {};
    quizzes.forEach(quiz => {
      domainCounts[quiz.domain] = (domainCounts[quiz.domain] || 0) + 1;
    });

    const domainLabels = Object.keys(domainCounts);
    const domainData = Object.values(domainCounts);

    setAnalyticsData({
      domainDistribution: {
        labels: domainLabels,
        datasets: [{
          label: 'Quizzes per Domain',
          data: domainData,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
          borderWidth: 2
        }]
      },
      quizStats: {
        totalQuizzes: quizzes.length,
        totalDomains: domainLabels.length,
        averageQuestions: quizzes.length > 0 ? Math.round(quizzes.length / domainLabels.length) : 0
      }
    });
  };

  // Handle quiz form input changes
  const handleQuizInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('option')) {
      const optionIndex = parseInt(name.replace('option', ''));
      setQuizForm(prev => ({
        ...prev,
        options: prev.options.map((option, index) => 
          index === optionIndex ? value : option
        )
      }));
    } else {
      setQuizForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    
    if (!quizForm.question || !quizForm.domain || !quizForm.correctAnswer) {
      setMessage('Please fill in question, domain, and correct answer');
      return;
    }

    // Check if all options are filled
    if (quizForm.options.some(option => !option.trim())) {
      setMessage('Please fill in all four options');
      return;
    }

    try {
      setLoading(true);
      
      // Create quiz with mock createdBy ID (admin)
      const quizData = {
        ...quizForm,
        createdBy: '507f1f77bcf86cd799439011' // Mock admin ID
      };

      await axios.post(`${API_BASE_URL}/quizzes`, quizData);

      setMessage('Quiz question created successfully!');
      setQuizForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        domain: '',
        explanation: ''
      });
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      console.error('Error creating quiz:', error);
      setMessage(error.response?.data?.error || 'Failed to create quiz question');
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz deletion
  const handleQuizDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz question?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/quizzes/${quizId}`);
      setMessage('Quiz question deleted successfully!');
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setMessage('Failed to delete quiz question');
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz status toggle
  const handleStatusToggle = async (quizId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.patch(`${API_BASE_URL}/quizzes/${quizId}`, { status: newStatus });
      setMessage(`Quiz status updated to ${newStatus}`);
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      console.error('Error updating quiz status:', error);
      setMessage('Failed to update quiz status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-quiz-management">
        <div className="page-header">
          <h1>Quiz Management</h1>
          <p>Create and manage individual quiz questions for different domains</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
            <button onClick={() => setMessage('')} className="close-btn">×</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            📝 Manage Quizzes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="quizzes-section">
            {/* Create Quiz Form */}
            <div className="create-quiz-section">
              <div className="section-header">
                <h2>Create New Quiz Question</h2>
                <span className="section-subtitle">Add individual quiz questions for different domains</span>
              </div>
              <form onSubmit={handleQuizSubmit} className="quiz-form">
                <div className="form-group">
                  <label htmlFor="question">Question *</label>
                  <textarea
                    id="question"
                    name="question"
                    value={quizForm.question}
                    onChange={handleQuizInputChange}
                    placeholder="Enter the quiz question..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="domain">Domain *</label>
                  <select
                    id="domain"
                    name="domain"
                    value={quizForm.domain}
                    onChange={handleQuizInputChange}
                    required
                  >
                    <option value="">Select domain</option>
                    {domains.map((domain, index) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="options-section">
                  <label>Options *</label>
                  <div className="options-grid">
                    {quizForm.options.map((option, index) => (
                      <div key={index} className="option-input">
                        <label htmlFor={`option${index}`}>
                          {String.fromCharCode(65 + index)}:
                        </label>
                        <input
                          type="text"
                          id={`option${index}`}
                          name={`option${index}`}
                          value={option}
                          onChange={handleQuizInputChange}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="correctAnswer">Correct Answer *</label>
                    <select
                      id="correctAnswer"
                      name="correctAnswer"
                      value={quizForm.correctAnswer}
                      onChange={handleQuizInputChange}
                      required
                    >
                      <option value="">Select correct answer</option>
                      {quizForm.options.map((option, index) => (
                        <option key={index} value={option} disabled={!option.trim()}>
                          {String.fromCharCode(65 + index)}: {option || 'Enter option first'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="explanation">Explanation (Optional)</label>
                    <textarea
                      id="explanation"
                      name="explanation"
                      value={quizForm.explanation}
                      onChange={handleQuizInputChange}
                      placeholder="Explain why this answer is correct..."
                      rows="2"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="create-btn">
                  {loading ? 'Creating...' : '✨ Create Quiz Question'}
                </button>
              </form>
            </div>

            {/* Quizzes List */}
            <div className="quizzes-list-section">
              <div className="section-header">
                <h2>All Quiz Questions ({quizzes.length})</h2>
                <span className="section-subtitle">Manage your created quiz questions</span>
              </div>
              
              {loading ? (
                <div className="loading">Loading quizzes...</div>
              ) : quizzes.length === 0 ? (
                <div className="no-quizzes">
                  <p>No quiz questions created yet. Create your first one above!</p>
                </div>
              ) : (
                <div className="quizzes-grid">
                  {quizzes.map((quiz) => (
                    <div key={quiz._id} className="quiz-card">
                      <div className="quiz-header">
                        <span className={`domain-badge ${quiz.domain.toLowerCase()}`}>
                          {quiz.domain}
                        </span>
                        <div className="quiz-actions">
                          <button
                            onClick={() => handleStatusToggle(quiz._id, quiz.status)}
                            className={`status-btn ${quiz.status === 'Active' ? 'active' : 'inactive'}`}
                          >
                            {quiz.status}
                          </button>
                          <button
                            onClick={() => handleQuizDelete(quiz._id)}
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="quiz-content">
                        <h3 className="question-text">{quiz.question}</h3>
                        
                        <div className="options-list">
                          {quiz.options.map((option, index) => (
                            <div key={index} className={`option ${option === quiz.correctAnswer ? 'correct' : ''}`}>
                              <span className="option-label">
                                {String.fromCharCode(65 + index)}:
                              </span>
                              <span className="option-text">{option}</span>
                              {option === quiz.correctAnswer && (
                                <span className="correct-badge">✓</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {quiz.explanation && (
                          <div className="explanation">
                            <strong>Explanation:</strong> {quiz.explanation}
                          </div>
                        )}
                      </div>

                      <div className="quiz-footer">
                        <span className="created-date">
                          Created: {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-header">
              <h2>Quiz Analytics</h2>
              <p>Overview of quiz performance and distribution</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>Total Questions</h3>
                  <p className="stat-number">{analyticsData.quizStats.totalQuizzes}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏷️</div>
                <div className="stat-content">
                  <h3>Domains Covered</h3>
                  <p className="stat-number">{analyticsData.quizStats.totalDomains}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Avg per Domain</h3>
                  <p className="stat-number">{analyticsData.quizStats.averageQuestions}</p>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Questions by Domain</h3>
                <div className="chart-container">
                  <Doughnut 
                    data={analyticsData.domainDistribution}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuizManagementPage; 